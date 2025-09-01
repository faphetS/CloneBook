export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  profilePic: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setTokens: (accessToken: string) => void;
  updateUser: (updatedUser: User) => void;
}