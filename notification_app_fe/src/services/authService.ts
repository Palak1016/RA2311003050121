type CachedAuthToken = {
  accessToken: string;
  tokenType: string;
  expiresAt: number;
};

const authApiUrl = envValue("VITE_AUTH_API_URL");
const staticAuthToken = envValue("VITE_AUTH_TOKEN") ?? envValue("VITE_NOTIFICATION_API_TOKEN");

let cachedAuthToken: CachedAuthToken | null = null;
let activeTokenRequest: Promise<CachedAuthToken> | null = null;

export async function getAuthorizationHeader() {
  if (staticAuthToken) {
    return normalizeAuthorizationHeader(staticAuthToken);
  }

  const token = await getAccessToken();
  return `${token.tokenType} ${token.accessToken}`;
}

export async function getAccessToken() {
  if (cachedAuthToken && cachedAuthToken.expiresAt > Date.now() + 30_000) {
    return cachedAuthToken;
  }

  if (!activeTokenRequest) {
    activeTokenRequest = requestAccessToken().finally(() => {
      activeTokenRequest = null;
    });
  }

  cachedAuthToken = await activeTokenRequest;
  return cachedAuthToken;
}

async function requestAccessToken(): Promise<CachedAuthToken> {
  if (!authApiUrl) {
    throw new Error("Missing VITE_AUTH_API_URL. Add it to notification_app_fe/.env.");
  }

  const body = buildAuthRequestBody();
  const response = await fetch(authApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Auth request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Record<string, unknown>;
  const accessToken = stringField(payload.access_token) ?? stringField(payload.accessToken);
  const tokenType = stringField(payload.token_type) ?? stringField(payload.tokenType) ?? "Bearer";
  const expiresIn = numberField(payload.expires_in) ?? numberField(payload.expiresIn) ?? 3600;

  if (!accessToken) {
    throw new Error("Auth response did not include access_token.");
  }

  return {
    accessToken,
    tokenType,
    expiresAt: Date.now() + expiresIn * 1000,
  };
}

function buildAuthRequestBody() {
  const body = {
    email: envValue("VITE_AUTH_EMAIL"),
    name: envValue("VITE_AUTH_NAME"),
    rollNo: envValue("VITE_AUTH_ROLL_NO"),
    accessCode: envValue("VITE_AUTH_ACCESS_CODE"),
    clientID: envValue("VITE_AUTH_CLIENT_ID"),
    clientSecret: envValue("VITE_AUTH_CLIENT_SECRET"),
  };
  const missingFields = Object.entries(body)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    throw new Error(
      `Missing auth environment values: ${missingFields.join(", ")}. Run npm run register if client credentials are not available yet.`,
    );
  }

  return body as Record<keyof typeof body, string>;
}

function envValue(key: string) {
  const value = import.meta.env[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function stringField(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function numberField(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : undefined;
}

function normalizeAuthorizationHeader(token: string) {
  return token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`;
}
