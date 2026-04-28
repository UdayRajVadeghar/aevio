"""
Lightweight Cloud Run service that pings other Aevio services on a schedule
to keep them warm. Triggered by Cloud Scheduler every 10 minutes.
"""

import asyncio
import os
import time

import httpx
from fastapi import FastAPI

app = FastAPI(title="Aevio Scheduler")

SERVICES: dict[str, str] = {
    "vision-api": os.getenv(
        "VISION_API_URL", "https://vision-api-gvpj4hfxkq-as.a.run.app"
    ),
    "adk-api": os.getenv(
        "ADK_API_URL", "https://adk-api-gvpj4hfxkq-as.a.run.app"
    ),
}


@app.get("/health")
async def health():
    return {"ok": True}


@app.get("/ping")
async def ping_all():
    """Ping all services and return their status."""
    results: dict[str, dict] = {}

    async with httpx.AsyncClient(timeout=30.0) as client:
        tasks = {
            name: client.get(f"{url}/health") for name, url in SERVICES.items()
        }
        start = time.time()
        responses = await asyncio.gather(
            *tasks.values(), return_exceptions=True
        )
        elapsed_ms = int((time.time() - start) * 1000)

    for name, resp in zip(tasks.keys(), responses):
        if isinstance(resp, Exception):
            results[name] = {"ok": False, "error": str(resp)}
        else:
            results[name] = {"ok": resp.status_code == 200, "status": resp.status_code}

    all_ok = all(r["ok"] for r in results.values())
    return {"ok": all_ok, "elapsedMs": elapsed_ms, "services": results}
