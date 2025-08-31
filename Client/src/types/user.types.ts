// types.ts
export interface UserType {
  id: number;
  username: string;
  email: string;
  profilePic: string;
  createdAt: string;
  role: string;
}

export interface UserState {
  profile: UserType | null;
  loading: boolean;
  fetchUserDetails: (userId: number) => Promise<void>;
  updateProfile?: (data: {
    username?: string;
    password?: string;
    profilePic?: File | null;
  }) => Promise<{ message: string }>;
}
