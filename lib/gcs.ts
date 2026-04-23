import { Storage } from "@google-cloud/storage";
import { randomUUID } from "node:crypto";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/webp": "webp",
};

export type UploadResult = {
  publicUrl: string;
  gcsUri: string;
  objectKey: string;
};

let cachedStorage: Storage | null = null;
function getStorage(): Storage {
  if (!cachedStorage) cachedStorage = new Storage();
  return cachedStorage;
}

function getBucketName(): string {
  const bucket = process.env.GCS_BUCKET_NAME;
  if (!bucket) {
    throw new Error("GCS_BUCKET_NAME is not configured");
  }
  return bucket;
}

export async function uploadImage(
  buffer: Buffer,
  mimeType: string,
  userId: string,
): Promise<UploadResult> {
  const ext = MIME_TO_EXT[mimeType.toLowerCase()] ?? "bin";
  const bucketName = getBucketName();
  const objectKey = `meals/${userId}/${randomUUID()}.${ext}`;

  const bucket = getStorage().bucket(bucketName);
  await bucket.file(objectKey).save(buffer, {
    contentType: mimeType,
    resumable: false,
    metadata: {
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  return {
    publicUrl: `https://storage.googleapis.com/${bucketName}/${objectKey}`,
    gcsUri: `gs://${bucketName}/${objectKey}`,
    objectKey,
  };
}
