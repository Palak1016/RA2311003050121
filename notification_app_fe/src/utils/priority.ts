import type { CampusNotification } from "../types/notification";

const typeWeights = {
  Placement: 42,
  Result: 30,
  Event: 20,
} satisfies Record<CampusNotification["type"], number>;

const keywordWeights = new Map<string, number>([
  ["deadline", 18],
  ["final", 16],
  ["offer", 16],
  ["shortlist", 14],
  ["interview", 12],
  ["hiring", 12],
  ["result", 9],
  ["closes", 8],
  ["slots", 7],
  ["moved", 5],
]);

export type RankedNotification = CampusNotification & {
  priorityScore: number;
  viewed: boolean;
};

export function rankNotifications(
  notifications: CampusNotification[],
  viewedIds: Set<string>,
): RankedNotification[] {
  return notifications
    .map((notification) => ({
      ...notification,
      viewed: viewedIds.has(notification.id),
      priorityScore: scoreNotification(notification, viewedIds.has(notification.id)),
    }))
    .sort((left, right) => {
      if (left.viewed !== right.viewed) {
        return left.viewed ? 1 : -1;
      }

      if (right.priorityScore !== left.priorityScore) {
        return right.priorityScore - left.priorityScore;
      }

      const timeDelta = new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime();
      if (timeDelta !== 0) {
        return timeDelta;
      }

      return left.id.localeCompare(right.id);
    });
}

export function scoreNotification(notification: CampusNotification, viewed: boolean) {
  const text = notification.message.toLowerCase();
  const keywordScore = [...keywordWeights.entries()].reduce((score, [word, weight]) => {
    return text.includes(word) ? score + weight : score;
  }, 0);
  const recencyScore = getRecencyScore(notification.timestamp);
  const unreadBoost = viewed ? 0 : 18;

  return typeWeights[notification.type] + keywordScore + recencyScore + unreadBoost;
}

function getRecencyScore(timestamp: string) {
  const ageMinutes = Math.max(0, (Date.now() - new Date(timestamp).getTime()) / 60000);
  const score = 24 - ageMinutes / 120;
  return Math.max(0, Math.round(score));
}

