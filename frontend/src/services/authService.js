import api from "../api/axios";

// Register user
export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

// Login user
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

// Get logged-in user profile
export const getProfile = () => {
  return api.get("/auth/me");
};
