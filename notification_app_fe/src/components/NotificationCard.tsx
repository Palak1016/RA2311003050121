import type { RankedNotification } from "../utils/priority";

type NotificationCardProps = {
  notification: RankedNotification;
  onMarkViewed: (id: string) => void;
  showScore?: boolean;
};

export function NotificationCard({ notification, onMarkViewed, showScore }: NotificationCardProps) {
  return (
    <article className={notification.viewed ? "notification-card viewed" : "notification-card"}>
      <div className="card-topline">
        <span className={`type-pill ${notification.type.toLowerCase()}`}>{notification.type}</span>
        <span className={notification.viewed ? "status-chip muted" : "status-chip"}>{notification.viewed ? "Viewed" : "New"}</span>
      </div>

      <h2>{notification.message}</h2>

      <dl className="notification-meta">
        <div>
          <dt>Time</dt>
          <dd>{formatDate(notification.timestamp)}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{notification.source ?? "Campus Desk"}</dd>
        </div>
        {showScore ? (
          <div>
            <dt>Score</dt>
            <dd>{notification.priorityScore}</dd>
          </div>
        ) : null}
      </dl>

      <button
        className="text-button"
        disabled={notification.viewed}
        onClick={() => onMarkViewed(notification.id)}
        type="button"
      >
        Mark Viewed
      </button>
    </article>
  );
}

function formatDate(timestamp: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

