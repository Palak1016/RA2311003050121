import type { NotificationQuery, NotificationTypeFilter } from "../types/notification";

const DEFAULT_QUERY: NotificationQuery = {
  page: 1,
  limit: 10,
  notificationType: "All",
};

const allowedTypes = new Set<NotificationTypeFilter>(["All", "Event", "Result", "Placement"]);

export function readNotificationQuery(search: string): NotificationQuery {
  const params = new URLSearchParams(search);
  const page = toPositiveInt(params.get("page"), DEFAULT_QUERY.page);
  const limit = clamp(toPositiveInt(params.get("limit"), DEFAULT_QUERY.limit), 1, 50);
  const rawType = params.get("notification_type") ?? params.get("notificationType") ?? "All";
  const notificationType = allowedTypes.has(rawType as NotificationTypeFilter)
    ? (rawType as NotificationTypeFilter)
    : "All";

  return {
    page,
    limit,
    notificationType,
  };
}

export function createQueryString(query: NotificationQuery) {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));

  if (query.notificationType !== "All") {
    params.set("notification_type", query.notificationType);
  }

  return params.toString();
}

export function toApiQuery(query: NotificationQuery) {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));

  if (query.notificationType !== "All") {
    params.set("notification_type", query.notificationType);
  }

  return params;
}

function toPositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

