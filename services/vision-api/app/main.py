from io import BytesIO

import cv2
import httpx
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image

from app.calibration import detect_credit_card, relative_depth_to_metric_mm
from app.depth import estimate_relative_depth
from app.schemas import (
    AnalyzeDepthResponse,
    CalibrationResponse,
    DepthResponse,
    GcsAnalyzeRequest,
    RegionVolumeResponse,
)
from app.segmentation import segment_food_regions
from app.volume import estimate_region_volumes

app = FastAPI(title="Aevio Vision API")


@app.get("/")
async def root():
    return {"service": "vision-api", "status": "ok"}


@app.get("/health")
async def health():
    return {"ok": True}


@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "content_type": file.content_type,
    }


async def _read_image_from_upload(file: UploadFile) -> bytes:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are supported")
    return await file.read()


async def _read_image_from_url(image_url: str) -> bytes:
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        response = await client.get(image_url)
        response.raise_for_status()
        return response.content


def _decode_image(raw: bytes) -> tuple[Image.Image, np.ndarray]:
    try:
        image = Image.open(BytesIO(raw)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid image bytes") from exc

    rgb = np.asarray(image)
    return image, cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)


def _analyze_image(raw: bytes) -> AnalyzeDepthResponse:
    image, image_bgr = _decode_image(raw)
    relative_depth, inference_seconds = estimate_relative_depth(image)
    calibration = detect_credit_card(image_bgr)
    metric_depth = relative_depth_to_metric_mm(relative_depth, calibration)
    regions = segment_food_regions(image_bgr)
    region_volumes = estimate_region_volumes(regions, metric_depth, calibration)
    warnings: list[str] = []

    if not calibration.detected:
        warnings.append("credit_card_not_detected")
    if not region_volumes:
        warnings.append("food_regions_not_detected")

    return AnalyzeDepthResponse(
        ok=True,
        calibration=CalibrationResponse(
            detected=calibration.detected,
            pixelsPerMm=calibration.pixels_per_mm,
            referenceWidthPx=calibration.reference_width_px,
            referenceHeightPx=calibration.reference_height_px,
            confidence=calibration.confidence,
            reason=calibration.reason,
        ),
        depth=DepthResponse(
            width=image.width,
            height=image.height,
            min=float(np.min(relative_depth)),
            max=float(np.max(relative_depth)),
            inferenceMs=int(inference_seconds * 1000),
        ),
        regions=[
            RegionVolumeResponse(
                regionId=region.region_id,
                bbox=region.bbox,
                areaPx=region.area_px,
                areaCm2=region.area_cm2,
                averageHeightMm=region.average_height_mm,
                volumeCm3=region.volume_cm3,
                estimatedWeightG=region.estimated_weight_g,
                confidence=region.confidence,
            )
            for region in region_volumes
        ],
        warnings=warnings,
    )


@app.post("/analyze-depth", response_model=AnalyzeDepthResponse)
async def analyze_depth(
    file: UploadFile | None = File(default=None),
):
    if file is None:
        raise HTTPException(status_code=400, detail="Missing image file")

    raw = await _read_image_from_upload(file)
    return _analyze_image(raw)


@app.post("/analyze-depth/gcs", response_model=AnalyzeDepthResponse)
async def analyze_depth_from_gcs(payload: GcsAnalyzeRequest):
    if not payload.image_url:
        raise HTTPException(
            status_code=400,
            detail="imageUrl is required because gs:// reads need signed/public access",
        )

    raw = await _read_image_from_url(payload.image_url)
    return _analyze_image(raw)