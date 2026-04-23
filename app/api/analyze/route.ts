import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadImage } from "@/lib/gcs";
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

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid multipart/form-data body" },
      { status: 400 },
    );
  }

  const fileEntry = form.get("image");
  if (!(fileEntry instanceof File)) {
    return NextResponse.json(
      { error: "Missing 'image' field in FormData" },
      { status: 400 },
    );
  }

  const mealHintEntry = form.get("mealHint");
  if (mealHintEntry instanceof File) {
    return NextResponse.json(
      { error: "Invalid 'mealHint' field in FormData" },
      { status: 400 },
    );
  }

  const mealHint = mealHintEntry?.trim() ?? "";
  if (mealHint.length > MAX_MEAL_HINT_LENGTH) {
    return NextResponse.json(
      {
        error: `Meal details must be ${MAX_MEAL_HINT_LENGTH} characters or fewer`,
      },
      { status: 400 },
    );
  }

  const mimeType = (fileEntry.type || "").toLowerCase();
  if (!ALLOWED_MIME.has(mimeType)) {
    return NextResponse.json(
      { error: `Unsupported image type: ${mimeType || "unknown"}` },
      { status: 400 },
    );
  }
  if (fileEntry.size <= 0 || fileEntry.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be between 1 byte and 10 MB" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await fileEntry.arrayBuffer());

  let uploaded: Awaited<ReturnType<typeof uploadImage>>;
  try {
    uploaded = await uploadImage(buffer, mimeType, userId);
  } catch (err) {
    console.error("GCS upload failed:", err);
    return NextResponse.json(
      { error: "Failed to store image" },
      { status: 502 },
    );
  }

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
