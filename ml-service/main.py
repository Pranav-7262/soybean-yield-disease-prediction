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
    n: float
    p: float
    k: float
    temperature: float
    soil_moisture: float
    rainfall: float
    ph: float

@app.get("/")
def home():
    return {"message": "ML Service is up and running!"}

# @app.post("/predict/yield")
# async def predict_yield_api(request: YieldRequest):
    # try:
    #     data = {
    #         "N": request.n,
    #         "P": request.p,
    #         "K": request.k,
    #         "temperature": request.temperature,
    #         "soil_moisture": request.soil_moisture,
    #         "rainfall": request.rainfall,
    #         "ph": request.ph
    #     }

    #     result = predict_yield(data)

    #     return {
    #         "success": True,
    #         "predicted_yield": round(result, 2),
    #         "unit": "quintals/acre"
    #     }

    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))

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

        # Optional: delete file after prediction
        os.remove(file_path)

        return {
            "success": True,
            "prediction": result["prediction"],
            "confidence": result["confidence"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))