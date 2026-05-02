import { Log } from "../middleware/loggerConfig";

const STORAGE_KEY = "campus-notification-practice-viewed";

export function readViewedIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return new Set<string>(parsed);
    }
  } catch {
    void Log("frontend", "warn", "state", "viewed notification store could not be parsed");
  }

  return new Set<string>();
}

export function persistViewedIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  void Log("frontend", "info", "state", `persisted ${ids.size} viewed notifications`);
}

