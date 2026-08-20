import os
import numpy as np
import tensorflow as tf
from PIL import Image


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

    image = image.resize(IMAGE_SIZE)

    image_array = np.array(image)

    image_array = image_array.astype(np.float32) / 255.0

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

    predicted_index = int(np.argmax(probabilities))

    predicted_class = CLASS_NAMES[predicted_index]

    confidence = float(probabilities[predicted_index])

    return {
        "disease": predicted_class,
        "confidence": round(confidence * 100, 2)
    }