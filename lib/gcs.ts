import { Storage } from "@google-cloud/storage";
import { randomUUID } from "node:crypto";

import { ensureGoogleCredentials } from "./google/credentials";

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

export type SignedUploadTarget = UploadResult & {
  uploadUrl: string;
};

let cachedStorage: Storage | null = null;
function getStorage(): Storage {
  if (!cachedStorage) {
    ensureGoogleCredentials();
    cachedStorage = new Storage();
  }
  return cachedStorage;
}

function getBucketName(): string {
  const bucket = process.env.GCS_BUCKET_NAME;
  if (!bucket) {
    throw new Error("GCS_BUCKET_NAME is not configured");
  }
  return bucket;
}

function getObjectKeyForUser(userId: string, mimeType: string): string {
  const ext = MIME_TO_EXT[mimeType.toLowerCase()] ?? "bin";
  return `meals/${userId}/${randomUUID()}.${ext}`;
}

export function getUploadResultFromObjectKey(objectKey: string): UploadResult {
  const bucketName = getBucketName();
  return {
    publicUrl: `https://storage.googleapis.com/${bucketName}/${objectKey}`,
    gcsUri: `gs://${bucketName}/${objectKey}`,
    objectKey,
  };
}

export function isUserOwnedObjectKey(userId: string, objectKey: string): boolean {
  const prefix = `meals/${userId}/`;
  return objectKey.startsWith(prefix);
}

export async function createSignedImageUploadTarget(
  userId: string,
  mimeType: string,
): Promise<SignedUploadTarget> {
  const objectKey = getObjectKeyForUser(userId, mimeType);
  const bucketName = getBucketName();
  const bucket = getStorage().bucket(bucketName);
  const file = bucket.file(objectKey);

  const [uploadUrl] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    contentType: mimeType,
    expires: Date.now() + 15 * 60 * 1000,
  });

  return {
    ...getUploadResultFromObjectKey(objectKey),
    uploadUrl,
  };
}

export async function getObjectMetadata(objectKey: string): Promise<{
  sizeBytes: number;
  mimeType: string;
} | null> {
  const bucket = getStorage().bucket(getBucketName());
  const file = bucket.file(objectKey);
  const [exists] = await file.exists();
  if (!exists) {
    return null;
  }

  const [metadata] = await file.getMetadata();
  const sizeBytes = Number(metadata.size ?? 0);
  return {
    sizeBytes,
    mimeType: (metadata.contentType ?? "").toLowerCase(),
  };
}

export async function uploadImage(
  buffer: Buffer,
  mimeType: string,
  userId: string,
): Promise<UploadResult> {
  const objectKey = getObjectKeyForUser(userId, mimeType);
  const bucketName = getBucketName();

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
