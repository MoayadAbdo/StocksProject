import { Link, Navigate, useLocation } from "react-router-dom";

const watchlist = [
  { ticker: "AAPL", company: "Apple Inc.", change: "+1.42%" },
  { ticker: "MSFT", company: "Microsoft", change: "+0.84%" },
  { ticker: "NVDA", company: "NVIDIA", change: "+2.17%" }
];

const activity = [
  { title: "Portfolio synced", detail: "Market data refreshed successfully.", time: "2 min ago" },
  { title: "Alert triggered", detail: "AAPL crossed your target threshold.", time: "11 min ago" },
  { title: "Watchlist updated", detail: "NVDA added to your active list.", time: "28 min ago" }
];

export default function DashboardPage() {
  const location = useLocation();
  const authenticated = sessionStorage.getItem("stocks.authenticated") === "true";
  const storedUsername = sessionStorage.getItem("stocks.username");
  const username = location.state?.username || storedUsername || "Investor";

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  function handleSignOut() {
    sessionStorage.removeItem("stocks.authenticated");
    sessionStorage.removeItem("stocks.username");
  }

  return (
    <main className="page-shell dashboard-shell">
      <section className="dashboard-panel">
        <header className="dashboard-topbar">
          <div className="brand-block">
            <p className="eyebrow">Client Dashboard</p>
            <h1>Welcome, {username}</h1>
            <p className="subtle-text">
              Your account is ready. This page is the frontend redirect target after login.
            </p>
          </div>

          <Link className="outline-button" to="/" onClick={handleSignOut}>
            Sign Out
          </Link>
        </header>

        <div className="dashboard-grid">
          <section className="dashboard-card">
            <div className="card-title-row">
              <div>
                <p className="card-kicker">Portfolio Snapshot</p>
                <h2>Overview</h2>
              </div>
              <p className="subtle-text">Updated moments ago</p>
            </div>

            <div className="performance-banner">
              <strong className="performance-value">$128,430</strong>
              <span className="performance-note">Total assets under review</span>
            </div>

            <div className="metric-grid">
              <article className="metric-tile">
                <span className="metric-label">Daily Return</span>
                <strong className="metric-value positive">+$1,284</strong>
              </article>
              <article className="metric-tile">
                <span className="metric-label">Active Holdings</span>
                <strong className="metric-value">18</strong>
              </article>
              <article className="metric-tile">
                <span className="metric-label">Cash Balance</span>
                <strong className="metric-value">$14,220</strong>
              </article>
            </div>
          </section>

          <aside className="dashboard-side">
            <section className="watchlist-card">
              <p className="card-kicker">Focus List</p>
              <h2>Watchlist</h2>
              <ul className="watchlist">
                {watchlist.map((item) => (
                  <li key={item.ticker}>
                    <div className="ticker-block">
                      <strong>{item.ticker}</strong>
                      <span>{item.company}</span>
                    </div>
                    <span className="ticker-change positive">{item.change}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="activity-card">
              <p className="card-kicker">Recent Activity</p>
              <h2>Updates</h2>
              <div className="activity-list">
                {activity.map((item) => (
                  <article className="activity-item" key={item.title}>
                    <div className="activity-copy">
                      <strong>{item.title}</strong>
                      <span>{item.detail}</span>
                    </div>
                    <span className="activity-time">{item.time}</span>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
