import type { ReactNode } from "react";
import { Log } from "../middleware/loggerConfig";

type AppShellProps = {
  activePage: "all" | "priority";
  children: ReactNode;
  onNavigate: (path: string) => void;
};

export function AppShell({ activePage, children, onNavigate }: AppShellProps) {
  const navigate = (path: string) => {
    void Log("frontend", "info", "component", `navigate to ${path}`);
    onNavigate(path);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">
          <span className="brand-icon">CN</span>
          <div>
            <strong>Campus Noticeboard</strong>
            <small>Priority notification workspace</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          <button
            className={activePage === "all" ? "nav-item active" : "nav-item"}
            onClick={() => navigate("/")}
            type="button"
          >
            All Notifications
          </button>
          <button
            className={activePage === "priority" ? "nav-item active" : "nav-item"}
            onClick={() => navigate("/priority")}
            type="button"
          >
            Priority Inbox
          </button>
        </nav>
      </aside>

      <main className="main-panel">{children}</main>
    </div>
  );
}

