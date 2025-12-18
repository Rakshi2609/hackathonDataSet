import os
import cv2
import numpy as np
import tensorflow as tf
import tempfile
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Multi-Model Health Screening API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LOAD MODELS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 1. Throat Model
THROAT_PATH = os.path.join(BASE_DIR, "..", "model", "throat_disease_cnn.tflite")
throat_interp = tf.lite.Interpreter(model_path=THROAT_PATH)
throat_interp.allocate_tensors()

# 2. Eye/Skin Model
EYE_PATH = os.path.join(BASE_DIR, "eye_disease_float16.tflite") # Adjust path as needed
eye_interp = tf.lite.Interpreter(model_path=EYE_PATH)
eye_interp.allocate_tensors()

EYE_CLASSES = ["Bulging_Eyes", "Cataracts", "Crossed_Eyes", "Glaucoma", "Uveitis"]

# --- UTILITIES ---
def run_tflite_eye(image_path):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (300, 300)) # Eye model size
    img = (img / 255.0).astype(np.float32)
    img = np.expand_dims(img, axis=0)
    
    input_details = eye_interp.get_input_details()
    output_details = eye_interp.get_output_details()
    
    eye_interp.set_tensor(input_details[0]["index"], img)
    eye_interp.invoke()
    return eye_interp.get_tensor(output_details[0]["index"])

def run_tflite_throat(image_path):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (224, 224)) # Throat model size
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
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        prob = run_tflite_throat(tmp_path)
        risk = "HIGH" if prob > 0.7 else "MEDIUM" if prob > 0.4 else "LOW"
        msg = "Indicators detected" if prob > 0.4 else "Likely healthy"
        return {"probability": float(prob), "risk_level": risk, "assessment": msg}
    finally:
        os.remove(tmp_path)

@app.post("/predict/eye")
async def predict_eye(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        prediction = run_tflite_eye(tmp_path)
        idx = int(np.argmax(prediction))
        conf = float(np.max(prediction))
        return {"prediction": EYE_CLASSES[idx], "confidence": round(conf * 100, 2)}
    finally:
        os.remove(tmp_path)