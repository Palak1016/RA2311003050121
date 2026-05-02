import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env");
const envFile = readFileSync(envPath, "utf8");
const env = parseEnv(envFile);

const existingClientId = env.VITE_AUTH_CLIENT_ID?.trim();
const existingClientSecret = env.VITE_AUTH_CLIENT_SECRET?.trim();

if (existingClientId && existingClientSecret) {
  console.log("Client credentials already exist in .env. Registration was not repeated.");
  process.exit(0);
}

const registerUrl = required("VITE_REGISTER_API_URL");
const requestBody = {
  email: required("VITE_AUTH_EMAIL"),
  name: required("VITE_AUTH_NAME"),
  mobileNo: required("VITE_AUTH_MOBILE_NO"),
  githubUsername: required("VITE_AUTH_GITHUB_USERNAME"),
  rollNo: required("VITE_AUTH_ROLL_NO"),
  accessCode: required("VITE_AUTH_ACCESS_CODE"),
};

const response = await fetch(registerUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify(requestBody),
});

const responseText = await response.text();

if (!response.ok) {
  console.error(`Registration failed with status ${response.status}.`);
  console.error(responseText);
  process.exit(1);
}

const payload = parseJson(responseText);
const clientID = readString(payload, "clientID", "clientId", "client_id");
const clientSecret = readString(payload, "clientSecret", "client_secret");

if (!clientID || !clientSecret) {
  console.error("Registration response did not include clientID and clientSecret.");
  process.exit(1);
}

const nextEnvFile = setEnvValue(setEnvValue(envFile, "VITE_AUTH_CLIENT_ID", clientID), "VITE_AUTH_CLIENT_SECRET", clientSecret);
writeFileSync(envPath, nextEnvFile);

console.log("Registration complete. Client credentials were saved to .env.");

function required(key) {
  const value = env[key]?.trim();

  if (!value) {
    console.error(`Missing ${key} in .env`);
    process.exit(1);
  }

  return value;
}

function parseEnv(contents) {
  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.trim().startsWith("#"))
      .map((line) => {
        const separatorIndex = line.indexOf("=");
        if (separatorIndex === -1) {
          return [line.trim(), ""];
        }

        return [line.slice(0, separatorIndex).trim(), line.slice(separatorIndex + 1).trim()];
      }),
  );
}

function setEnvValue(contents, key, value) {
  const escapedValue = value.replaceAll("\n", "");
  const linePattern = new RegExp(`^${key}=.*$`, "m");

  if (linePattern.test(contents)) {
    return contents.replace(linePattern, `${key}=${escapedValue}`);
  }

  return `${contents.trimEnd()}\n${key}=${escapedValue}\n`;
}

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function readString(payload, ...keys) {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}
