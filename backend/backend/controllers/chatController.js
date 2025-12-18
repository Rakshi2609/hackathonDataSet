import axios from "axios";
import ChatHistory from "../models/ChatHistory.js";
import HealthForm from "../models/Form.js";

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

// Helper: Call Mistral API
async function callMistralAPI(messages, model = "mistral-small-latest") {
  try {
    // Reading the key inside the function ensures it's loaded after dotenv.config()
    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      throw new Error("MISTRAL_API_KEY is missing from environment variables.");
    }

    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.trim()}`, // .trim() removes accidental spaces
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    // This provides much better debugging info in your terminal
    if (error.response) {
      console.error("Mistral API Error Details:", error.response.data);
    } else {
      console.error("Mistral API Error Message:", error.message);
    }
    throw new Error("Failed to get response from AI");
  }
}

// Helper: Build system prompt for form-specific chat
function buildFormSystemPrompt(formData) {
  return `You are a friendly health assistant chatbot. You have access to the user's health form data:

**Vital Signs:**
- Heart Rate: ${formData.heartRate} bpm
- SpO2: ${formData.spo2}%
- Temperature: ${formData.temperature}°F
- Blood Pressure: ${formData.bloodPressure.systolic}/${formData.bloodPressure.diastolic} mmHg

**Problem Area:** ${formData.problemArea}

**Symptoms:**
${JSON.stringify(formData[formData.problemArea], null, 2)}

Based on this data, provide friendly health advice, answer questions, and give helpful tips about diet, lifestyle, and wellness. Be conversational and supportive.`;
}

// Helper: Build system prompt for main chatbot
function buildMainSystemPrompt(latestForm) {
  if (!latestForm) {
    return `You are a friendly health assistant chatbot. Help users with general health questions, wellness tips, and encourage them to fill out health forms to get personalized advice.`;
  }

  return `You are a friendly health assistant chatbot. You have access to the user's most recent health form:

**Latest Form (${new Date(latestForm.createdAt).toLocaleDateString()}):**
- Heart Rate: ${latestForm.heartRate} bpm
- SpO2: ${latestForm.spo2}%
- Temperature: ${latestForm.temperature}°F
- Blood Pressure: ${latestForm.bloodPressure.systolic}/${latestForm.bloodPressure.diastolic} mmHg
- Problem Area: ${latestForm.problemArea}

Based on this information, provide personalized health tips, diet recommendations, and lifestyle advice. Be friendly, encouraging, and supportive.`;
}

// -------------------- FORM-SPECIFIC CHAT --------------------
export const chatWithForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;

    const form = await HealthForm.findOne({ _id: formId, userId });
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    let chatHistory = await ChatHistory.findOne({
      userId,
      formId,
      chatType: "form-specific",
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId,
        formId,
        chatType: "form-specific",
        messages: [],
      });
    }

    const systemPrompt = buildFormSystemPrompt(form);
    const mistralMessages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const aiResponse = await callMistralAPI(mistralMessages);

    chatHistory.messages.push(
      { role: "user", content: message, timestamp: new Date() },
      { role: "assistant", content: aiResponse, timestamp: new Date() }
    );
    await chatHistory.save();

    res.status(200).json({
      success: true,
      response: aiResponse,
      chatHistory: chatHistory.messages,
    });
  } catch (error) {
    console.error("Form Chat Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// -------------------- MAIN CHAT --------------------
export const chatMain = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    const latestForm = await HealthForm.findOne({ userId }).sort({ createdAt: -1 });

    let chatHistory = await ChatHistory.findOne({
      userId,
      chatType: "main",
      formId: null,
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId,
        formId: null,
        chatType: "main",
        messages: [],
      });
    }

    const systemPrompt = buildMainSystemPrompt(latestForm);
    const mistralMessages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const aiResponse = await callMistralAPI(mistralMessages);

    chatHistory.messages.push(
      { role: "user", content: message, timestamp: new Date() },
      { role: "assistant", content: aiResponse, timestamp: new Date() }
    );
    await chatHistory.save();

    res.status(200).json({
      success: true,
      response: aiResponse,
      chatHistory: chatHistory.messages,
    });
  } catch (error) {
    console.error("Main Chat Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// -------------------- GET CHAT HISTORY --------------------
export const getChatHistory = async (req, res) => {
  try {
    const { formId } = req.params;
    const userId = req.user._id;

    const query = formId
      ? { userId, formId, chatType: "form-specific" }
      : { userId, chatType: "main", formId: null };

    const chatHistory = await ChatHistory.findOne(query);

    res.status(200).json({
      success: true,
      messages: chatHistory?.messages || [],
    });
  } catch (error) {
    console.error("Get Chat History Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// -------------------- CLEAR CHAT HISTORY --------------------
export const clearChatHistory = async (req, res) => {
  try {
    const { formId } = req.params;
    const userId = req.user._id;

    const query = formId
      ? { userId, formId, chatType: "form-specific" }
      : { userId, chatType: "main", formId: null };

    await ChatHistory.findOneAndUpdate(query, { messages: [] });

    res.status(200).json({
      success: true,
      message: "Chat history cleared",
    });
  } catch (error) {
    console.error("Clear Chat History Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};