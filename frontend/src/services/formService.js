import api from "../api/axios";

// Create health form
export const createForm = (data) => {
  return api.post("/form/create", data);
};

// Get all forms of logged-in user
export const getMyForms = () => {
  return api.get("/form/all");
};

// Get a single form
export const getFormById = (id) => {
  return api.get(`/form/${id}`);
};
