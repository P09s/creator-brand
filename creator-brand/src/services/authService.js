const API_URL = "http://localhost:3000/api";

// Get token from Zustand store
const getToken = () => {
  const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
  return authStorage.state?.token;
};

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
  const authToken = token || getToken();
  const response = await fetch(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return handleResponse(response);
};

// Add more API calls as needed
export const updateProfile = async (profileData) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
};