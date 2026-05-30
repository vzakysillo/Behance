export const routes = {
  auth: {
    login: () => "/login",
    register: () => "/register",
  },
  profile: {
    root: () => "/profile",
    projects: () => "/profile/projects",
    projectNew: () => "/profile/projects/new",
    projectDetail: (id: string) => `/profile/projects/${id}`,
  },
} as const;
