import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import HealthForm from "../models/Form.js";

export const createHealthForm = async (req, res) => {
  try {
    const parseIfString = (data) => (typeof data === 'string' ? JSON.parse(data) : data);
    const problemArea = req.body.problemArea;

    let aiResult = "No AI analysis performed";

    // --- AI BRIDGE: Node.js to FastAPI ---
    if (req.file) {
      try {
        const pythonFormData = new FormData();
        pythonFormData.append("file", fs.createReadStream(req.file.path));

        let endpoint = "";
        
        // Dynamic Routing based on Problem Area
        if (problemArea === "throat") {
          endpoint = "http://127.0.0.1:8000/predict/throat";
        } else if (problemArea === "skin" || problemArea === "eye") {
          endpoint = "http://127.0.0.1:8000/predict/eye";
        }

        if (endpoint) {
          const aiResponse = await axios.post(endpoint, pythonFormData, {
            headers: { ...pythonFormData.getHeaders() },
          });

          // Handle different response formats from Python
          if (aiResponse.data.risk_level) {
            // Format for Throat Model
            aiResult = `${aiResponse.data.risk_level}: ${aiResponse.data.assessment} (${(aiResponse.data.probability * 100).toFixed(1)}%)`;
          } else if (aiResponse.data.prediction) {
            // Format for Eye/Skin Model
            aiResult = `DETECTED: ${aiResponse.data.prediction} (${aiResponse.data.confidence}%)`;
          }
        }
      } catch (aiErr) {
        console.error("AI Bridge Error:", aiErr.message);
        aiResult = "AI Screening Service Offline";
      }
    }

    const formData = {
      userId: req.user._id,
      heartRate: Number(req.body.heartRate) || 0,
      spo2: Number(req.body.spo2) || 0,
      temperature: Number(req.body.temperature) || 0,
      bloodPressure: req.body.bloodPressure ? parseIfString(req.body.bloodPressure) : { systolic: 0, diastolic: 0 },
      problemArea,
      bodyPart: req.body.bodyPart || "",
      imageUrl: req.file ? req.file.path.replace(/\\/g, '/') : null,
      result: aiResult,
      [problemArea]: req.body[problemArea] ? parseIfString(req.body[problemArea]) : {},
    };

    const savedForm = await HealthForm.create(formData);
    res.status(201).json({ success: true, data: savedForm });
  } catch (error) {
    console.error("Create Form Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllForms = async (req, res) => {
  try {
    const forms = await HealthForm.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getFormById = async (req, res) => {
  try {
    const form = await HealthForm.findOne({ _id: req.params.id, userId: req.user._id });
    if (!form) return res.status(404).json({ success: false, message: "Record not found" });
    res.status(200).json({ success: true, data: form });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};