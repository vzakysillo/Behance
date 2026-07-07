import { AxiosApi, type ApiResponse } from "./axios.api";

export interface FollowUser {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export const getFollowers = async (userId: string): Promise<FollowUser[]> => {
  const res = await AxiosApi.get<ApiResponse<{ users: FollowUser[] }>>(
    `/users/${userId}/follow/followers`
  );
  return res.data.data?.users ?? [];
};

export const getFollowing = async (userId: string): Promise<FollowUser[]> => {
  const res = await AxiosApi.get<ApiResponse<{ users: FollowUser[] }>>(
    `/users/${userId}/follow/following`
  );
  return res.data.data?.users ?? [];
};
