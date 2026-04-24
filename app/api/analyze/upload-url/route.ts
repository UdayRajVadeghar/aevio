import { auth } from "@/lib/auth";
import { createSignedImageUploadTarget } from "@/lib/gcs";
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

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  let payload: {
    mimeType?: unknown;
    fileSize?: unknown;
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const mimeType =
    typeof payload.mimeType === "string" ? payload.mimeType.toLowerCase() : "";
  if (!ALLOWED_MIME.has(mimeType)) {
    return NextResponse.json(
      { error: `Unsupported image type: ${mimeType || "unknown"}` },
      { status: 400 },
    );
  }

  const fileSize = typeof payload.fileSize === "number" ? payload.fileSize : 0;
  if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be between 1 byte and 10 MB" },
      { status: 400 },
    );
  }

  try {
    const target = await createSignedImageUploadTarget(userId, mimeType);
    return NextResponse.json({
      uploadUrl: target.uploadUrl,
      objectKey: target.objectKey,
      gcsUri: target.gcsUri,
      publicUrl: target.publicUrl,
      method: "PUT",
      headers: {
        "Content-Type": mimeType,
      },
    });
  } catch (err) {
    console.error("Signed upload URL generation failed:", err);
    return NextResponse.json(
      { error: "Failed to create upload URL" },
      { status: 502 },
    );
  }
}
