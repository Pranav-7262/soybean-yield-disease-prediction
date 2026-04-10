from fastapi import FastAPI, HTTPException
from pydantic import BaseModel 
# from services.yield_service import predict_yield
from fastapi import UploadFile, File
import shutil
import os
from services.disease_service import predict_disease

app = FastAPI(title="Soybean Agri-AI ML Service")

ALLOWED_TYPES = ["image/jpeg", "image/png"]

class YieldRequest(BaseModel):
    rainfall_mm: float
    temperature_c: float
    humidity_percent: float
    soil_n: float
    soil_p: float
    soil_k: float
    area_hectare: float

@app.get("/")
def home():
    return {"message": "Soybean Agri-AI ML Service is running! ✅"}

@app.post("/predict/yield")
async def predict_yield_api(request: YieldRequest):
    try:
        data = {
            "N": request.n,
            "P": request.p,
            "K": request.k,
            "temperature": request.temperature,
            "soil_moisture": request.soil_moisture,
            "rainfall": request.rainfall,
            "ph": request.ph
        }

        result = predict_yield(data)

        return {
            "success": True,
            "predicted_yield": round(result, 2),
            "unit": "quintals/acre"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/disease")
async def predict_disease_api(file: UploadFile = File(...)):
    try:
        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Only .jpg and .png images are allowed")
        # Save uploaded file temporarily
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)

        file_path = os.path.join(upload_dir, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run prediction
        result = predict_disease(file_path)
        data = {
            "rainfall_mm": request.rainfall_mm,
            "temperature_c": request.temperature_c,
            "humidity_percent": request.humidity_percent,
            "soil_n": request.soil_n,
            "soil_p": request.soil_p,
            "soil_k": request.soil_k,
            "area_hectare": request.area_hectare
        }

        # Optional: delete file after prediction
        os.remove(file_path)

        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("error"))

        return {
            "success": True,
            "prediction": result["prediction"],
            "confidence": result["confidence"]
            "predicted_yield_kg_per_hectare": result.get("yield_kg_per_hectare"),
            "unit": "kg/hectare",
            "model_accuracy": "99.75%"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
