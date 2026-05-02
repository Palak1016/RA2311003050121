import { EmptyState } from "../components/EmptyState";
import { ErrorPanel } from "../components/ErrorPanel";
import { HeaderBar } from "../components/HeaderBar";
import { LoadingList } from "../components/LoadingList";
import { NotificationList } from "../components/NotificationList";
import { PaginationBar } from "../components/PaginationBar";
import { QueryControls } from "../components/QueryControls";
import { usePriorityNotifications } from "../hooks/usePriorityNotifications";
import { Log } from "../middleware/loggerConfig";
import type { NotificationQuery } from "../types/notification";

type PriorityNotificationsPageProps = {
  query: NotificationQuery;
  viewedIds: Set<string>;
  onQueryChange: (query: NotificationQuery) => void;
  onMarkViewed: (id: string) => void;
};

export function PriorityNotificationsPage({
  query,
  viewedIds,
  onQueryChange,
  onMarkViewed,
}: PriorityNotificationsPageProps) {
  const { items, total, totalPages, loading, error, refetch } = usePriorityNotifications(query, viewedIds);
  const newCount = items.filter((item) => !item.viewed).length;

  void Log("frontend", "debug", "page", "render priority notifications page");

  return (
    <>
      <HeaderBar
        title="Priority Inbox"
        subtitle="Unread, time-sensitive campus updates ranked by type, message signal, and recency."
        total={total}
        newCount={newCount}
      />

      <QueryControls query={query} onChange={onQueryChange} />

      {error ? <ErrorPanel message={error} onRetry={refetch} /> : null}
      {loading ? <LoadingList /> : null}
      {!loading && !error && items.length === 0 ? (
        <EmptyState title="No priority notifications" message="The current filters do not match any notifications." />
      ) : null}
      {!loading && !error && items.length > 0 ? (
        <>
          <div className="list-actions">
            <span>Highest priority first</span>
          </div>
          <NotificationList items={items} onMarkViewed={onMarkViewed} showScore />
          <PaginationBar query={query} totalPages={totalPages} onChange={onQueryChange} />
        </>
      ) : null}
    </>
  );
}

