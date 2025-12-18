import express from "express";
import auth from "../middleware/auth.js";
import multer from "multer"; // Import multer
import { createHealthForm, getAllForms, getFormById } from "../controllers/healthFormController.js";

const router = express.Router();

// Initialize multer. 
// For now, we use memory storage or basic config to parse the form fields.
const upload = multer({ dest: 'uploads/' }); 

// Protected routes
// Add upload.single("image") to the create route to parse Multipart/Form-Data
router.post("/create", auth, upload.single("image"), createHealthForm);

router.get("/all", auth, getAllForms);
router.get("/:id", auth, getFormById);

export default router;