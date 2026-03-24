from fastapi import FastAPI, HTTPException
from pydantic import BaseModel 
from services.yield_service import predict_yield

app = FastAPI(title="Soybean Agri-AI ML Service")

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