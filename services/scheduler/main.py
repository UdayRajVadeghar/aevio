"""
Lightweight Cloud Run service that continuously pings other Aevio services
to keep them warm. Cloud Scheduler can also trigger /ping as a backup.
"""

import asyncio
import os
import time
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI

SERVICES: dict[str, str] = {
    "vision-api": os.getenv(
        "VISION_API_URL", "https://vision-api-gvpj4hfxkq-as.a.run.app"
    ),
    "adk-api": os.getenv(
        "ADK_API_URL", "https://adk-api-gvpj4hfxkq-as.a.run.app"
    ),
}
PING_INTERVAL_SECONDS = int(os.getenv("PING_INTERVAL_SECONDS", "300"))
_last_ping: dict | None = None


async def ping_services() -> dict:
    """Ping all services and return their status."""
    results: dict[str, dict] = {}

    async with httpx.AsyncClient(timeout=30.0) as client:
        tasks = {
            name: client.get(f"{url.rstrip('/')}/health") for name, url in SERVICES.items()
        }
        start = time.time()
        responses = await asyncio.gather(*tasks.values(), return_exceptions=True)
        elapsed_ms = int((time.time() - start) * 1000)

    for name, resp in zip(tasks.keys(), responses):
        if isinstance(resp, Exception):
            results[name] = {"ok": False, "error": str(resp)}
        else:
            results[name] = {"ok": resp.status_code == 200, "status": resp.status_code}

    all_ok = all(r["ok"] for r in results.values())
    return {"ok": all_ok, "elapsedMs": elapsed_ms, "services": results}


async def keepalive_loop() -> None:
    global _last_ping

    while True:
        try:
            _last_ping = await ping_services()
            print(f"keepalive ping: {_last_ping}", flush=True)
        except Exception as exc:
            _last_ping = {"ok": False, "error": str(exc)}
            print(f"keepalive ping failed: {exc}", flush=True)

        await asyncio.sleep(PING_INTERVAL_SECONDS)


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(keepalive_loop())
    try:
        yield
    finally:
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass


app = FastAPI(title="Aevio Scheduler", lifespan=lifespan)


@app.get("/health")
async def health():
    return {"ok": True, "lastPing": _last_ping}


@app.get("/ping")
async def ping_all():
    global _last_ping

    _last_ping = await ping_services()
    return _last_ping
