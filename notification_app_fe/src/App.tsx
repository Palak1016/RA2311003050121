import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { useViewedNotifications } from "./hooks/useViewedNotifications";
import { Log } from "./middleware/loggerConfig";
import { AllNotificationsPage } from "./pages/AllNotificationsPage";
import { PriorityNotificationsPage } from "./pages/PriorityNotificationsPage";
import type { NotificationQuery } from "./types/notification";
import { createQueryString, readNotificationQuery } from "./utils/query";

type RouteState = {
  path: string;
  query: NotificationQuery;
};

export default function App() {
  const [route, setRoute] = useState<RouteState>(() => readRoute());
  const viewed = useViewedNotifications();

  useEffect(() => {
    const onPopState = () => {
      setRoute(readRoute());
      void Log("frontend", "info", "page", "browser navigation changed route");
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const activePage = route.path === "/priority" ? "priority" : "all";

  const navigate = (path: string) => {
    const nextRoute = { path, query: route.query };
    pushRoute(nextRoute);
    setRoute(nextRoute);
  };

  const updateQuery = (query: NotificationQuery) => {
    const nextRoute = { ...route, query };
    pushRoute(nextRoute);
    setRoute(nextRoute);
    void Log("frontend", "info", "page", `query changed ${createQueryString(query)}`);
  };

  const page = useMemo(() => {
    if (activePage === "priority") {
      return (
        <PriorityNotificationsPage
          query={route.query}
          viewedIds={viewed.viewedIds}
          onQueryChange={updateQuery}
          onMarkViewed={viewed.markViewed}
        />
      );
    }

    return (
      <AllNotificationsPage
        query={route.query}
        viewedIds={viewed.viewedIds}
        onQueryChange={updateQuery}
        onMarkViewed={viewed.markViewed}
        onMarkManyViewed={viewed.markManyViewed}
      />
    );
  }, [activePage, route.query, viewed.markManyViewed, viewed.markViewed, viewed.viewedIds]);

  return (
    <AppShell activePage={activePage} onNavigate={navigate}>
      {page}
      <footer className="app-footer">
        <button className="text-button" onClick={viewed.resetViewed} type="button">
          Reset Viewed State
        </button>
      </footer>
    </AppShell>
  );
}

function readRoute(): RouteState {
  return {
    path: window.location.pathname === "/priority" ? "/priority" : "/",
    query: readNotificationQuery(window.location.search),
  };
}

function pushRoute(route: RouteState) {
  const queryString = createQueryString(route.query);
  const nextUrl = `${route.path}${queryString ? `?${queryString}` : ""}`;
  window.history.pushState(null, "", nextUrl);
}

