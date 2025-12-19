# AI Model Backend - Disease Detection Services

FastAPI-based AI model services for automated disease detection from medical images.

## 🧠 AI Models

This directory contains two FastAPI services for disease detection:

1. **Nirvik** - Throat Disease Detection (Port 8000)
2. **Soumya** - Eye Disease Detection (Port 8001)

## 🏗️ Architecture

```
model-backend/
├── nirvik/                      # Throat Disease Service
│   ├── app.py                   # FastAPI application
│   ├── requirements.txt         # Python dependencies
│   └── model/
│       └── throat_disease_cnn.tflite  # TFLite model
└── soumya/                      # Eye Disease Service
    ├── app.py                   # FastAPI application
    ├── requirements.txt         # Python dependencies
    └── model/
        └── eye_disease_model.tflite   # TFLite model
```

## 🚀 Setup & Installation

### Prerequisites
- Python 3.10+
- pip

### Installation

#### Throat Disease Service (Nirvik)
```bash
cd model-backend/nirvik
pip install -r requirements.txt
```

#### Eye Disease Service (Soumya)
```bash
cd model-backend/soumya
pip install -r requirements.txt
```

## 🏃 Running the Services

### Start Throat Disease Service
```bash
cd model-backend/nirvik
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
Access at: `http://127.0.0.1:8000`

### Start Eye Disease Service
```bash
cd model-backend/soumya
uvicorn app:app --host 127.0.0.1 --port 8001 --reload
```
Access at: `http://127.0.0.1:8001`

## 📡 API Endpoints

### Throat Disease Detection
**Endpoint:** `POST http://127.0.0.1:8000/predict/throat`

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `file` (image file)

**Response:**
```json
{
  "probability": 0.856,
  "risk_level": "HIGH",
  "assessment": "Strong indicators of throat disease"
}
```

**Risk Levels:**
- `LOW` (< 0.40): Likely healthy throat
- `MEDIUM` (0.40 - 0.70): Possible abnormality detected
- `HIGH` (> 0.70): Strong indicators of throat disease

### Eye Disease Detection
**Endpoint:** `POST http://127.0.0.1:8001/predict/eye`

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `file` (image file)

**Response:**
```json
{
  "prediction": "Cataract",
  "confidence": 89.5
}
```

## 🔧 Technology Stack

- **Framework**: FastAPI
- **ML Framework**: TensorFlow Lite
- **Image Processing**: OpenCV (cv2)
- **Numerical Computing**: NumPy
- **CORS**: FastAPI CORS Middleware

## 📦 Dependencies

### Common Dependencies
```txt
fastapi
uvicorn
opencv-python
numpy
tensorflow
python-multipart
```

## 🧪 Testing the APIs

### Using cURL

#### Throat Disease Detection
```bash
curl -X POST "http://127.0.0.1:8000/predict/throat" \
  -F "file=@path/to/throat_image.jpg"
```

#### Eye Disease Detection
```bash
curl -X POST "http://127.0.0.1:8001/predict/eye" \
  -F "file=@path/to/eye_image.jpg"
```

### Using Python
```python
import requests

# Throat disease prediction
with open('throat_image.jpg', 'rb') as f:
    response = requests.post(
        'http://127.0.0.1:8000/predict/throat',
        files={'file': f}
    )
print(response.json())

# Eye disease prediction
with open('eye_image.jpg', 'rb') as f:
    response = requests.post(
        'http://127.0.0.1:8001/predict/eye',
        files={'file': f}
    )
print(response.json())
```

## 🔄 Integration with Backend

The Node.js backend automatically communicates with these services:

1. User uploads image through frontend
2. Backend receives image via Multer
3. Backend forwards image to appropriate AI service
4. AI service processes image and returns prediction
5. Backend stores prediction with health form in MongoDB

## 📊 Model Details

### Throat Disease CNN
- **Type**: Convolutional Neural Network (TFLite)
- **Input Size**: 224x224 pixels
- **Preprocessing**: Resize + Normalization (0-1 range)
- **Output**: Binary probability (disease vs healthy)

### Eye Disease EfficientNet
- **Type**: EfficientNet (TFLite)
- **Input Size**: 224x224 pixels
- **Preprocessing**: Resize + Normalization
- **Output**: Multi-class classification with confidence

## 🎯 Image Preprocessing

Both models use similar preprocessing:
1. Read image using OpenCV
2. Resize to 224x224 pixels
3. Normalize pixel values to [0, 1]
4. Expand dimensions for batch processing
5. Convert to float32

## 🚨 Error Handling

All endpoints handle errors gracefully:
- Invalid file format
- Missing file
- Model inference errors
- File system errors

## 🔒 Security Considerations

- **CORS**: Enabled for all origins (configure for production)
- **File Cleanup**: Temporary files are automatically deleted
- **Model Access**: Models are loaded once at startup
- **Input Validation**: File type validation recommended

## 📈 Performance

- **Response Time**: < 1 second per prediction
- **Concurrent Requests**: Handled via FastAPI async
- **Memory Usage**: Models loaded once in memory

## 🛠️ Troubleshooting

### Issue: Model Not Found
**Solution**: Ensure model files exist in the correct directory:
- `nirvik/model/throat_disease_cnn.tflite`
- `soumya/model/eye_disease_model.tflite`

### Issue: TensorFlow Import Error
**Solution**: Install TensorFlow:
```bash
pip install tensorflow
```

### Issue: Port Already in Use
**Solution**: Change port or kill existing process:
```bash
# Use different port
uvicorn app:app --port 8002

# Or kill process on port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

## 📝 API Documentation

FastAPI provides automatic interactive documentation:
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

## 🤝 Contributing

To add new models:
1. Create new directory under `model-backend/`
2. Add FastAPI app with prediction endpoint
3. Include TFLite model file
4. Update backend routing logic
5. Document endpoints in this README

## 👥 Team

- **Nirvik** - Throat Disease Detection Model
- **Soumya** - Eye Disease Detection Model
- **Ayushi** - Model Training & Optimization

---

**Note**: Keep model files (.tflite, .h5, .pkl) in `.gitignore` to avoid pushing large files to GitHub.
