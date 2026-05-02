import { useEffect, useState } from "react";
import { Log } from "../middleware/loggerConfig";
import { fetchNotifications } from "../services/notificationApi";
import type { NotificationPageResult, NotificationQuery } from "../types/notification";

type NotificationLoadState = {
  data: NotificationPageResult | null;
  loading: boolean;
  error: string | null;
};

export function useNotifications(query: NotificationQuery) {
  const [state, setState] = useState<NotificationLoadState>({
    data: null,
    loading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((current) => ({ ...current, loading: true, error: null }));

      try {
        const data = await fetchNotifications(query);
        if (!cancelled) {
          setState({ data, loading: false, error: null });
          void Log("frontend", "info", "hook", "notifications loaded");
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "Unable to load notifications",
          });
          void Log("frontend", "error", "hook", "notifications failed to load");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [query.limit, query.notificationType, query.page, reloadKey]);

  return {
    ...state,
    refetch: () => setReloadKey((value) => value + 1),
  };
}

