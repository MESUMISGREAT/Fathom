export default function Loading() {
  return (
    <div className="container stack" aria-busy="true" aria-label="Loading">
      <div className="skeleton" style={{ height: 36, width: '40%' }} />
      <div className="skeleton" style={{ height: 18, width: '65%' }} />
      <div className="skeleton" style={{ height: 160, marginTop: 12 }} />
      <div className="skeleton" style={{ height: 120 }} />
    </div>
  );
}
