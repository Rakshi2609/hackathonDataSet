import mongoose from "mongoose";

const HealthFormSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    heartRate: { type: Number, required: true },
    spo2: { type: Number, required: true },
    temperature: { type: Number, required: true },
    bloodPressure: {
      systolic: { type: Number, required: true },
      diastolic: { type: Number, required: true },
    },
    // New fields for visual assessment
    bodyPart: { type: String, enum: ["posture", "tongue", ""] },
    imageUrl: { type: String, default: null }, 
    
    problemArea: {
      type: String,
      required: true,
      enum: ["throat", "skin", "respiratory", "cardiovascular", "diabetes"],
    },
    // ... rest of your symptom objects (throat, skin, etc.)
    result: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("HealthForm", HealthFormSchema);