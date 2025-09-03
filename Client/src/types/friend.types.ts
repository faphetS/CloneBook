export type Friend = {
  id: number;
  username: string;
  profilePic: string | null;
};

export type FriendStatus = "self" | "friends" | "pending_incoming" | "pending_outgoing" | "none";

export type FriendRequest = {
  id: number;
  senderId: number;
  senderName: string;
  senderProfilePic: string | null;
  createdAt: string;
};
export type FriendStore = {
  friends: Friend[];
  pendingRequests: FriendRequest[];
  outgoingRequests: number[];
  friendCount: number;
  loading: boolean;
  friendStatus: FriendStatus;

  fetchFriends: () => Promise<void>;
  fetchPendingRequests: () => Promise<void>;
  fetchFriendStatus: (userId: number) => Promise<void>;
  fetchFriendCount: (userId: number) => Promise<void>;
  sendRequest: (receiverId: number) => Promise<void>;
  acceptRequest: (senderId: number) => Promise<void>;
  declineRequest: (senderId: number) => Promise<void>;
  cancelRequest: (receiverId: number) => Promise<void>;
};
