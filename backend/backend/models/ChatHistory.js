import mongoose from "mongoose";

const ChatHistorySchema = new mongoose.Schema(
  {
    // Link to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Link to specific form (null for main chatbot)
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthForm",
      default: null,
    },

    // Chat type: 'form-specific' or 'main'
    chatType: {
      type: String,
      enum: ["form-specific", "main"],
      required: true,
    },

    // Conversation messages
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant", "system"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
ChatHistorySchema.index({ userId: 1, formId: 1 });
ChatHistorySchema.index({ userId: 1, chatType: 1 });

const ChatHistory = mongoose.model("ChatHistory", ChatHistorySchema);

export default ChatHistory;
