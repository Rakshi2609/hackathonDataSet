import os
import cv2
import numpy as np
import tensorflow as tf
import tempfile
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Multi-Model Health Screening API")

# Enable CORS so Node.js can talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LOAD MODELS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 1. Throat Model Path
THROAT_PATH = os.path.join(BASE_DIR, ".", "model", "throat_disease_cnn.tflite")
# 2. Eye Model Path (Ensure this file is in the 'nirvik' folder)
EYE_PATH = os.path.join(BASE_DIR,".", "model","eye_disease_float16.tflite")

def load_model(path):
    if not os.path.exists(path):
        print(f"❌ ERROR: Model file not found at {path}")
        return None
    interpreter = tf.lite.Interpreter(model_path=path)
    interpreter.allocate_tensors()
    return interpreter

throat_interp = load_model(THROAT_PATH)
eye_interp = load_model(EYE_PATH)

EYE_CLASSES = ["Bulging_Eyes", "Cataracts", "Crossed_Eyes", "Glaucoma", "Uveitis"]

# --- UTILITIES ---
def run_tflite_eye(image_path):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (300, 300)) 
    img = (img / 255.0).astype(np.float32)
    img = np.expand_dims(img, axis=0)
    
    input_details = eye_interp.get_input_details()
    output_details = eye_interp.get_output_details()
    
    eye_interp.set_tensor(input_details[0]["index"], img)
    eye_interp.invoke()
    return eye_interp.get_tensor(output_details[0]["index"])

def run_tflite_throat(image_path):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (224, 224))
    img = (img / 255.0).astype(np.float32)
    img = np.expand_dims(img, axis=0)
    
    input_details = throat_interp.get_input_details()
    output_details = throat_interp.get_output_details()
    
    throat_interp.set_tensor(input_details[0]["index"], img)
    throat_interp.invoke()
    return throat_interp.get_tensor(output_details[0]["index"])[0][0]

# --- ENDPOINTS ---

@app.post("/predict/throat")
async def predict_throat(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        prob = run_tflite_throat(tmp_path)
        risk = "HIGH" if prob > 0.7 else "MEDIUM" if prob > 0.4 else "LOW"
        msg = "Indicators detected" if prob > 0.4 else "Likely healthy"
        return {"probability": float(prob), "risk_level": risk, "assessment": msg}
    finally:
        os.remove(tmp_path)

# THIS MUST BE /predict/eye TO MATCH YOUR NODE.JS CODE
@app.post("/predict/eye")
async def predict_eye(file: UploadFile = File(...)):
    if not eye_interp:
        return {"error": "Eye model not loaded"}
        
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        prediction = run_tflite_eye(tmp_path)
        idx = int(np.argmax(prediction))
        conf = float(np.max(prediction))
        return {"prediction": EYE_CLASSES[idx], "confidence": round(conf * 100, 2)}
    finally:
        os.remove(tmp_path)