import mongoose from "mongoose";

const HealthFormSchema = new mongoose.Schema(
  {
    // Link to User (who submitted the form)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Step 1: Basic vitals
    heartRate: {
      type: Number,
      required: true,
    },
    spo2: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    bloodPressure: {
      systolic: { type: Number, required: true },
      diastolic: { type: Number, required: true },
    },

    // Step 2: Main problem area
    problemArea: {
      type: String,
      required: true,
      enum: ["throat", "skin", "respiratory", "cardiovascular", "diabetes"],
    },

    // Step 3: Conditional symptoms
    throat: {
      difficultySwallowing: { type: Boolean, default: false },
      throatPain: { type: Boolean, default: false },
    },

    skin: {
      rash: { type: Boolean, default: false },
      itching: { type: Boolean, default: false },
      swelling: { type: Boolean, default: false },
      redness: { type: Boolean, default: false },
    },

    respiratory: {
      breathlessness: { type: Boolean, default: false },
      chestTightness: { type: Boolean, default: false },
    },

    cardiovascular: {
      chestPain: { type: Boolean, default: false },
    },

    diabetes: {
      bloodSugar: { type: Number, default: null },
      frequentThirst: { type: Boolean, default: false },
      frequentUrination: { type: Boolean, default: false },
    },

    // ML / rule-based output stored later
    result: {
      type: String,
      default: null,
    },
  },
  { timestamps: true } // createdAt + updatedAt
);

const HealthForm = mongoose.model("HealthForm", HealthFormSchema);

export default HealthForm;
