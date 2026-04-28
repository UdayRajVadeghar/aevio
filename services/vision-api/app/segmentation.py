from dataclasses import dataclass

import cv2
import numpy as np


@dataclass(frozen=True)
class FoodRegion:
    id: str
    mask: np.ndarray
    bbox: tuple[int, int, int, int]
    area_px: int
    confidence: float


def segment_food_regions(image_bgr: np.ndarray) -> list[FoodRegion]:
    height, width = image_bgr.shape[:2]
    image_area = height * width

    lab = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2LAB)
    hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
    l_channel = lab[:, :, 0]
    saturation = hsv[:, :, 1]

    non_background = np.zeros((height, width), dtype=np.uint8)
    non_background[(saturation > 35) & (l_channel > 30) & (l_channel < 245)] = 255

    # Add textured low-saturation regions such as rice, bread, or pasta.
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    texture = cv2.Laplacian(gray, cv2.CV_32F)
    texture_mask = (np.abs(texture) > 8).astype(np.uint8) * 255
    non_background = cv2.bitwise_or(non_background, texture_mask)

    kernel = np.ones((7, 7), dtype=np.uint8)
    mask = cv2.morphologyEx(non_background, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    min_area = max(300, int(image_area * 0.003))
    max_area = int(image_area * 0.65)
    regions: list[FoodRegion] = []

    for index, contour in enumerate(sorted(contours, key=cv2.contourArea, reverse=True)):
        area = int(cv2.contourArea(contour))
        if area < min_area or area > max_area:
            continue

        region_mask = np.zeros((height, width), dtype=np.uint8)
        cv2.drawContours(region_mask, [contour], -1, 255, thickness=cv2.FILLED)
        x, y, w, h = cv2.boundingRect(contour)
        fill_ratio = area / max(w * h, 1)
        confidence = float(max(0.25, min(0.85, fill_ratio)))

        regions.append(
            FoodRegion(
                id=f"region_{len(regions) + 1}",
                mask=region_mask,
                bbox=(int(x), int(y), int(w), int(h)),
                area_px=area,
                confidence=confidence,
            )
        )

        if len(regions) >= 8:
            break

    if regions:
        return regions

    fallback_mask = np.zeros((height, width), dtype=np.uint8)
    margin_x = int(width * 0.18)
    margin_y = int(height * 0.18)
    fallback_mask[margin_y : height - margin_y, margin_x : width - margin_x] = 255
    return [
        FoodRegion(
            id="region_1",
            mask=fallback_mask,
            bbox=(margin_x, margin_y, width - margin_x * 2, height - margin_y * 2),
            area_px=int(np.count_nonzero(fallback_mask)),
            confidence=0.2,
        )
    ]
