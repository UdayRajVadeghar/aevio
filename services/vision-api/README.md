# Vision API

Minimal FastAPI service for the video-analysis backend.

## How `uv` Works

You usually do not need to manually "enter" the virtual environment.

Use `uv` commands from inside `services/vision-api`:

```bash
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

`uv run ...` automatically uses the local `.venv` for this project.

If you want to activate it manually, you can, but it is optional:

```bash
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Common Commands

Install dependencies from `pyproject.toml` / `uv.lock`:

```bash
uv sync
```

Add a package:

```bash
uv add <package-name>
```

Run the dev server:

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open the docs:

- `http://localhost:8000/docs`
- `http://localhost:8000/health`

## Next Packages You Will Likely Need

For video processing on the server:

```bash
uv add ffmpeg-python
```

You should also install the FFmpeg system binary:

```bash
sudo apt update
sudo apt install -y ffmpeg
```

## Suggested Structure

```text
services/vision-api/
  app/
    __init__.py
    main.py
  pyproject.toml
  uv.lock
  .python-version
```
