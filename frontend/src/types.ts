export interface IUser {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  socials: string[];
  skills: string[];
  avatar: string;
  bio?: string;
  isVerified: boolean;
  // new — wire to backend later
  specialization?: string;
  location?: string;
  company?: string;
  city?: string;
  availableForFreelance?: boolean;
  aboutMe?: string;
  memberSince?: string;
  teams?: { name: string; location: string; avatar?: string }[];
}

export interface IProject {
  _id: string;
  userId: string;
  author?: IUser;
  name: string;
  description?: string;
  cover?: string;
  assets?: string[];
  tags?: string[];
  categories?: string[];
  toolsUsed?: string[];
  disableComments?: boolean;
  likesCount?: number;
  commentsCount?: number;
  similarProjects?: IProject[];
  authorProjects?: IProject[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ILike {
  _id: string;
  userId: string;
  projectId: string;
}

export interface IComment {
  _id: string;
  userId: string;
  author?: IUser;
  projectId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

