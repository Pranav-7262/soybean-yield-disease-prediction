import tensorflow as tf
import json
import os

MODEL_PATH = os.path.join("models", "disease", "disease_model.h5")
CLASS_PATH = os.path.join("models", "disease", "class_names.json")

model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_PATH, "r") as f:
    class_names = json.load(f)