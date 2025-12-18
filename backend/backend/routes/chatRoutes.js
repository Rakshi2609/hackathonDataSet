import express from "express";
import auth from "../middleware/auth.js";
import {
  chatWithForm,
  chatMain,
  getChatHistory,
  clearChatHistory,
} from "../controllers/chatController.js";

const router = express.Router();

// Main chatbot (uses latest form data)
router.post("/main", auth, chatMain);
router.get("/main/history", auth, getChatHistory);
router.delete("/main/history", auth, clearChatHistory);

// Form-specific chatbot
router.post("/form/:formId", auth, chatWithForm);
router.get("/form/:formId/history", auth, getChatHistory);
router.delete("/form/:formId/history", auth, clearChatHistory);

export default router;
