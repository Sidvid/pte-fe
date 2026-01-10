import axios from "axios";
import { portalConfig } from "../constants/app-constants";

const appType = import.meta.env.VITE_APP_TYPE as keyof typeof portalConfig;
console.log("what is app type", appType);
const apiClient = axios.create({
  baseURL: portalConfig[appType].url,
});

axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
  { synchronous: true /* This function returns true */ }
);

// Add a response interceptor
axios.interceptors.response.use(
  function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
export default apiClient;
