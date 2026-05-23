export const routes = {
  login: "/login",
  register: "/register",
  profile: "/profile",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
