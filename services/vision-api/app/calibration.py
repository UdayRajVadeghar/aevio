from dataclasses import dataclass

import cv2
import numpy as np

CREDIT_CARD_WIDTH_MM = 85.6
CREDIT_CARD_HEIGHT_MM = 53.98
CREDIT_CARD_ASPECT_RATIO = CREDIT_CARD_WIDTH_MM / CREDIT_CARD_HEIGHT_MM


@dataclass(frozen=True)
class CalibrationResult:
    detected: bool
    pixels_per_mm: float | None
    reference_width_px: float | None
    reference_height_px: float | None
    confidence: float
    reason: str | None = None


def _order_box_points(points: np.ndarray) -> np.ndarray:
    rect = np.zeros((4, 2), dtype=np.float32)
    sums = points.sum(axis=1)
    diffs = np.diff(points, axis=1)
    rect[0] = points[np.argmin(sums)]
    rect[2] = points[np.argmax(sums)]
    rect[1] = points[np.argmin(diffs)]
    rect[3] = points[np.argmax(diffs)]
    return rect


def detect_credit_card(image_bgr: np.ndarray) -> CalibrationResult:
    height, width = image_bgr.shape[:2]
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150)
    edges = cv2.dilate(edges, np.ones((3, 3), dtype=np.uint8), iterations=1)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    min_area = width * height * 0.005
    max_area = width * height * 0.45
    best: tuple[float, np.ndarray] | None = None

    for contour in contours:
        area = cv2.contourArea(contour)
        if area < min_area or area > max_area:
            continue

        perimeter = cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, 0.03 * perimeter, True)
        if len(approx) != 4 or not cv2.isContourConvex(approx):
            continue

        box = _order_box_points(approx.reshape(4, 2).astype(np.float32))
        top = np.linalg.norm(box[1] - box[0])
        bottom = np.linalg.norm(box[2] - box[3])
        left = np.linalg.norm(box[3] - box[0])
        right = np.linalg.norm(box[2] - box[1])
        card_width_px = max((top + bottom) / 2, (left + right) / 2)
        card_height_px = min((top + bottom) / 2, (left + right) / 2)
        if card_height_px <= 0:
            continue

        aspect_ratio = card_width_px / card_height_px
        aspect_error = abs(aspect_ratio - CREDIT_CARD_ASPECT_RATIO) / CREDIT_CARD_ASPECT_RATIO
        if aspect_error > 0.25:
            continue

        rectangularity = area / max(cv2.contourArea(box.astype(np.float32)), 1.0)
        score = (1.0 - aspect_error) * 0.7 + min(rectangularity, 1.0) * 0.3
        if best is None or score > best[0]:
            best = (score, box)

    if best is None:
        return CalibrationResult(
            detected=False,
            pixels_per_mm=None,
            reference_width_px=None,
            reference_height_px=None,
            confidence=0.0,
            reason="credit_card_not_detected",
        )

    score, box = best
    top = np.linalg.norm(box[1] - box[0])
    bottom = np.linalg.norm(box[2] - box[3])
    left = np.linalg.norm(box[3] - box[0])
    right = np.linalg.norm(box[2] - box[1])
    width_px = max((top + bottom) / 2, (left + right) / 2)
    height_px = min((top + bottom) / 2, (left + right) / 2)
    pixels_per_mm = (width_px / CREDIT_CARD_WIDTH_MM + height_px / CREDIT_CARD_HEIGHT_MM) / 2

    return CalibrationResult(
        detected=True,
        pixels_per_mm=float(pixels_per_mm),
        reference_width_px=float(width_px),
        reference_height_px=float(height_px),
        confidence=float(max(0.0, min(score, 1.0))),
    )


def relative_depth_to_metric_mm(
    relative_depth: np.ndarray, calibration: CalibrationResult
) -> np.ndarray:
    if not calibration.detected or not calibration.pixels_per_mm:
        return np.zeros_like(relative_depth, dtype=np.float32)

    # Monocular depth is relative. Use a conservative food height range anchored
    # by image scale so volume is useful as a prompt hint, not a hard truth.
    max_food_height_mm = 55.0
    return relative_depth.astype(np.float32) * max_food_height_mm
