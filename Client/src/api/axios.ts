import axios from "axios";
import { useAuthStore } from "../store/authStore.js";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('Axios error response:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { setTokens, logout } = useAuthStore.getState();
      try {
        const res = await axios.post("/api/auth/refresh-token", {}, { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        setTokens(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
