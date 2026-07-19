export const routes = {
  home: () => "/",
  welcome: () => "/welcome",
  projectDetail: (id: string) => `/projects/${id}`,
  publicProfile: (id: string) => `/users/${id}`,
  auth: {
    login: () => "/login",
    register: () => "/register",
    interests: () => "/interests",
  },
  profile: {
    root: () => "/profile",
    edit: () => "/profile/edit",
    projectNew: () => "/profile/projects/new",
    projectAssets: () => "/profile/projects/new/assets",
    projectDetails: () => "/profile/projects/new/details",
    projectPublished: (id: string) => `/profile/projects/${id}/published`,
    projectDetail: (id: string) => `/profile/projects/${id}`,
  },
} as const;
