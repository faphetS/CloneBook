import axios from "axios";
import { useAuthStore } from "../store/autStore";

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_API_DOMAIN + "/api",
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

    // Prevent infinite loop for refresh-token endpoint itself
    if (originalRequest.url.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { setTokens, logout } = useAuthStore.getState();
      try {
        const res = await api.post("/auth/refresh-token", {}, { withCredentials: true });
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
