import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import healthFormRoutes from "./routes/healthFormRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Default test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/form", healthFormRoutes);
app.use("/api/chat", chatRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
