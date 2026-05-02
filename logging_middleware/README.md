# Logging Middleware

Reusable logging helper for frontend practice projects.

Primary function:

```ts
Log(stack, level, packageName, message)
```

The logger can send logs with a protected bearer token:

```ts
configureLogger({
  endpoint: "https://example.test/logs",
  bearerToken: "token-value",
});
```

Or it can receive a dynamic authorization header provider:

```ts
configureLogger({
  endpoint: "https://example.test/logs",
  getAuthorizationHeader: () => "Bearer token-value",
});
```

Allowed frontend packages include:

- `api`
- `component`
- `hook`
- `page`
- `state`
- `style`
- `auth`
- `config`
- `middleware`
- `utils`
