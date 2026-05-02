import type { NotificationQuery, NotificationTypeFilter } from "../types/notification";

type QueryControlsProps = {
  query: NotificationQuery;
  onChange: (query: NotificationQuery) => void;
};

const types: NotificationTypeFilter[] = ["All", "Event", "Result", "Placement"];
const limits = [5, 10, 15, 20];

export function QueryControls({ query, onChange }: QueryControlsProps) {
  return (
    <section className="query-controls" aria-label="Notification filters">
      <label>
        Type
        <select
          value={query.notificationType}
          onChange={(event) =>
            onChange({
              ...query,
              page: 1,
              notificationType: event.target.value as NotificationTypeFilter,
            })
          }
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label>
        Limit
        <select
          value={query.limit}
          onChange={(event) =>
            onChange({
              ...query,
              page: 1,
              limit: Number(event.target.value),
            })
          }
        >
          {limits.map((limit) => (
            <option key={limit} value={limit}>
              {limit}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}

