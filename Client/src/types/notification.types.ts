export interface Notification {
  id: number;
  type: string;
  text: string;
  unread: boolean;
  createdAt: string;
  senderName: string;
  profilePic: string;
}

export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  fetchNotifs: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
}