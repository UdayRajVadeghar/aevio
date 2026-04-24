import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getObjectMetadata,
  getUploadResultFromObjectKey,
  isUserOwnedObjectKey,
} from "@/lib/gcs";
import { analyzeMealFromGcs } from "@/lib/gemini";
import { getCurrentIstTime } from "@/lib/ist-time";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
]);
const MAX_BYTES = 10 * 1024 * 1024;
const MAX_MEAL_HINT_LENGTH = 180;

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  let payload: {
    objectKey?: unknown;
    mimeType?: unknown;
    mealHint?: unknown;
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const objectKey =
    typeof payload.objectKey === "string" ? payload.objectKey.trim() : "";
  if (!objectKey) {
    return NextResponse.json(
      { error: "Missing 'objectKey' in body" },
      { status: 400 },
    );
  }
  if (!isUserOwnedObjectKey(userId, objectKey)) {
    return NextResponse.json(
      { error: "Object key does not belong to the current user" },
      { status: 403 },
    );
  }

  const mimeType =
    typeof payload.mimeType === "string" ? payload.mimeType.toLowerCase() : "";
  if (!ALLOWED_MIME.has(mimeType)) {
    return NextResponse.json(
      { error: `Unsupported image type: ${mimeType || "unknown"}` },
      { status: 400 },
    );
  }

  const mealHint =
    typeof payload.mealHint === "string" ? payload.mealHint.trim() : "";
  if (mealHint.length > MAX_MEAL_HINT_LENGTH) {
    return NextResponse.json(
      {
        error: `Meal details must be ${MAX_MEAL_HINT_LENGTH} characters or fewer`,
      },
      { status: 400 },
    );
  }

  let metadata;
  try {
    metadata = await getObjectMetadata(objectKey);
  } catch (err) {
    console.error("GCS metadata lookup failed:", err);
    return NextResponse.json(
      { error: "Failed to verify uploaded image" },
      { status: 502 },
    );
  }
  if (!metadata) {
    return NextResponse.json({ error: "Uploaded image not found" }, { status: 400 });
  }
  if (metadata.sizeBytes <= 0 || metadata.sizeBytes > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be between 1 byte and 10 MB" },
      { status: 400 },
    );
  }
  if (metadata.mimeType !== mimeType) {
    return NextResponse.json(
      { error: "Uploaded image MIME type does not match requested MIME type" },
      { status: 400 },
    );
  }

  const uploaded = getUploadResultFromObjectKey(objectKey);

  const row = await db.mealAnalysis.create({
    data: {
      userId,
      imageUrl: uploaded.publicUrl,
      gcsUri: uploaded.gcsUri,
      status: "PENDING",
    },
    select: { id: true },
  });

  try {
    const { result, rawText } = await analyzeMealFromGcs(
      uploaded.gcsUri,
      mimeType,
      mealHint || undefined,
    );
    const detectedItems = result.plateContents.items;
    const istNow = await getCurrentIstTime();
    const [, dailyCalories] = await db.$transaction([
      db.mealAnalysis.update({
        where: { id: row.id },
        data: {
          status: "COMPLETE",
          calories: result.calories,
          protein: result.protein,
          carbs: result.carbs,
          fat: result.fat,
          foodItems: result.plateContents,
          loggedAtIst: istNow.loggedAtIst,
          loggedDateIst: istNow.loggedDateIst,
          loggedTimezone: istNow.loggedTimezone,
        },
      }),
      db.dailyCalorieTotal.upsert({
        where: {
          userId_dateKey: {
            userId,
            dateKey: istNow.loggedDateIst,
          },
        },
        update: {
          totalCalories: {
            increment: result.calories,
          },
          timezone: istNow.loggedTimezone,
        },
        create: {
          userId,
          dateKey: istNow.loggedDateIst,
          timezone: istNow.loggedTimezone,
          totalCalories: result.calories,
        },
        select: {
          totalCalories: true,
          dateKey: true,
          timezone: true,
        },
      }),
    ]);

    return NextResponse.json({
      id: row.id,
      imageUrl: uploaded.publicUrl,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      foodItems: detectedItems,
      plateContents: result.plateContents,
      confidence: result.confidence,
      llmResponse: rawText,
      loggedAtIst: istNow.loggedAtIst,
      loggedDateIst: dailyCalories.dateKey,
      loggedTimezone: dailyCalories.timezone,
      todayCaloriesTotal: dailyCalories.totalCalories,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Gemini analysis failed:", message);
    await db.mealAnalysis.update({
      where: { id: row.id },
      data: { status: "FAILED", errorMsg: message.slice(0, 1000) },
    });
    return NextResponse.json(
      { error: "Analysis failed", id: row.id },
      { status: 500 },
    );
  }
}
