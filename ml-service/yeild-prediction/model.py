import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import matplotlib.pyplot as plt

# Step 1: Load Dataset

weather_df = pd.read_csv("maharashtra_weather_dataset_large.csv")
soy_df = pd.read_csv("maharashtra_soybean_dataset_large.csv")

# Step 2: Merge Dataset

df = pd.merge(weather_df, soy_df, on=["District", "Year"])

# Step 3: Fix Column Names (IMPORTANT)

df.columns = df.columns.str.strip().str.replace(" ", "_")

# Print columns (for debugging)
print("Columns:", df.columns)


# Step 4: Basic Preprocessing

df = df.dropna()
df = df.drop_duplicates()



# Step 5: Feature Selection

X = df[['Rainfall_mm_x','Temperature_C_x','Humidity_Percent',
        'Soil_N','Soil_P','Soil_K','Area_hectare']]

y = df['Yield_kg_per_hectare']


# Step 6: Train-Test Split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)


# Step 7: Train Model

model = RandomForestRegressor(n_estimators=100)
model.fit(X_train, y_train)


# Step 8: Prediction

y_pred = model.predict(X_test)


# Step 9: Evaluation

print("\nModel Performance:")
print("MAE:", mean_absolute_error(y_test, y_pred))
print("R2 Score:", r2_score(y_test, y_pred))


# Step 10: Test Prediction

sample = [[900, 26, 75, 40, 35, 30, 5]]
prediction = model.predict(sample)

print("\nSample Prediction:")
print("Input: Rainfall=900, Temp=26, Humidity=75, NPK=40,35,30, Area=5")
print("Predicted Yield:", prediction[0])


# Step 11: Save Model

pickle.dump(model, open("soybean_model.pkl", "wb"))

print("\nModel saved successfully as soybean_model.pkl")


# Step 12: Visualization

plt.scatter(y_test, y_pred)
plt.xlabel("Actual Yield")
plt.ylabel("Predicted Yield")
plt.title("Actual vs Predicted Yield")
plt.show()