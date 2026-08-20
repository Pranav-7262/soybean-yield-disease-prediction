import os
import numpy as np
import tensorflow as tf
from PIL import Image
from tensorflow.keras.applications.efficientnet import preprocess_input


# MODEL CONFIGURATION

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "disease",
    "soybean_disease_efficientnetb0_final.keras"
)

IMAGE_SIZE = (224, 224)


# DISEASE CLASSES

CLASS_NAMES = [
    "Bacterial_Leaf_Blight",
    "Dry_Leaf",
    "Healthy",
    "Septoria_Brown_Spot",
    "Southern_Blight",
    "Vein_Necrosis",
    "Yellow_Mosaic"
]


# LOAD MODEL
print("Loading soybean disease model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("Soybean disease model loaded successfully.")


# IMAGE PREPROCESSING

def preprocess_image(image_path):
    """
    Load and preprocess a soybean leaf image.
    """
    image = Image.open(image_path).convert("RGB")

    # Resize with high-quality resampling and preserve aspect via thumbnail/crop
    image = image.resize(IMAGE_SIZE, resample=Image.LANCZOS)

    image_array = np.array(image)

    # Use EfficientNet preprocessing (correct scaling/normalization)
    image_array = image_array.astype(np.float32)
    image_array = preprocess_input(image_array)

    image_array = np.expand_dims(image_array, axis=0)

    return image_array


#  DISEASE PREDICTION

def predict_disease(image_path):
    """
    Predict soybean disease from an image.
    """

    image = preprocess_image(image_path)

    predictions = model.predict(image, verbose=0)

    probabilities = predictions[0]

    # If the model output doesn't sum to ~1, treat outputs as logits and apply softmax
    if not np.isclose(np.sum(probabilities), 1.0, atol=1e-3):
        probabilities = tf.nn.softmax(probabilities).numpy()

    predicted_index = int(np.argmax(probabilities))
    predicted_class = CLASS_NAMES[predicted_index]
    confidence = float(probabilities[predicted_index])

    # Also provide top-3 predictions for diagnostic purposes
    top_indices = np.argsort(probabilities)[-3:][::-1]
    top_preds = [
        {"class": CLASS_NAMES[int(i)], "probability": round(float(probabilities[int(i)]) * 100, 2)}
        for i in top_indices
    ]

    return {
        "disease": predicted_class,
        "confidence": round(confidence * 100, 2),
        "top_predictions": top_preds,
    }