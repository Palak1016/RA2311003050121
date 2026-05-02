type HeaderBarProps = {
  title: string;
  subtitle: string;
  total: number;
  newCount: number;
};

export function HeaderBar({ title, subtitle, total, newCount }: HeaderBarProps) {
  return (
    <header className="header-bar">
      <div>
        <p className="eyebrow">Campus Notifications</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="metric-row" aria-label="Notification metrics">
        <div className="metric">
          <span>{total}</span>
          <small>Total</small>
        </div>
        <div className="metric accent">
          <span>{newCount}</span>
          <small>New</small>
        </div>
      </div>
    </header>
  );
}

