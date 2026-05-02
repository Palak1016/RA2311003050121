import { EmptyState } from "../components/EmptyState";
import { ErrorPanel } from "../components/ErrorPanel";
import { HeaderBar } from "../components/HeaderBar";
import { LoadingList } from "../components/LoadingList";
import { NotificationList } from "../components/NotificationList";
import { PaginationBar } from "../components/PaginationBar";
import { QueryControls } from "../components/QueryControls";
import { useNotifications } from "../hooks/useNotifications";
import { Log } from "../middleware/loggerConfig";
import type { NotificationQuery } from "../types/notification";
import { rankNotifications } from "../utils/priority";

type AllNotificationsPageProps = {
  query: NotificationQuery;
  viewedIds: Set<string>;
  onQueryChange: (query: NotificationQuery) => void;
  onMarkViewed: (id: string) => void;
  onMarkManyViewed: (ids: string[]) => void;
};

export function AllNotificationsPage({
  query,
  viewedIds,
  onQueryChange,
  onMarkViewed,
  onMarkManyViewed,
}: AllNotificationsPageProps) {
  const { data, loading, error, refetch } = useNotifications(query);
  const rankedItems = data ? rankNotifications(data.items, viewedIds) : [];
  const newCount = rankedItems.filter((item) => !item.viewed).length;

  void Log("frontend", "debug", "page", "render all notifications page");

  return (
    <>
      <HeaderBar
        title="All Notifications"
        subtitle="A chronological stream with type filters and viewed state."
        total={data?.total ?? 0}
        newCount={newCount}
      />

      <QueryControls query={query} onChange={onQueryChange} />

      {error ? <ErrorPanel message={error} onRetry={refetch} /> : null}
      {loading ? <LoadingList /> : null}
      {!loading && !error && rankedItems.length === 0 ? (
        <EmptyState title="No notifications found" message="Try a different type filter or page." />
      ) : null}
      {!loading && !error && rankedItems.length > 0 ? (
        <>
          <div className="list-actions">
            <span>{data?.source === "api" ? "API data" : "Practice data"}</span>
            <button
              className="secondary-button"
              onClick={() => onMarkManyViewed(rankedItems.map((item) => item.id))}
              type="button"
            >
              Mark Page Viewed
            </button>
          </div>
          <NotificationList items={rankedItems} onMarkViewed={onMarkViewed} />
          <PaginationBar query={query} totalPages={data?.totalPages ?? 1} onChange={onQueryChange} />
        </>
      ) : null}
    </>
  );
}

