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

// Helper: Build system prompt for main chatbot (Mental Health Support)
function buildMainSystemPrompt(latestForm, messages = []) {
  // Analyze user's mood from conversation history
  const hasMoodIndicators = messages.some(msg => 
    msg.role === 'user' && 
    (msg.content.toLowerCase().includes('sad') || 
     msg.content.toLowerCase().includes('anxious') ||
     msg.content.toLowerCase().includes('stressed') ||
     msg.content.toLowerCase().includes('depressed') ||
     msg.content.toLowerCase().includes('worried') ||
     msg.content.toLowerCase().includes('overwhelmed') ||
     msg.content.toLowerCase().includes('tired') ||
     msg.content.toLowerCase().includes('lonely'))
  );

  const hasPositiveMood = messages.some(msg => 
    msg.role === 'user' && 
    (msg.content.toLowerCase().includes('good') || 
     msg.content.toLowerCase().includes('great') ||
     msg.content.toLowerCase().includes('happy') ||
     msg.content.toLowerCase().includes('fine') ||
     msg.content.toLowerCase().includes('okay'))
  );

  let personalityPrompt = '';
  
  if (messages.length === 0) {
    // First message - ask about mood
    personalityPrompt = `You are a warm, empathetic mental health support AI. Your primary role is to:
1. Start by asking the user how they're feeling today in a caring, genuine way
2. Listen actively and validate their emotions
3. Adapt your personality based on their mood and needs
4. Provide emotional support, encouragement, and coping strategies
5. Help them feel heard, understood, and better about themselves

Be conversational, compassionate, and never judgmental. Use a warm, friendly tone.`;
  } else if (hasMoodIndicators) {
    // User is struggling - be extra supportive
    personalityPrompt = `You are a deeply empathetic mental health support AI. The user is going through a difficult time. Your role is to:
1. Validate their feelings and let them know it's okay to feel this way
2. Offer comfort, understanding, and genuine emotional support
3. Share gentle coping strategies and positive affirmations
4. Help them see things from a more hopeful perspective
5. Be patient, kind, and never dismissive of their struggles

Use a soft, caring, supportive tone. Be there for them like a trusted friend would be.`;
  } else if (hasPositiveMood) {
    // User is doing well - be uplifting and encouraging
    personalityPrompt = `You are an uplifting, positive mental health support AI. The user seems to be in a good space. Your role is to:
1. Celebrate their positive mood and reinforce it
2. Encourage them to maintain this positive energy
3. Share tips for maintaining mental wellness
4. Be enthusiastic and supportive of their wellbeing
5. Help them build on this positive momentum

Use an encouraging, warm, and cheerful tone while remaining genuine and supportive.`;
  } else {
    // General supportive mode
    personalityPrompt = `You are a caring mental health support AI. Your role is to:
1. Listen to what the user is sharing with empathy and understanding
2. Adapt your support style to their emotional needs
3. Provide thoughtful, compassionate responses
4. Offer encouragement and practical mental wellness tips
5. Help them feel better and more supported

Be warm, genuine, and always put their emotional wellbeing first.`;
  }

  if (latestForm) {
    personalityPrompt += `\n\nYou also have access to the user's recent health information:
- Heart Rate: ${latestForm.heartRate} bpm
- SpO2: ${latestForm.spo2}%
- Temperature: ${latestForm.temperature}°F
- Blood Pressure: ${latestForm.bloodPressure.systolic}/${latestForm.bloodPressure.diastolic} mmHg

Consider this context when providing holistic mental and physical wellness support.`;
  }

  return personalityPrompt;
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

    const systemPrompt = buildMainSystemPrompt(latestForm, chatHistory.messages);
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