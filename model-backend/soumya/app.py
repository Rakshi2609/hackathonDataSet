import os
import joblib
import pandas as pd
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Soumya Tabular Medical AI API")

# Enable CORS for communication with Node.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DIRECTORY SETUP ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")

# --- LOAD MODELS ---
def load_model(filename):
    path = os.path.join(MODEL_DIR, filename)
    if not os.path.exists(path):
        print(f"❌ Error: {filename} not found at {path}")
        return None
    return joblib.load(path)

respiratory_model = load_model("respiratory_model.pkl")
diabetes_model = load_model("diabetes_model.pkl")

# --- FEATURE SCHEMAS ---
RESP_FEATURES = [
    "Respiratory Rate", "Oxygen Saturation", "Body Temperature", "Heart Rate", 
    "Systolic Blood Pressure", "Age", "Derived_BMI", "breathlessness", 
    "chest_tightness", "cough", "smoker"
]

DIAB_FEATURES = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness", 
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
]

# --- API ENDPOINTS ---

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "respiratory_loaded": respiratory_model is not None,
        "diabetes_loaded": diabetes_model is not None
    }

# 1. RESPIRATORY RISK ENDPOINT
@app.post("/predict/respiratory")
async def predict_respiratory(data: dict = Body(...)):
    if not respiratory_model:
        return {"error": "Respiratory model not loaded"}
    
    # Create DataFrame with exact feature names
    df = pd.DataFrame([data], columns=RESP_FEATURES)
    prediction = respiratory_model.predict(df)[0]
    
    return {
        "prediction": str(prediction),
        "status": "Success"
    }

# 2. DIABETES RISK ENDPOINT
@app.post("/predict/diabetes")
async def predict_diabetes(data: dict = Body(...)):
    if not diabetes_model:
        return {"error": "Diabetes model not loaded"}
    
    # Create DataFrame with exact feature names
    df = pd.DataFrame([data], columns=DIAB_FEATURES)
    
    # Probability of class 1 (Diabetes)
    probability = diabetes_model.predict_proba(df)[0][1]
    percentage = round(probability * 100, 2)
    
    return {
        "risk_percentage": f"{percentage}%",
        "risk_level": "High" if percentage > 60 else "Moderate" if percentage > 30 else "Low",
        "status": "Success"
    }