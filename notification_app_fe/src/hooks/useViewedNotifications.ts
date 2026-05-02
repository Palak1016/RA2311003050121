import { useCallback, useMemo, useState } from "react";
import { Log } from "../middleware/loggerConfig";
import { persistViewedIds, readViewedIds } from "../state/viewedStore";

export function useViewedNotifications() {
  const [viewedIds, setViewedIds] = useState(() => readViewedIds());

  const markViewed = useCallback((id: string) => {
    setViewedIds((current) => {
      const next = new Set(current);
      next.add(id);
      persistViewedIds(next);
      void Log("frontend", "info", "hook", `notification marked viewed: ${id}`);
      return next;
    });
  }, []);

  const markManyViewed = useCallback((ids: string[]) => {
    setViewedIds((current) => {
      const next = new Set(current);
      ids.forEach((id) => next.add(id));
      persistViewedIds(next);
      void Log("frontend", "info", "hook", `marked ${ids.length} notifications viewed`);
      return next;
    });
  }, []);

  const resetViewed = useCallback(() => {
    const next = new Set<string>();
    persistViewedIds(next);
    setViewedIds(next);
    void Log("frontend", "warn", "hook", "viewed notification state reset");
  }, []);

  return useMemo(
    () => ({
      viewedIds,
      markViewed,
      markManyViewed,
      resetViewed,
    }),
    [markManyViewed, markViewed, resetViewed, viewedIds],
  );
}

