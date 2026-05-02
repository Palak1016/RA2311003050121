import { configureLogger, Log } from "@logging/logger";

configureLogger({
  endpoint: import.meta.env.VITE_LOG_API_URL,
  bearerToken: import.meta.env.VITE_LOG_API_TOKEN,
});

void Log("frontend", "info", "config", "logger configured for notification frontend");

export { Log };

