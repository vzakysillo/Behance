export const routes = {
  home: () => "/",
  welcome: () => "/welcome",
  projectDetail: (id: string) => `/projects/${id}`,
  auth: {
    login: () => "/login",
    register: () => "/register",
    interests: () => "/interests",
  },
  profile: {
    root: () => "/profile",
    edit: () => "/profile/edit",
    projects: () => "/profile/projects",
    projectNew: () => "/profile/projects/new",
    projectPublished: (id: string) => `/profile/projects/${id}/published`,
    projectDetail: (id: string) => `/profile/projects/${id}`,
  },
} as const;
