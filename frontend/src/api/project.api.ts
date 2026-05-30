import { AxiosApi, type ApiResponse } from "./axios.api";
import type { IProject } from "../types";

export const getProjects = async (): Promise<IProject[]> => {
  const res = await AxiosApi.get<ApiResponse<{ projects: IProject[] }>>("/projects");
  return res.data.data?.projects ?? [];
};

export const getProject = async (id: string): Promise<IProject> => {
  const res = await AxiosApi.get<ApiResponse<{ project: IProject }>>(`/projects/${id}`);
  const project = res.data.data?.project;
  if (!project) throw new Error("No project data");
  return project;
};

export const createProject = async (data: Omit<IProject, "_id">): Promise<IProject> => {
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
