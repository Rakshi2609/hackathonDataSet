import express from "express";
import {
  getNearbyDoctors,
  getDoctorById,
  getSpecialties
} from "../controllers/doctorController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get nearby doctors (with optional filters)
router.get("/nearby", auth, getNearbyDoctors);

// Get all specialties
router.get("/specialties", auth, getSpecialties);

// Get doctor by ID
router.get("/:id", auth, getDoctorById);

export default router;
