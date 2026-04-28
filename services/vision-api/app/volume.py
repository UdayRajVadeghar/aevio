from dataclasses import dataclass

import numpy as np

from app.calibration import CalibrationResult
from app.segmentation import FoodRegion

FOOD_DENSITY_G_PER_CM3 = {
    "rice": 0.85,
    "cooked rice": 0.85,
    "chicken": 1.05,
    "paneer": 1.03,
    "egg": 1.03,
    "bread": 0.29,
    "pasta": 0.75,
    "potato": 0.75,
    "salad": 0.30,
    "vegetables": 0.55,
    "fruit": 0.65,
    "sauce": 1.05,
    "default": 0.80,
}


@dataclass(frozen=True)
class RegionVolume:
    region_id: str
    bbox: tuple[int, int, int, int]
    area_px: int
    area_cm2: float | None
    average_height_mm: float | None
    volume_cm3: float | None
    estimated_weight_g: float | None
    confidence: float


def estimate_region_volumes(
    regions: list[FoodRegion],
    metric_depth_mm: np.ndarray,
    calibration: CalibrationResult,
) -> list[RegionVolume]:
    volumes: list[RegionVolume] = []
    pixels_per_mm = calibration.pixels_per_mm if calibration.detected else None

    for region in regions:
        region_pixels = region.mask > 0
        if not np.any(region_pixels) or not pixels_per_mm:
            volumes.append(
                RegionVolume(
                    region_id=region.id,
                    bbox=region.bbox,
                    area_px=region.area_px,
                    area_cm2=None,
                    average_height_mm=None,
                    volume_cm3=None,
                    estimated_weight_g=None,
                    confidence=0.0,
                )
            )
            continue

        area_mm2 = region.area_px / (pixels_per_mm**2)
        heights = metric_depth_mm[region_pixels]
        avg_height_mm = float(np.percentile(heights, 75))
        volume_cm3 = float((area_mm2 * avg_height_mm) / 1000.0)
        estimated_weight_g = volume_cm3 * FOOD_DENSITY_G_PER_CM3["default"]

        volumes.append(
            RegionVolume(
                region_id=region.id,
                bbox=region.bbox,
                area_px=region.area_px,
                area_cm2=float(area_mm2 / 100.0),
                average_height_mm=avg_height_mm,
                volume_cm3=volume_cm3,
                estimated_weight_g=float(estimated_weight_g),
                confidence=float(min(region.confidence, calibration.confidence)),
            )
        )

    return volumes
