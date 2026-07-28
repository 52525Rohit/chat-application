import axios from "axios";
import {
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  clearSession,
} from "../utils/authStorage";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const UPLOADS_URL = `${API_URL}/uploads`;

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const redirectToLogin = () => {
  clearSession();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

let refreshPromise = null;

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
  setToken(data.token);
  setRefreshToken(data.refreshToken);
  return data.token;
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const url = config?.url || "";
    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

    if (response?.status !== 401 || isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (config._retry) {
      redirectToLogin();
      return Promise.reject(error);
    }
    config._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;
      config.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient(config);
    } catch (refreshError) {
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  },
);

export const getProfilePicUrl = (fileName) =>
  fileName ? `${UPLOADS_URL}/${fileName}` : null;

export default axiosClient;
