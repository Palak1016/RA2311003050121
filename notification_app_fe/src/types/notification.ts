export type NotificationType = "Event" | "Result" | "Placement";
export type NotificationTypeFilter = "All" | NotificationType;

export type CampusNotification = {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  source?: string;
  audience?: string;
};

export type NotificationQuery = {
  page: number;
  limit: number;
  notificationType: NotificationTypeFilter;
};

export type NotificationPageResult = {
  items: CampusNotification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  source: "api" | "practice-data";
};

