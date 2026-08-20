from services.disease_service import predict_disease


# Change this to your test image
IMAGE_PATH = "soybean_disease.jpg"


try:
    result = predict_disease(IMAGE_PATH)

    print("\n==============================")
    print("SOYBEAN DISEASE PREDICTION")
    print("==============================")

    print("Disease    :", result["disease"])
    print("Confidence :", f'{result["confidence"]}%')

except Exception as e:
    print("\nPrediction failed!")
    print("Error:", str(e))