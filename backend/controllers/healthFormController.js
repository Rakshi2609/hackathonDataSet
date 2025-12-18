import HealthForm from "../models/Form.js";

// ------------------ CREATE FORM ------------------
export const createHealthForm = async (req, res) => {
  try {
    // When using FormData, objects often arrive as strings and must be parsed
    const parseIfString = (data) => (typeof data === 'string' ? JSON.parse(data) : data);

    const bloodPressure = parseIfString(req.body.bloodPressure);
    const problemArea = req.body.problemArea;
    
    // Extract the specific symptoms based on the problem area
    const symptoms = req.body[problemArea] ? parseIfString(req.body[problemArea]) : {};

    const formData = {
      userId: req.user._id,
      heartRate: Number(req.body.heartRate),
      spo2: Number(req.body.spo2),
      temperature: Number(req.body.temperature),
      bloodPressure: {
        systolic: Number(bloodPressure?.systolic),
        diastolic: Number(bloodPressure?.diastolic),
      },
      problemArea: problemArea,
      bodyPart: req.body.bodyPart || "",
      // If using multer, req.file.path contains the image location
      imageUrl: req.file ? req.file.path : null,
      [problemArea]: symptoms, // Dynamically set the specific symptoms (e.g., skin: {rash: true})
    };

    const savedForm = await HealthForm.create(formData);

    res.status(201).json({
      success: true,
      message: "Medical record synchronized successfully",
      data: savedForm,
    });
  } catch (error) {
    console.error("Create Form Error:", error);
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