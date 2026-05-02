import { practiceNotifications } from "../data/practiceNotifications";
import { Log } from "../middleware/loggerConfig";
import type {
  CampusNotification,
  NotificationPageResult,
  NotificationQuery,
  NotificationType,
} from "../types/notification";
import { toApiQuery } from "../utils/query";

const notificationApiUrl = import.meta.env.VITE_NOTIFICATION_API_URL?.trim();
const notificationApiToken = import.meta.env.VITE_NOTIFICATION_API_TOKEN?.trim();

export async function fetchNotifications(query: NotificationQuery): Promise<NotificationPageResult> {
  void Log(
    "frontend",
    "info",
    "api",
    `fetch notifications page=${query.page} limit=${query.limit} type=${query.notificationType}`,
  );

  if (!notificationApiUrl) {
    return fetchPracticeNotifications(query);
  }

  const url = new URL(notificationApiUrl);
  const params = toApiQuery(query);
  params.forEach((value, key) => url.searchParams.set(key, value));

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(notificationApiToken ? { Authorization: `Bearer ${notificationApiToken}` } : {}),
    },
  });

  if (!response.ok) {
    void Log("frontend", "error", "api", `notification request failed with status ${response.status}`);
    throw new Error(`Notification request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const rawItems = Array.isArray(payload) ? payload : payload.notifications ?? payload.items ?? [];
  const normalized = rawItems.map(normalizeNotification).filter(Boolean) as CampusNotification[];
  const total = typeof payload.total === "number" ? payload.total : normalized.length;

  void Log("frontend", "info", "api", `received ${normalized.length} notifications from API`);

  return {
    items: normalized,
    total,
    page: query.page,
    limit: query.limit,
    totalPages: Math.max(1, Math.ceil(total / query.limit)),
    source: "api",
  };
}

export async function fetchNotificationsForPriority(
  query: NotificationQuery,
): Promise<CampusNotification[]> {
  const broadQuery = {
    ...query,
    page: 1,
    limit: Math.max(query.limit * Math.max(query.page, 1), 50),
  };
  const result = await fetchNotifications(broadQuery);
  return result.items;
}

function fetchPracticeNotifications(query: NotificationQuery): NotificationPageResult {
  const filtered =
    query.notificationType === "All"
      ? practiceNotifications
      : practiceNotifications.filter((item) => item.type === query.notificationType);
  const sorted = [...filtered].sort(
    (left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
  );
  const start = (query.page - 1) * query.limit;
  const items = sorted.slice(start, start + query.limit);

  void Log("frontend", "debug", "api", `using ${items.length} practice notifications`);

  return {
    items,
    total: sorted.length,
    page: query.page,
    limit: query.limit,
    totalPages: Math.max(1, Math.ceil(sorted.length / query.limit)),
    source: "practice-data",
  };
}

function normalizeNotification(value: unknown): CampusNotification | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const id = stringField(record.ID) ?? stringField(record.id);
  const type = normalizeType(stringField(record.Type) ?? stringField(record.type));
  const message = stringField(record.Message) ?? stringField(record.message);
  const timestamp = stringField(record.Timestamp) ?? stringField(record.timestamp);

  if (!id || !type || !message || !timestamp) {
    return null;
  }

  return {
    id,
    type,
    message,
    timestamp,
    source: stringField(record.Source) ?? stringField(record.source),
    audience: stringField(record.Audience) ?? stringField(record.audience),
  };
}

function stringField(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeType(value: string | undefined): NotificationType | null {
  if (value === "Event" || value === "Result" || value === "Placement") {
    return value;
  }

  return null;
}

