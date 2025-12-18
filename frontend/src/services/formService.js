import api from "../api/axios";

// Create health form (Supports Image Upload via FormData)
export const createForm = (formData) => {
  // Axios automatically sets 'Content-Type: multipart/form-data' when it sees FormData
  return api.post("/form/create", formData);
};

// Get all health records for the logged-in practitioner
export const getMyForms = () => {
  return api.get("/form/all");
};

// Get specific record details by ID
export const getFormById = (id) => {
  return api.get(`/form/${id}`);
};