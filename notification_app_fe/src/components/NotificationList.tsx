import type { RankedNotification } from "../utils/priority";
import { NotificationCard } from "./NotificationCard";

type NotificationListProps = {
  items: RankedNotification[];
  onMarkViewed: (id: string) => void;
  showScore?: boolean;
};

export function NotificationList({ items, onMarkViewed, showScore }: NotificationListProps) {
  return (
    <section className="notification-list" aria-label="Notification list">
      {items.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onMarkViewed={onMarkViewed}
          showScore={showScore}
        />
      ))}
    </section>
  );
}

