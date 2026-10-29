from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from services.yield_service import get_supported_districts, predict_yield
from fastapi import UploadFile, File
import shutil
import os
from services.disease_service import predict_disease

app = FastAPI(title="Soybean Agri-AI ML Service")

ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/pjpeg",
    "image/x-png",
    "application/octet-stream",
]

class YieldRequest(BaseModel):
    district: str = Field(min_length=1)
    rainfall_mm: float = Field(ge=0)
    temperature_c: float
    humidity_percent: float = Field(ge=0, le=100)
    soil_n: float = Field(ge=0)
    soil_p: float = Field(ge=0)
    soil_k: float = Field(ge=0)
    area_hectare: float = Field(gt=0)

@app.get("/")
def home():
    return {"message": "Soybean Agri-AI ML Service is running! ✅"}

@app.get("/predict/yield/districts")
def get_yield_districts_api():
    return {"success": True, "districts": get_supported_districts()}

@app.post("/predict/yield")
async def predict_yield_api(request: YieldRequest):
    try:
        data = {
            "district": request.district,
            "rainfall_mm": request.rainfall_mm,
            "temperature_c": request.temperature_c,
            "humidity_percent": request.humidity_percent,
            "soil_n": request.soil_n,
            "soil_p": request.soil_p,
            "soil_k": request.soil_k,
            "area_hectare": request.area_hectare
        }

        result = predict_yield(data)

        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("error"))

        return {
            "success": True,
            "predicted_yield": result.get("yield_kg_per_hectare"),
            "unit": "kg/hectare",
            "estimated_total_production_kg": result.get("estimated_total_production_kg"),
            "model_version": result.get("model_version"),
            "validation_metrics": result.get("validation_metrics"),
            "input_notice": result.get("input_notice"),
            "warnings": result.get("warnings", []),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/disease")
async def predict_disease_api(file: UploadFile = File(...)):
    try:
        # Check file type (be tolerant of common variants; allow missing content_type)
        if file.content_type and file.content_type not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file.content_type}. Only JPEG/PNG images are allowed"
            )

        # Save uploaded image temporarily
        upload_dir = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "models",
            "uploads"
        )

        os.makedirs(upload_dir, exist_ok=True)

        file_path = os.path.join(upload_dir, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        try:
            # Run disease prediction
            result = predict_disease(file_path)

        finally:
            # Delete uploaded image after prediction
            if os.path.exists(file_path):
                os.remove(file_path)

        return {
            "success": True,
            "prediction": result["disease"],
            "confidence": result["confidence"],
            "model_accuracy": "99.75%"
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
