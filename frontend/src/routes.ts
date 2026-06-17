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
    projects: () => "/profile/projects",
    projectNew: () => "/profile/projects/new",
    projectDetail: (id: string) => `/profile/projects/${id}`,
  },
  
} as const;
