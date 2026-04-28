const DEFAULT_VISION_API_URL = "http://127.0.0.1:8000";

export type VolumeRegion = {
  regionId: string;
  bbox: [number, number, number, number];
  areaPx: number;
  areaCm2: number | null;
  averageHeightMm: number | null;
  volumeCm3: number | null;
  estimatedWeightG: number | null;
  confidence: number;
};

export type VolumeEstimate = {
  ok: boolean;
  calibration: {
    detected: boolean;
    pixelsPerMm: number | null;
    referenceWidthPx: number | null;
    referenceHeightPx: number | null;
    confidence: number;
    reason?: string | null;
  };
  depth: {
    width: number;
    height: number;
    min: number;
    max: number;
    inferenceMs: number;
  };
  regions: VolumeRegion[];
  warnings: string[];
};

export function getVisionApiBaseUrl(): string {
  return (process.env.VISION_API_URL?.trim() || DEFAULT_VISION_API_URL).replace(
    /\/$/,
    "",
  );
}

function isVolumeEstimate(value: unknown): value is VolumeEstimate {
  if (!value || typeof value !== "object") return false;
  const estimate = value as Record<string, unknown>;
  return (
    estimate.ok === true &&
    typeof estimate.calibration === "object" &&
    typeof estimate.depth === "object" &&
    Array.isArray(estimate.regions)
  );
}

export async function estimateVolumeFromImageUrl({
  imageUrl,
  gcsUri,
  mimeType,
}: {
  imageUrl: string;
  gcsUri: string;
  mimeType: string;
}): Promise<VolumeEstimate | null> {
  const base = getVisionApiBaseUrl();

  try {
    const response = await fetch(`${base}/analyze-depth/gcs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, gcsUri, mimeType }),
    });

    if (!response.ok) {
      console.warn("Vision API volume estimate failed:", response.status);
      return null;
    }

    const json: unknown = await response.json();
    if (!isVolumeEstimate(json)) {
      console.warn("Vision API returned an unexpected response shape");
      return null;
    }

    return json;
  } catch (error) {
    console.warn("Vision API volume estimate unavailable:", error);
    return null;
  }
}
