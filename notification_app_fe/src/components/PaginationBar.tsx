import type { NotificationQuery } from "../types/notification";

type PaginationBarProps = {
  query: NotificationQuery;
  totalPages: number;
  onChange: (query: NotificationQuery) => void;
};

export function PaginationBar({ query, totalPages, onChange }: PaginationBarProps) {
  return (
    <div className="pagination-bar">
      <button
        className="secondary-button"
        disabled={query.page <= 1}
        onClick={() => onChange({ ...query, page: query.page - 1 })}
        type="button"
      >
        Previous
      </button>
      <span>
        Page {query.page} of {totalPages}
      </span>
      <button
        className="secondary-button"
        disabled={query.page >= totalPages}
        onClick={() => onChange({ ...query, page: query.page + 1 })}
        type="button"
      >
        Next
      </button>
    </div>
  );
}

