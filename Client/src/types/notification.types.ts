export interface Notification {
  id: number;
  type: string;
  text: string;
  unread: boolean;
  createdAt: string;
  senderName: string;
  senderId: number;
  profilePic: string;
}

export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  loadingMore: boolean;
  offset: number;
  limit: number;
  hasMore: boolean;
  unreadCount: number;

  resetNotif: () => void;
  fetchNotifs: (loadMore?: boolean) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>
}