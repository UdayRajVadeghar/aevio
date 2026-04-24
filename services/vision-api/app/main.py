from fastapi import FastAPI, File, UploadFile

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