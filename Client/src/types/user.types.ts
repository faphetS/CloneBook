// user.types.ts
export interface UserType {
  id: number;
  username: string;
  email: string;
  profilePic: string;
  createdAt: string;
  role: string;
}

export interface UserSearchType {
  id: number;
  username: string;
  profilePic: string;
}

export interface UserState {
  profile: UserType | null;
  loading: boolean;
  loadingSearch: boolean;
  searchResults: UserSearchType[];

  setLoadingSearch: (val: boolean) => void
  searchUsers: (username: string) => Promise<void>;
  fetchUserDetails: (userId: number) => Promise<void>;
  updateProfile?: (data: {
    username?: string;
    password?: string;
    profilePic?: File | null;
  }) => Promise<{ message: string, user: UserType }>;
}
