import tensorflow as tf
import numpy as np
import sys
import json
import os
from PIL import Image
import io
import base64

# 1. Setup Paths
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/disease/soynet_disease_model.h5")

# 2. Load the EfficientNetV2-S Model
try:
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("Disease Detection Model (EfficientNetV2-S) loaded!")
except Exception as e:
    print(f"Error loading model: {e}")
    sys.exit(1)

# 3. Class Names (Update these based on your SoyNet dataset classes)
CLASS_NAMES = ['Healthy', 'Septoria Brown Spot', 'Frogeye Leaf Spot', 'Downy Mildew']

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
    
    return img_array

def predict():
    """
    Reads image data from Node.js via stdin
    """
    try:
        input_json = sys.stdin.read()
        data = json.loads(input_json)
        image_data = base64.b64decode(data['image'])
        
        processed_img = preprocess_image(image_data)
        predictions = model.predict(processed_img)
        
        score = tf.nn.softmax(predictions[0])
        result_index = np.argmax(score)
        
        response = {
            "disease": CLASS_NAMES[result_index],
            "confidence": float(100 * np.max(score))
        }
        
        print(json.dumps(response))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    predict()