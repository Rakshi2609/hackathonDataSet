import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", auth, getProfile); // protected

export default router;
