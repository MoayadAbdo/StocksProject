import axios from "axios";
import { getAuthToken } from "../auth/tokenStorage";

const api = axios.create({
  baseURL: "/",
  timeout: 12000
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (!token) {
    return config;
  }

  if (typeof config.headers?.set === "function") {
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }

  return config;
});

export default api;
