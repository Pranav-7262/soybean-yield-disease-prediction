# Disease Detection API - Code Review & Structure

## 📋 Overview
The application has a 3-tier architecture for disease detection:
1. **ML Service** (FastAPI) - Python-based ML inference
2. **Express Server** - Node.js API gateway
3. **Client** - React/Vite frontend

---

## 🔗 API Flow

```
Client (React)
    ↓ (POST with image)
Express Server (http://localhost:5000)
    ↓ (POST with FormData)
ML Service (http://127.0.0.1:8000)
    ↓ (TensorFlow inference)
Response → Disease/Healthy + Confidence
```

---

## 📊 Technical Details

### ML Service (ml-service/main.py)
**Framework**: FastAPI
**Endpoint**: `POST /predict/disease`
**Model**: TensorFlow/Keras (`disease_model.h5`)
**Input**: Image file (224x224 required)
**Output**: 
```json
{
  "success": true,
  "prediction": "Disease" or "Healthy",
  "confidence": 95.23
}
```

**Model Logic** (ml-service/services/disease_service.py):
- Loads image and resizes to 224x224
- Processes through disease_model.h5
- Uses softmax for probability
- Applies threshold: **score[1] > 0.65** → "Healthy"
- Otherwise → "Disease"

---

### Express Server (server/)
**Framework**: Express.js
**Port**: 5000 (configurable via PORT env)
**Route**: `POST /api/disease/disease`

**Request Format**:
- Method: POST
- Content-Type: multipart/form-data
- Field name: "image"
- File types: PNG, JPG, JPEG

**Controller Logic** (server/controllers/diseaseController.js):
1. Receives image via multer middleware
2. Creates FormData and uploads to ML service
3. Deletes temp file after prediction
4. Returns ML service response

**Error Handling**:
- Returns 500 status with error message if ML service fails

---

## ✅ Issues Found & Status

### ✅ **WORKING CORRECTLY**

1. **Proper File Handling** - Uses temporary uploads folder
2. **Error Handling** - Try-catch blocks present
3. **CORS Configured** - Allows requests from http://localhost:5173 (React app)
4. **Multer Middleware** - Properly configured for image uploads
5. **Model Threshold** - Reasonable 0.65 threshold for binary classification
6. **Response Format** - Consistent JSON responses

### ⚠️ **Potential Improvements**

1. **File Validation**:
   - No validation of image file types (should check MIME type)
   - No file size limits configured
   - No validation that uploaded file is actually an image

2. **ML Service URL**:
   - Hardcoded to `http://127.0.0.1:8000`
   - Should be configurable via environment variable

3. **Error Messages**:
   - Generic error responses could expose system details

4. **Configuration**:
   - No .env file usage for sensitive config
   - Port is hardcoded in server/index.js

---

## 🧪 How to Test

### Prerequisites:
1. Both services must be running:
   ```bash
   # Terminal 1: ML Service
   cd ml-service
   python main.py
   
   # Terminal 2: Express Server
   cd server
   npm install
   npm run dev
   ```

2. Node.js version should support ES6 modules (v14+)

### Run Test Script:
```bash
cd server
node ../test_disease_api.js
```

### Manual Testing:
Using curl:
```bash
curl -X POST \
  -F "image=@path/to/image.jpg" \
  http://localhost:5000/api/disease/disease
```

Using Python:
```python
import requests
with open('image.jpg', 'rb') as f:
    response = requests.post(
        'http://localhost:5000/api/disease/disease',
        files={'image': f}
    )
print(response.json())
```

---

## 📝 Expected Response Examples

### Success Response:
```json
{
  "success": true,
  "prediction": "Healthy",
  "confidence": 92.45
}
```

### Disease Response:
```json
{
  "success": true,
  "prediction": "Disease",
  "confidence": 87.63
}
```

### Error Response:
```json
{
  "error": "Prediction failed"
}
```

---

## 🔍 Code Quality Assessment

| Aspect | Status | Notes |
|--------|--------|-------|
| **Structure** | ✅ Good | Clean separation of concerns |
| **Error Handling** | ✅ Good | Try-catch blocks present |
| **Input Validation** | ⚠️ Fair | Needs file type validation |
| **Security** | ⚠️ Fair | No auth, no rate limiting |
| **Configuration** | ⚠️ Fair | Uses hardcoded values |
| **Documentation** | ✅ Good | Code is readable |
| **Testing** | ❌ Missing | No test files present |

---

## 🚀 Recommendations

1. **Add Input Validation**:
   - Validate file MIME types (image/jpeg, image/png)
   - Set max file size (e.g., 5MB)

2. **Use Environment Variables**:
   - ML_SERVICE_URL
   - IMAGE_UPLOAD_PATH
   - MAX_FILE_SIZE

3. **Improve Error Messages**:
   - Log detailed errors server-side
   - Return generic user-friendly messages

4. **Add Logging**:
   - Track API requests and predictions
   - Log model performance metrics

5. **Security**:
   - Add rate limiting
   - Implement request validation middleware
   - Add HTTPS in production
