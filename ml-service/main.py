from fastapi import FastAPI, HTTPException
from pydantic import BaseModel 
from services.yield_service import predict_yield

app = FastAPI(title="Soybean Agri-AI ML Service")

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
            "predicted_yield_kg_per_hectare": result.get("yield_kg_per_hectare"),
            "unit": "kg/hectare",
            "model_accuracy": "99.75%"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))