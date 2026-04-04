import pickle
import numpy as np
import pandas as pd
import os

# Path to the trained soybean model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../yeild-prediction/soybean_model.pkl")

# Load model once at startup
try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("✅ Soybean Yield Model loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    model = None

def predict_yield(data):
    """
    Predict soybean yield based on environmental and soil features.
    
    Expected input data keys:
    - rainfall_mm: Rainfall in mm
    - temperature_c: Temperature in Celsius
    - humidity_percent: Humidity percentage
    - soil_n: Soil Nitrogen
    - soil_p: Soil Phosphorus
    - soil_k: Soil Potassium
    - area_hectare: Area in hectares
    """
    if model is None:
        return {"error": "Model not initialized", "status": "error"}
    
    try:
        # Model expects: [Rainfall_mm_x, Temperature_C_x, Humidity_Percent, Soil_N, Soil_P, Soil_K, Area_hectare]
        # Use pandas DataFrame with proper column names to avoid scikit-learn warnings
        features_df = pd.DataFrame([[
            data.get("rainfall_mm", 0),
            data.get("temperature_c", 0),
            data.get("humidity_percent", 0),
            data.get("soil_n", 0),
            data.get("soil_p", 0),
            data.get("soil_k", 0),
            data.get("area_hectare", 0)
        ]], columns=['Rainfall_mm_x', 'Temperature_C_x', 'Humidity_Percent', 
                     'Soil_N', 'Soil_P', 'Soil_K', 'Area_hectare'])

        prediction = model.predict(features_df)[0]
        return {
            "yield_kg_per_hectare": round(float(prediction), 2),
            "status": "success"
        }
    except Exception as e:
        return {
            "error": str(e),
            "status": "error"
        }