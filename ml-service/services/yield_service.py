import joblib
import numpy as np
import os

# Relative path to where you just saved the model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/yield/model.pkl")

# Load model once at startup
try:
    model = joblib.load(MODEL_PATH)
    print("✅ Yield Model loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    model = None

def predict_yield(data):
    if model is None:
        return "Model not initialized"
        
    # Ensure these keys match exactly what your Node.js server sends
    features = np.array([[
        data["N"],
        data["P"],
        data["K"],
        data["temperature"],
        data["soil_moisture"],
        data["rainfall"],
        data["ph"]
    ]])

    prediction = model.predict(features)[0]
    return round(float(prediction), 2)