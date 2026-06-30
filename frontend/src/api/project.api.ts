import { AxiosApi, type ApiResponse } from "./axios.api";
import type { IComment, ILike, IProject } from "../types";

export type ProjectPayload = Pick<
  IProject,
  "name" | "description" | "cover" | "photos"
>;

export const getProjects = async (): Promise<IProject[]> => {
  const res = await AxiosApi.get<ApiResponse<{ projects: IProject[] }>>("/projects");
  return res.data.data?.projects ?? [];
};

export const getFeedProjects = async (): Promise<IProject[]> => {
  const res = await AxiosApi.get<ApiResponse<{ projects: IProject[] }>>(
    "/projects/feed"
  );
  return res.data.data?.projects ?? [];
};

export const getFeedProject = async (id: string): Promise<IProject> => {
  const res = await AxiosApi.get<ApiResponse<{ project: IProject }>>(
    `/projects/feed/${id}`
  );
  const project = res.data.data?.project;
  if (!project) throw new Error("No project data");
  return project;
};

export const getProject = async (id: string): Promise<IProject> => {
  const res = await AxiosApi.get<ApiResponse<{ project: IProject }>>(`/projects/${id}`);
  const project = res.data.data?.project;
  if (!project) throw new Error("No project data");
  return project;
};

export const createProject = async (data: ProjectPayload): Promise<IProject> => {
  const res = await AxiosApi.post<ApiResponse<{ project: IProject }>>("/projects", data);
  const project = res.data.data?.project;
  if (!project) throw new Error("No project data");
  return project;
};

export const updateProject = async (id: string, data: Partial<IProject>): Promise<IProject> => {
  const res = await AxiosApi.patch<ApiResponse<{ project: IProject }>>(`/projects/${id}`, data);
  const project = res.data.data?.project;
  if (!project) throw new Error("No project data");
  return project;
};

export const deleteProject = async (id: string): Promise<void> => {
  await AxiosApi.delete(`/projects/${id}`);
};

export const getProjectLikes = async (projectId: string): Promise<ILike[]> => {
  const res = await AxiosApi.get<ApiResponse<{ likes: ILike[] }>>(
    `/projects/${projectId}/likes`
  );
  return res.data.data?.likes ?? [];
};

export const addProjectLike = async (projectId: string): Promise<ILike> => {
  const res = await AxiosApi.post<ApiResponse<{ like: ILike }>>(
    `/projects/${projectId}/likes`
  );
  const like = res.data.data?.like;
  if (!like) throw new Error("No like data");
  return like;
};

export const removeProjectLike = async (projectId: string, likeId: string): Promise<void> => {
  await AxiosApi.delete(`/projects/${projectId}/likes/${likeId}`);
};

export const getProjectComments = async (
  projectId: string
): Promise<IComment[]> => {
  const res = await AxiosApi.get<ApiResponse<{ comments: IComment[] }>>(
    `/projects/${projectId}/comments`
  );
  return res.data.data?.comments ?? [];
};

export const addProjectComment = async (
  projectId: string,
  text: string
): Promise<IComment> => {
  const res = await AxiosApi.post<ApiResponse<{ comment: IComment }>>(
    `/projects/${projectId}/comments`,
    { text }
  );
  const comment = res.data.data?.comment;
  if (!comment) throw new Error("No comment data");
  return comment;
};

export const removeProjectComment = async (
  projectId: string,
  commentId: string
): Promise<void> => {
  await AxiosApi.delete(`/projects/${projectId}/comments/${commentId}`);
};
