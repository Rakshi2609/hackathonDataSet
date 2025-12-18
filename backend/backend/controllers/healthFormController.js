import HealthForm from "../models/Form.js";

// Save a new health form (NO ML logic here)
export const createHealthForm = async (req, res) => {
  try {
    const formData = {
      ...req.body,
      userId: req.user._id, // from auth middleware
    };

    const savedForm = await HealthForm.create(formData);

    res.status(201).json({
      success: true,
      message: "Form saved successfully",
      data: savedForm,
    });
  } catch (error) {
    console.error("Create Form Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch all forms of a logged-in user
export const getAllForms = async (req, res) => {
  try {
    const forms = await HealthForm.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: forms,
    });
  } catch (error) {
    console.error("Fetch All Forms Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch a single form by its ID
export const getFormById = async (req, res) => {
  try {
    const form = await HealthForm.findOne({
      _id: req.params.id,
      userId: req.user._id, // ensures only the owner can view
    });

    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    res.status(200).json({
      success: true,
      data: form,
    });
  } catch (error) {
    console.error("Fetch Form Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
