// src/auth.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // ✅ backend route

// ✅ Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ✅ Login API
export const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });

    // Save JWT + user info
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data.user;
  } catch (err) {
    throw err.response?.data?.msg || "Login failed";
  }
};

// ✅ Signup API (MODIFIED to accept object)
export const signup = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/signup`, userData);

    // optional: auto login after signup
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res.data.user || res.data;
  } catch (err) {
    throw err.response?.data?.msg || "Signup failed";
  }
};

// ✅ Get stored token
export const getToken = () => localStorage.getItem("token");

// ✅ Attach token to protected API calls
export const authAxios = axios.create();
authAxios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
