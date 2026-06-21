import axios from "axios";

export interface ApiResponse<T = undefined> {
  message: string;
  data?: T;
}

export const AxiosApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token on every request
AxiosApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap error messages + auto-logout on 401
AxiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    const apiResponse = error.response?.data as ApiResponse<unknown> | undefined;
    const message = apiResponse?.message ?? error.message ?? "Server error";
    return Promise.reject(new Error(message));
  }
);
