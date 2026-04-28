from pydantic import BaseModel, Field


class GcsAnalyzeRequest(BaseModel):
    image_url: str | None = Field(default=None, alias="imageUrl")
    gcs_uri: str | None = Field(default=None, alias="gcsUri")
    mime_type: str = Field(alias="mimeType")


class CalibrationResponse(BaseModel):
    detected: bool
    pixels_per_mm: float | None = Field(alias="pixelsPerMm")
    reference_width_px: float | None = Field(alias="referenceWidthPx")
    reference_height_px: float | None = Field(alias="referenceHeightPx")
    confidence: float
    reason: str | None = None


class DepthResponse(BaseModel):
    width: int
    height: int
    min: float
    max: float
    inference_ms: int = Field(alias="inferenceMs")


class RegionVolumeResponse(BaseModel):
    region_id: str = Field(alias="regionId")
    bbox: tuple[int, int, int, int]
    area_px: int = Field(alias="areaPx")
    area_cm2: float | None = Field(alias="areaCm2")
    average_height_mm: float | None = Field(alias="averageHeightMm")
    volume_cm3: float | None = Field(alias="volumeCm3")
    estimated_weight_g: float | None = Field(alias="estimatedWeightG")
    confidence: float


class AnalyzeDepthResponse(BaseModel):
    ok: bool
    calibration: CalibrationResponse
    depth: DepthResponse
    regions: list[RegionVolumeResponse]
    warnings: list[str] = []
