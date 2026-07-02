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
  // new — wire to backend later
  specialization?: string;
  location?: string;
  availableForFreelance?: boolean;
  aboutMe?: string;
  memberSince?: string;
  stats?: {
    projectViews: number;
    appreciations: number;
    followers: number;
    following: number;
  };
  teams?: { name: string; location: string; avatar?: string }[];
}

export interface IProject {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  cover?: string;
  photos?: string[];
  tags?: string[];
  category?: string;
  toolsUsed?: string[];
  disableComments?: boolean;
  likesCount?: number;
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
  projectId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

