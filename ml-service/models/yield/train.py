import joblib
import sys
import os

from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# Fix import path (important)
sys.path.append(os.path.abspath("../../"))

from processors.yield_preprocess import load_and_clean_data

# 1. Load and preprocess dataset

DATA_PATH = "../../data/yield_data.csv"

df = load_and_clean_data(DATA_PATH)

# 2. Split features and target

X = df.drop("yield", axis=1)
y = df["yield"]


# 3. Train-test split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 4. Model training (XGBoost)
model = XGBRegressor(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)

model.fit(X_train, y_train)

# 5. Evaluation

preds = model.predict(X_test)
mse = mean_squared_error(y_test, preds)

print(f"✅ Model trained successfully")
print(f"📊 MSE: {mse:.2f}")
# 6. Save model
MODEL_PATH = "model.pkl" # Save in current directory for ml-service to load easily
joblib.dump(model, MODEL_PATH)

print(f"💾 Model saved at: {MODEL_PATH}")