import express from "express";
import auth from "../middleware/auth.js";
import { createHealthForm, getAllForms, getFormById } from "../controllers/healthFormController.js";

const router = express.Router();

// Protected routes
router.post("/create", auth, createHealthForm);
router.get("/all", auth, getAllForms);
router.get("/:id", auth, getFormById);

export default router;
