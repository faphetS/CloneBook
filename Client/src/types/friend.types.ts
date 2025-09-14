export type Friend = {
  id: number;
  username: string;
  profilePic: string | null;
};

export type FriendStatus =
  "self"
  | "friends"
  | "pending_incoming"
  | "pending_outgoing"
  | "none";

export type FriendRequest = {
  id: number;
  senderId: number;
  senderName: string;
  senderProfilePic: string | null;
  createdAt: string;
};

export type FriendPagination = {
  offset: number;
  limit: number;
  hasMore: boolean;
  loading: boolean;
};

export type PendingPagination = {
  offset: number;
  limit: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
};

export type FriendStore = {
  friends: Friend[];
  friendsPagination: FriendPagination;

  pendingRequests: FriendRequest[];
  pendingPagination: PendingPagination;

  outgoingRequests: number[];
  friendCount: number;
  pendingCount: number;
  friendStatus: FriendStatus;

  fetchFriends: () => Promise<void>;
  resetFriends: () => void;
  fetchFriendCount: (userId: number) => Promise<void>;
  fetchFriendStatus: (userId: number) => Promise<void>;
  unfriend: (friendId: number) => Promise<void>;

  resetPendingReq: () => void;
  fetchPendingCount: () => Promise<void>
  fetchPendingRequests: (loadMore?: boolean) => Promise<void>;

  sendRequest: (receiverId: number) => Promise<void>;
  acceptRequest: (friend: Friend) => Promise<void>;
  declineRequest: (senderId: number) => Promise<void>;
  cancelRequest: (receiverId: number) => Promise<void>;
};
