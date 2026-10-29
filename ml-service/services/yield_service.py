import json
import pandas as pd
import os
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models", "yield")
MODEL_PATH = os.path.join(MODEL_DIR, "soybean_yield_model.joblib")
METRICS_PATH = os.path.join(MODEL_DIR, "soybean_yield_metrics.json")
DISPLAY_NAMES = {
    "AHMEDNAGAR": "Ahilyanagar (Ahmednagar)",
    "AURANGABAD": "Chhatrapati Sambhajinagar (Aurangabad)",
    "OSMANABAD": "Dharashiv (Osmanabad)",
}

if not os.path.isfile(MODEL_PATH):
    raise FileNotFoundError(f"Trained soybean yield model is missing: {MODEL_PATH}")
if not os.path.isfile(METRICS_PATH):
    raise FileNotFoundError(f"Soybean yield model metrics are missing: {METRICS_PATH}")

model = joblib.load(MODEL_PATH)
with open(METRICS_PATH, encoding="utf-8") as metrics_file:
    model_metadata = json.load(metrics_file)


def get_supported_districts():
    return [
        {"value": district, "label": DISPLAY_NAMES.get(district, district.title())}
        for district in model_metadata["districts"]
    ]

def predict_yield(data):
    district = str(data.get("district", "")).strip().upper()
    supported_districts = model_metadata["districts"]
    if district not in supported_districts:
        return {
            "error": "Select a district supported by the Maharashtra soybean model",
            "status": "error",
        }

    features = {
        "district": district,
        "rainfall_mm": float(data["rainfall_mm"]),
        "temperature_c": float(data["temperature_c"]),
        "humidity_percent": float(data["humidity_percent"]),
    }
    features_df = pd.DataFrame([features])
    predicted_yield = max(0.0, float(model.predict(features_df)[0]))
    area_hectare = float(data["area_hectare"])

    warnings = []
    for feature, value in features.items():
        if feature == "district":
            continue
        lower, upper = model_metadata["input_ranges_p05_p95"][feature]
        if value < lower or value > upper:
            warnings.append(
                f"{feature.replace('_', ' ').capitalize()} is outside the "
                "central range of the historical training data."
            )

    return {
        "yield_kg_per_hectare": round(predicted_yield, 2),
        "estimated_total_production_kg": round(predicted_yield * area_hectare, 2),
        "model_version": model_metadata["model_version"],
        "validation_metrics": model_metadata["validation"],
        "input_notice": (
            "Soil N/P/K readings are recorded for your history but are not used "
            "by this model because matching historical soil measurements were unavailable."
        ),
        "warnings": warnings,
        "status": "success",
    }