# Notification System Design

## Stage 1 - Priority Selection

The priority inbox ranks notifications using a deterministic score. The score is designed to keep the list stable, explainable, and efficient for repeated reads.

Priority score inputs:

- Type weight: placement messages are generally most time-sensitive, followed by results and events.
- Message signal: words such as `deadline`, `shortlist`, `interview`, `final`, and `offer` increase priority.
- Recency: newer notifications receive a small boost.
- Viewed state: unread notifications are promoted above already-viewed items.

The application sorts by:

1. Unread before viewed.
2. Higher computed priority score.
3. Newer timestamp.
4. Stable ID comparison as a final tie-breaker.

This makes fetching and ranking the top notifications simple:

```text
fetch notifications -> normalize -> filter by type -> score -> sort -> slice top N
```

For small and medium campus notification feeds, sorting in memory is acceptable. If the feed grows large, the same score components can move server-side into a database query, indexed by notification type and timestamp.

## Stage 2 - Frontend Architecture

The frontend is split by responsibility:

- `services/notificationApi.ts` handles API access, query parameters, response normalization, and fallback practice data.
- `utils/priority.ts` computes notification ranking.
- `state/viewedStore.ts` persists viewed notification IDs in `localStorage`.
- `hooks/useNotifications.ts` isolates loading, error, and refetch state.
- `components/` contains reusable display and control components.
- `pages/` contains the all-notifications page and the priority page.
- `logging_middleware/` provides the reusable `Log(stack, level, package, message)` helper.

## API Query Shape

The frontend builds requests with these query parameters:

- `limit`
- `page`
- `notification_type`

If `VITE_NOTIFICATION_API_URL` is not configured, the app uses synthetic practice data. This keeps the project runnable without relying on protected test infrastructure.

## Logging Strategy

The logging helper validates allowed values before sending a log event. Calls are placed around:

- API request start, success, and failure.
- Page mount and query changes.
- Viewed-state updates.
- Priority scoring and rendering checkpoints.

If no log endpoint is configured, logs are written to the browser console. If a configured endpoint fails, the logger keeps a small in-memory buffer so the application does not crash because of logging.

## Error Handling

API failures render a visible error state with a retry action. Response normalization accepts either camelCase fields or API-style uppercase fields such as `ID`, `Type`, `Message`, and `Timestamp`.

## Responsive UI

The UI uses vanilla CSS. Desktop layouts use a two-column dashboard frame. Mobile layouts collapse into a single-column flow with fixed-size controls to avoid layout jumps.

