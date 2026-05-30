export interface IUser {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  socials: string[];
  skills: string[];
  avatar: string;
  isVerified: boolean;
  projects: string[];
}

export interface IProject {
  _id: string;
  name: string;
  description?: string;
  cover?: string;
  photos?: string[];
}
