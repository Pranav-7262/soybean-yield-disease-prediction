"""Train and evaluate the Maharashtra soybean yield model."""

from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder


MODEL_DIR = Path(__file__).resolve().parent
DATA_PATH = MODEL_DIR / "maharashtra_soybean_training.csv"
MODEL_PATH = MODEL_DIR / "soybean_yield_model.joblib"
METRICS_PATH = MODEL_DIR / "soybean_yield_metrics.json"
FEATURES = ["district", "rainfall_mm", "temperature_c", "humidity_percent"]
TARGET = "yield_kg_per_hectare"
VALIDATION_START_YEAR = 2012


def _make_model() -> object:
    preprocessor = ColumnTransformer(
        transformers=[
            ("district", OneHotEncoder(handle_unknown="ignore"), ["district"]),
            (
                "weather",
                "passthrough",
                ["rainfall_mm", "temperature_c", "humidity_percent"],
            ),
        ]
    )
    estimator = RandomForestRegressor(
        n_estimators=400,
        min_samples_leaf=4,
        max_depth=8,
        max_features=0.8,
        random_state=42,
        n_jobs=-1,
    )
    return make_pipeline(preprocessor, estimator)


def train_model() -> dict:
    if not DATA_PATH.is_file():
        raise FileNotFoundError(
            f"Training data is missing at {DATA_PATH}. "
            "Run prepare_dataset.py to fetch and align source data first."
        )

    dataset = pd.read_csv(DATA_PATH)
    required_columns = set(FEATURES + [TARGET, "year"])
    missing_columns = sorted(required_columns - set(dataset.columns))
    if missing_columns:
        raise ValueError(f"Training data is missing columns: {', '.join(missing_columns)}")
    if dataset.empty or dataset[FEATURES + [TARGET, "year"]].isna().any().any():
        raise ValueError("Training data must be non-empty and have no missing features or labels")

    train_rows = dataset["year"] < VALIDATION_START_YEAR
    validation_rows = ~train_rows
    if train_rows.sum() < 100 or validation_rows.sum() < 30:
        raise ValueError("Not enough rows for the configured time-based validation split")

    x_train = dataset.loc[train_rows, FEATURES]
    y_train = dataset.loc[train_rows, TARGET]
    x_validation = dataset.loc[validation_rows, FEATURES]
    y_validation = dataset.loc[validation_rows, TARGET]

    validation_model = _make_model()
    validation_model.fit(x_train, y_train)
    predictions = validation_model.predict(x_validation)
    district_means = y_train.groupby(x_train["district"]).mean()
    overall_mean = float(y_train.mean())
    baseline_predictions = x_validation["district"].map(district_means).fillna(overall_mean)

    model_mae = float(mean_absolute_error(y_validation, predictions))
    baseline_mae = float(mean_absolute_error(y_validation, baseline_predictions))
    if model_mae >= baseline_mae:
        raise ValueError(
            f"Candidate model MAE ({model_mae:.1f} kg/ha) did not beat the "
            f"district-average baseline ({baseline_mae:.1f} kg/ha); "
            "refusing to publish a weaker model."
        )

    metrics = {
        "model_version": "maharashtra-soybean-yield-2.0.0",
        "target_unit": "kg/hectare",
        "validation": {
            "method": "Train on 1998-2011; test on 2012-2014",
            "start_year": VALIDATION_START_YEAR,
            "end_year": int(dataset.loc[validation_rows, "year"].max()),
            "observations": int(validation_rows.sum()),
            "districts": int(dataset["district"].nunique()),
            "mae_kg_per_hectare": round(model_mae, 2),
            "rmse_kg_per_hectare": round(
                float(np.sqrt(mean_squared_error(y_validation, predictions))), 2
            ),
            "r2": round(float(r2_score(y_validation, predictions)), 4),
            "district_average_baseline_mae_kg_per_hectare": round(baseline_mae, 2),
        },
        "training": {
            "observations": int(len(dataset)),
            "start_year": int(dataset["year"].min()),
            "end_year": int(dataset["year"].max()),
        },
        "features": FEATURES,
        "excluded_inputs": [
            "soil_n",
            "soil_p",
            "soil_k",
            "area_hectare",
        ],
        "districts": sorted(dataset["district"].astype(str).unique().tolist()),
        "input_ranges_p05_p95": {
            feature: [
                round(float(dataset[feature].quantile(0.05)), 2),
                round(float(dataset[feature].quantile(0.95)), 2),
            ]
            for feature in FEATURES
            if feature != "district"
        },
        "yield_source": (
            "Public Maharashtra crop-production table mirrored at "
            "https://github.com/DUDIMETLA-SWATHI/crop-production/tree/"
            "df51a358b57d32055deb77f346101e2895a68ca3"
        ),
        "weather_source": "NASA POWER Daily API (PRECTOTCORR, T2M, RH2M), June-September",
    }

    final_model = _make_model()
    final_model.fit(dataset[FEATURES], dataset[TARGET])
    joblib.dump(final_model, MODEL_PATH)
    METRICS_PATH.write_text(json.dumps(metrics, indent=2) + "\n", encoding="utf-8")
    return metrics


if __name__ == "__main__":
    result = train_model()
    print(json.dumps(result, indent=2))
