import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import os

MODEL_PATH = os.path.join("models", "disease", "disease_model.h5")

# Load model once (important for performance)
model = tf.keras.models.load_model(MODEL_PATH)

class_names = ["Disease", "Healthy"]

def predict_disease(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    score = tf.nn.softmax(predictions[0])

    # your tuned threshold
    if score[1] > 0.65:
        label = "Healthy"
    else:
        label = "Disease"

    confidence = float(100 * np.max(score))

    return {
        "prediction": label,
        "confidence": round(confidence, 2)
    }