import { AxiosApi, type ApiResponse } from "./axios.api";
import type { IUser } from "../types";

export const getMe = async (): Promise<IUser> => {
  const res = await AxiosApi.get<ApiResponse<{ user: IUser }>>("/users/me");
  const user = res.data.data?.user;
  if (!user) throw new Error("No user data");
  return user;
};

export const updateMe = async (data: Partial<IUser>): Promise<IUser> => {
  const res = await AxiosApi.patch<ApiResponse<{ user: IUser }>>("/users/me", data);
  const user = res.data.data?.user;
  if (!user) throw new Error("No user data");
  return user;
};
