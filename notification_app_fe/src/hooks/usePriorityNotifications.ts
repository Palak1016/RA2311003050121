import { useEffect, useMemo, useState } from "react";
import { Log } from "../middleware/loggerConfig";
import { fetchNotificationsForPriority } from "../services/notificationApi";
import type { NotificationQuery } from "../types/notification";
import { rankNotifications, type RankedNotification } from "../utils/priority";

type PriorityState = {
  items: RankedNotification[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
};

export function usePriorityNotifications(query: NotificationQuery, viewedIds: Set<string>) {
  const [rawItems, setRawItems] = useState<Awaited<ReturnType<typeof fetchNotificationsForPriority>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const items = await fetchNotificationsForPriority(query);
        if (!cancelled) {
          setRawItems(items);
          void Log("frontend", "info", "hook", "priority source notifications loaded");
        }
      } catch (loadError) {
        if (!cancelled) {
          setRawItems([]);
          setError(loadError instanceof Error ? loadError.message : "Unable to load priority notifications");
          void Log("frontend", "error", "hook", "priority notifications failed to load");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [query.limit, query.notificationType, query.page, reloadKey]);

  const state: PriorityState = useMemo(() => {
    const ranked = rankNotifications(rawItems, viewedIds);
    const start = (query.page - 1) * query.limit;
    const pageItems = ranked.slice(start, start + query.limit);

    return {
      items: pageItems,
      total: ranked.length,
      totalPages: Math.max(1, Math.ceil(ranked.length / query.limit)),
      loading,
      error,
    };
  }, [error, loading, query.limit, query.page, rawItems, viewedIds]);

  return {
    ...state,
    refetch: () => setReloadKey((value) => value + 1),
  };
}

