const API_URL = "http://localhost:3000/api";

// Helper to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Server error");
  }
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const register = async (name, email, password, userType) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, userType }),
  });
  return handleResponse(response);
};

export const getProfile = async (token) => {
  const response = await fetch(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};
