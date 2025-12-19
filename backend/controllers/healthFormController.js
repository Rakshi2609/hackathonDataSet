import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import HealthForm from "../models/Form.js";
import User from "../models/User.js";

// Helper function to calculate age
const calculateAge = (dob) => {
  if (!dob) return 30; // Fallback
  const diffMs = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// ------------------ CREATE FORM ------------------
export const createHealthForm = async (req, res) => {
  console.log("🚀 [NODE] Processing New Health Form Submission...");

  try {
    const parseIfString = (data) => (typeof data === 'string' ? JSON.parse(data) : data);
    const problemArea = req.body.problemArea;
    const body = req.body;

    // 1. AGE CALCULATION LOG
    const user = await User.findById(req.user._id);
    const userAge = user ? calculateAge(user.dob) : 30;
    console.log(`👤 Patient: ${user?.name || "Unknown"} | Calculated Age: ${userAge}`);

    let aiResult = "No AI analysis performed";

    try {
      // PATH A: VISION MODELS (Nirvik - Port 8000)
      if (req.file && ["throat", "eye", "skin"].includes(problemArea)) {
        console.log(`📸 Routing to Vision AI (Nirvik) -> Area: ${problemArea}`);
        const pythonFormData = new FormData();
        pythonFormData.append("file", fs.createReadStream(req.file.path));

        const visionEndpoint = (problemArea === "throat")
          ? "http://127.0.0.1:8000/predict/throat"
          : "http://127.0.0.1:8000/predict/eye";

        const response = await axios.post(visionEndpoint, pythonFormData, {
          headers: { ...pythonFormData.getHeaders() },
        });
        console.log("✅ Nirvik Response Received:", response.data);

        aiResult = response.data.risk_level
          ? `${response.data.risk_level}: ${response.data.assessment}`
          : `DETECTED: ${response.data.prediction} (${response.data.confidence}%)`;
      }

      // PATH B: TABULAR MODELS (Soumya - Port 8001)
      else if (["respiratory", "diabetes"].includes(problemArea)) {
        console.log(`📊 Routing to Tabular AI (Soumya) -> Area: ${problemArea}`);
        const tabularEndpoint = `http://127.0.0.1:8001/predict/${problemArea}`;
        const bp = parseIfString(body.bloodPressure);
        const symptoms = parseIfString(body[problemArea] || "{}");

        let aiInput = {};
        if (problemArea === "diabetes") {
          aiInput = {
            "Pregnancies": Number(symptoms?.pregnancies || 0),
            "Glucose": Number(symptoms?.glucose || 120),
            "BloodPressure": Number(bp?.diastolic || 80),
            "SkinThickness": Number(symptoms?.skinThickness || 20),
            "Insulin": Number(symptoms?.insulin || 79),
            "BMI": Number(symptoms?.bmi || 24.5),
            "DiabetesPedigreeFunction": Number(symptoms?.dpf || 0.47),
            "Age": userAge
          };
        } else if (problemArea === "respiratory") {
          aiInput = {
            "Respiratory Rate": Number(body.heartRate / 4 || 18),
            "Oxygen Saturation": Number(body.spo2 || 98),
            "Body Temperature": Number(body.temperature || 37),
            "Heart Rate": Number(body.heartRate || 72),
            "Systolic Blood Pressure": Number(bp?.systolic || 120),
            "Age": userAge,
            "Derived_BMI": Number(symptoms?.bmi || 23.0),
            "breathlessness": symptoms?.breathlessness ? 1 : 0,
            "chest_tightness": symptoms?.chestTightness ? 1 : 0,
            "cough": symptoms?.cough ? 1 : 0,
            "smoker": symptoms?.smoker ? 1 : 0
          };
        }

        console.log("📡 Sending Tabular Data to Soumya:", aiInput);
        const response = await axios.post(tabularEndpoint, aiInput);
        console.log("✅ Soumya Response Received:", response.data);
        aiResult = response.data.risk_level || response.data.risk_percentage || `Result: ${response.data.prediction}`;
      }
    } catch (aiErr) {
      console.error("❌ AI BRIDGE ERROR:", aiErr.message);
      if (aiErr.response) console.error("FastAPI Error Body:", aiErr.response.data);
      aiResult = "AI Service Offline";
    }

    // 2. SAVE TO DATABASE
    const formData = {
      userId: req.user._id,
      heartRate: Number(body.heartRate) || 0,
      spo2: Number(body.spo2) || 0,
      temperature: Number(body.temperature) || 0,
      bloodPressure: body.bloodPressure ? parseIfString(body.bloodPressure) : { systolic: 0, diastolic: 0 },
      problemArea,
      bodyPart: body.bodyPart || "",
      imageUrl: req.file ? req.file.path.replace(/\\/g, '/') : null,
      result: aiResult,
      [problemArea]: body[problemArea] ? parseIfString(body[problemArea]) : {},
    };

    const savedForm = await HealthForm.create(formData);
    console.log("💾 Record Synchronized to MongoDB successfully.");
    res.status(201).json({ success: true, data: savedForm });

  } catch (error) {
    console.error("❌ INTERNAL CONTROLLER ERROR:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ------------------ FETCH ALL FORMS ------------------
export const getAllForms = async (req, res) => {
  try {
    const forms = await HealthForm.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ------------------ FETCH SINGLE FORM ------------------
export const getFormById = async (req, res) => {
  try {
    const form = await HealthForm.findOne({ _id: req.params.id, userId: req.user._id });
    if (!form) return res.status(404).json({ success: false, message: "Record not found" });
    res.status(200).json({ success: true, data: form });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};