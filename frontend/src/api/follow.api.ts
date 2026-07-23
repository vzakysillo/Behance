import { AxiosApi, type ApiResponse } from "./axios.api";

export interface FollowUser {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface FollowEntry {
  _id: string;
  followerId: string;
  followingId: FollowUser;
}

export const getFollowers = async (userId: string): Promise<FollowEntry[]> => {
  const res = await AxiosApi.get<ApiResponse<{ users: FollowEntry[] }>>(
    `/users/${userId}/follow/followers`
  );
  return res.data.data?.users ?? [];
};

export const getFollowing = async (userId: string): Promise<FollowEntry[]> => {
  const res = await AxiosApi.get<ApiResponse<{ users: FollowEntry[] }>>(
    `/users/${userId}/follow/following`
  );
  return res.data.data?.users ?? [];
};

export const followUser = async (userId: string): Promise<void> => {
  await AxiosApi.post(`/users/${userId}/follow`);
};

export const unfollowUser = async (userId: string): Promise<void> => {
  await AxiosApi.delete(`/users/${userId}/follow`);
};
