export function LoadingList() {
  return (
    <div className="notification-list" aria-label="Loading notifications">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="notification-card loading-card" key={index}>
          <span />
          <strong />
          <p />
          <p />
        </div>
      ))}
    </div>
  );
}

