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
}

export interface IProject {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  cover?: string;
  photos?: string[];
}

export interface ILike {
  _id: string;
  userId: string;
  projectId: string;
}

export interface IComment {
  _id: string;
  userId: string;
  projectId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}
