export type LogStack = "frontend" | "backend";
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export type LogPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils"
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service";

type LoggerConfig = {
  endpoint?: string;
  bearerToken?: string;
};

const allowedStacks = new Set<LogStack>(["frontend", "backend"]);
const allowedLevels = new Set<LogLevel>(["debug", "info", "warn", "error", "fatal"]);
const allowedPackages = new Set<LogPackage>([
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",
  "auth",
  "config",
  "middleware",
  "utils",
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
]);

let loggerConfig: LoggerConfig = {};
const unsentLogs: unknown[] = [];

export function configureLogger(config: LoggerConfig) {
  loggerConfig = {
    endpoint: config.endpoint?.trim() || undefined,
    bearerToken: config.bearerToken?.trim() || undefined,
  };
}

export async function Log(
  stack: LogStack,
  level: LogLevel,
  packageName: LogPackage,
  message: string,
) {
  if (!allowedStacks.has(stack) || !allowedLevels.has(level) || !allowedPackages.has(packageName)) {
    throw new Error("Invalid log field");
  }

  const payload = {
    stack,
    level,
    package: packageName,
    message,
    timestamp: new Date().toISOString(),
  };

  if (!loggerConfig.endpoint) {
    writeConsole(level, payload);
    return payload;
  }

  try {
    const response = await fetch(loggerConfig.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(loggerConfig.bearerToken ? { Authorization: `Bearer ${loggerConfig.bearerToken}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Log request failed with status ${response.status}`);
    }
  } catch (error) {
    if (unsentLogs.length >= 25) {
      unsentLogs.shift();
    }

    unsentLogs.push(payload);
    writeConsole("warn", {
      ...payload,
      message: `logging fallback: ${error instanceof Error ? error.message : "unknown error"}`,
    });
  }

  return payload;
}

export function getBufferedLogs() {
  return [...unsentLogs];
}

function writeConsole(level: LogLevel, payload: unknown) {
  const method = level === "fatal" ? "error" : level;
  console[method](payload);
}

