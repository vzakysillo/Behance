export const routes = {
  home: () => "/feed",
  welcome: () => "/welcome",
  projectDetail: (id: string) => `/projects/${id}`,
  publicProfile: (id: string) => `/users/${id}`,
  auth: {
    login: () => "/login",
    register: () => "/register",
    interests: () => "/interests",
    verify: () => "/verify",
  },
  profile: {
    root: () => "/profile",
    edit: () => "/profile/edit",
    projectUpload: () => "/profile/projects/new",
    projectAssets: () => "/profile/projects/new/assets",
    projectCreate: () => "/profile/projects/new/details",
    projectPublished: (id: string) => `/profile/projects/${id}/published`,
    projectDetail: (id: string) => `/profile/projects/${id}`,
  },
} as const;
