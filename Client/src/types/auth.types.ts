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
  loading: boolean;

  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setTokens: (accessToken: string) => void;
  updateUser: (updatedUser: User) => void;
  verifyEmail: (token: string) => Promise<{ success: boolean; message: string }>;
  refresh: () => Promise<void>;
}