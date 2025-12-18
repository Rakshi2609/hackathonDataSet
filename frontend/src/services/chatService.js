import api from "../api/axios";

// Main chatbot
export const sendMainChatMessage = (message) => {
  return api.post("/chat/main", { message });
};

export const getMainChatHistory = () => {
  return api.get("/chat/main/history");
};

export const clearMainChatHistory = () => {
  return api.delete("/chat/main/history");
};

// Form-specific chatbot
export const sendFormChatMessage = (formId, message) => {
  return api.post(`/chat/form/${formId}`, { message });
};

export const getFormChatHistory = (formId) => {
  return api.get(`/chat/form/${formId}/history`);
};

export const clearFormChatHistory = (formId) => {
  return api.delete(`/chat/form/${formId}/history`);
};
