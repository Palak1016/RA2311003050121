import { configureLogger, Log } from "@logging/logger";
import { getAuthorizationHeader } from "../services/authService";

configureLogger({
  endpoint: import.meta.env.VITE_LOG_API_URL,
  bearerToken: import.meta.env.VITE_LOG_API_TOKEN,
  getAuthorizationHeader,
});

void Log("frontend", "info", "config", "logger configured for notification frontend");

export { Log };
