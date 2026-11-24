from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.schemas import DiagnoseResponse, Health, PartPrediction

app = FastAPI(title=settings.app_name, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}


@app.get("/api/health", response_model=Health)
def health() -> Health:
    return Health(status="ok", model_loaded=False)


async def _read_image(upload: UploadFile) -> bytes:
    if upload.content_type not in ALLOWED_TYPES:
        raise HTTPException(415, f"{upload.filename}: expected JPEG, PNG or WebP")
    data = await upload.read()
    if len(data) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(413, f"{upload.filename}: larger than {settings.max_upload_mb} MB")
    return data


@app.post("/api/diagnose", response_model=DiagnoseResponse)
async def diagnose(
    whole_plant: UploadFile = File(..., description="Photo of the whole plant"),
    leaf_underside: UploadFile = File(..., description="Photo of the underside of a leaf"),
) -> DiagnoseResponse:
    """Takes the two capture photos and returns a triage result.

    Placeholder: returns a fixed result until the CNN in documentation/CNN_SETUP.md is trained.
    """
    await _read_image(whole_plant)
    await _read_image(leaf_underside)
    return DiagnoseResponse(
        cause="healthy",
        confidence=0.0,
        parts=[PartPrediction(part="leaf", cause="healthy", label="healthy", confidence=0.0)],
        mock=True,
    )
