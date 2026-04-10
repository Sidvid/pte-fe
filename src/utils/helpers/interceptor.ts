import axios from "axios";
import { portalConfig } from "../constants/app-constants";
import { cookieUtils, STORAGE_KEYS } from "./cookies";

const appType = import.meta.env.VITE_APP_TYPE as keyof typeof portalConfig;
console.log("what is app type", appType);
const apiClient = axios.create({
  baseURL: portalConfig[appType].url,
});

axios.interceptors.request.use(
  (config) => {
    const token = cookieUtils.get(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear cookies and redirect
      cookieUtils.remove(STORAGE_KEYS.ACCESS_TOKEN);
      cookieUtils.remove(STORAGE_KEYS.USER_PORTAL);
      cookieUtils.remove(STORAGE_KEYS.USER_DATA);
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);
export default apiClient;
