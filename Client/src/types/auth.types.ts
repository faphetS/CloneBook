export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setTokens: (accessToken: string) => void;
}