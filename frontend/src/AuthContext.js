import axios from "axios";

export const login = async (email, password) => {
  const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
  localStorage.setItem("token", res.data.token);
  return res.data.user;
};
