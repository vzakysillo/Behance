import { AxiosApi, type ApiResponse } from "./axios.api";

export const login = async (email: string, password: string): Promise<string> => {
  const res = await AxiosApi.post<ApiResponse<{ token: string }>>("/auth/login", { email, password });
  const token = res.data.data?.token;
  if (!token) throw new Error(res.data.message || "Login failed");
  return token;
};

export const register = async (userName: string, email: string, password: string): Promise<void> => {
  await AxiosApi.post("/auth/register", { userName, email, password });
};
