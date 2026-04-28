from functools import lru_cache
from time import perf_counter

import cv2
import numpy as np
from PIL import Image

MODEL_ID = "depth-anything/Depth-Anything-V2-Small-hf"


class DepthEstimationError(RuntimeError):
    pass


@lru_cache(maxsize=1)
def get_depth_pipeline():
    try:
        import torch
        from transformers import pipeline
    except ImportError as exc:
        raise DepthEstimationError(
            "Depth dependencies are not installed. Install torch and transformers."
        ) from exc

    device = 0 if torch.cuda.is_available() else -1
    return pipeline(task="depth-estimation", model=MODEL_ID, device=device)


def normalize_depth(depth: np.ndarray) -> np.ndarray:
    depth = depth.astype(np.float32)
    min_depth = float(np.min(depth))
    max_depth = float(np.max(depth))
    spread = max(max_depth - min_depth, 1e-6)
    return (depth - min_depth) / spread


def estimate_relative_depth(image: Image.Image) -> tuple[np.ndarray, float]:
    started = perf_counter()
    pipe = get_depth_pipeline()
    result = pipe(image.convert("RGB"))
    depth_image = result.get("depth")

    if depth_image is None:
        raise DepthEstimationError("Depth model did not return a depth image")

    depth = np.asarray(depth_image, dtype=np.float32)
    if depth.ndim == 3:
        depth = cv2.cvtColor(depth, cv2.COLOR_RGB2GRAY)

    if depth.shape[:2] != (image.height, image.width):
        depth = cv2.resize(depth, (image.width, image.height), interpolation=cv2.INTER_CUBIC)

    return normalize_depth(depth), perf_counter() - started
