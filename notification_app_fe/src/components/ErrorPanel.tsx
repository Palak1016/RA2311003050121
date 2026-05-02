type ErrorPanelProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorPanel({ message, onRetry }: ErrorPanelProps) {
  return (
    <section className="error-panel" role="alert">
      <div>
        <strong>Request failed</strong>
        <p>{message}</p>
      </div>
      <button className="secondary-button" onClick={onRetry} type="button">
        Retry
      </button>
    </section>
  );
}

