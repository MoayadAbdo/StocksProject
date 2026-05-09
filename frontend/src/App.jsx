import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import HoldingsTable from "./components/HoldingsTable";
import GainersLosersPanel from "./components/GainersLosersPanel";
import ExposurePanel from "./components/ExposurePanel";
import ThemeToggle from "./components/ThemeToggle";
import HoldingsManager from "./components/HoldingsManager";
import {
  fetchDashboardPayload,
  fetchHoldingsList,
  createHolding,
  removeHoldingById,
  getDemoPayload
} from "./api/dashboardApi";
import { buildDashboardModel } from "./utils/dashboardModel";

function trendTextClass(value) {
  if (value > 0) return "text-emerald-600 dark:text-emerald-400";
  if (value < 0) return "text-rose-600 dark:text-rose-400";
  return "text-zinc-500 dark:text-zinc-400";
}

export default function App({ onLogout, onUnauthorized }) {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("portfolio-theme");
    if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isDemoData, setIsDemoData] = useState(false);
  const [holdingsList, setHoldingsList] = useState([]);
  const [isMutatingHolding, setIsMutatingHolding] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const loadDashboard = async () => {
    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const [payload, holdings] = await Promise.all([fetchDashboardPayload(), fetchHoldingsList()]);
      setDashboard(buildDashboardModel(payload));
      setIsDemoData(false);
      setHoldingsList(Array.isArray(holdings) ? holdings : []);
      if (!Array.isArray(payload.holdings) || payload.holdings.length === 0) {
        setInfoMessage("Connected to backend. No holdings found yet.");
      }
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        onUnauthorized?.();
        return;
      }

      setDashboard(buildDashboardModel(getDemoPayload()));
      setIsDemoData(true);
      setHoldingsList([]);
      setErrorMessage("Live data is unavailable. Showing premium demo data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2
      }),
    []
  );

  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
    []
  );

  const quantityFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 10
      }),
    []
  );

  const formatCurrency = (value, signed = false) => {
    const numeric = Number(value) || 0;
    const formatted = currencyFormatter.format(Math.abs(numeric));
    if (!signed) return numeric < 0 ? `-${formatted}` : formatted;
    if (numeric > 0) return `+${formatted}`;
    if (numeric < 0) return `-${formatted}`;
    return formatted;
  };

  const formatPercent = (value, signed = false) => {
    const numeric = Number(value) || 0;
    const formatted = `${percentFormatter.format(Math.abs(numeric))}%`;
    if (!signed) return numeric < 0 ? `-${formatted}` : formatted;
    if (numeric > 0) return `+${formatted}`;
    if (numeric < 0) return `-${formatted}`;
    return formatted;
  };

  const formatQuantity = (value) => quantityFormatter.format(Number(value) || 0);

  const handleAddHolding = async (payload) => {
    setIsMutatingHolding(true);
    setErrorMessage("");
    setInfoMessage("");
    try {
      await createHolding(payload);
      await loadDashboard();
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        onUnauthorized?.();
        return;
      }
      throw error;
    } finally {
      setIsMutatingHolding(false);
    }
  };

  const handleRemoveHolding = async (id) => {
    setIsMutatingHolding(true);
    setErrorMessage("");
    setInfoMessage("");
    try {
      await removeHoldingById(id);
      await loadDashboard();
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        onUnauthorized?.();
      } else {
        setErrorMessage("Failed to remove holding. Please try again.");
      }
    } finally {
      setIsMutatingHolding(false);
    }
  };

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium"
      }).format(new Date()),
    []
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-accent-600 dark:text-accent-100">Portfolio Intelligence</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Investment Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{today}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadDashboard}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M20 11C20 6.58172 16.4183 3 12 3C8.87685 3 6.17144 4.79265 4.86527 7.4M4.86527 7.4H8M4.86527 7.4V4M4 13C4 17.4183 7.58172 21 12 21C15.1231 21 17.8286 19.2074 19.1347 16.6M19.1347 16.6H16M19.1347 16.6V20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Refresh
            </button>
            {onLogout ? (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M15 17L20 12L15 7M20 12H9M12 19H8C6.34315 19 5 17.6569 5 16V8C5 6.34315 6.34315 5 8 5H12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Logout
              </button>
            ) : null}
            <ThemeToggle theme={theme} onToggle={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))} />
          </div>
        </header>

        {errorMessage ? (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800/80 dark:bg-amber-500/10 dark:text-amber-200">
            {errorMessage}
          </div>
        ) : null}

        {infoMessage ? (
          <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300">
            {infoMessage}
          </div>
        ) : null}

        {isDemoData ? (
          <div className="mb-6 inline-flex rounded-full border border-accent-100 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-600 dark:border-accent-500/30 dark:bg-accent-500/10 dark:text-accent-100">
            Demo Data Mode
          </div>
        ) : null}

        {loading || !dashboard ? (
          <section className="space-y-4">
            <div className="surface-card h-44 animate-pulse bg-zinc-100 dark:bg-zinc-900" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="surface-card h-28 animate-pulse bg-zinc-100 dark:bg-zinc-900" />
              ))}
            </div>
            <div className="surface-card h-80 animate-pulse bg-zinc-100 dark:bg-zinc-900" />
          </section>
        ) : (
          <div className="space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="surface-card p-6 sm:p-8"
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Portfolio Value</p>
                  <h2 className="mt-2 text-4xl font-semibold sm:text-5xl">
                    {formatCurrency(dashboard.summary.totalValue)}
                  </h2>
                  <p className={`mt-3 text-base font-medium ${trendTextClass(dashboard.summary.dailyChange)}`}>
                    {formatCurrency(dashboard.summary.dailyChange, true)} today (
                    {formatPercent(dashboard.summary.dailyChangePercent, true)})
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Profit / Loss</p>
                  <p className={`mt-2 text-3xl font-semibold ${trendTextClass(dashboard.summary.profit)}`}>
                    {formatCurrency(dashboard.summary.profit, true)}
                  </p>
                  <p className={`mt-1 text-sm font-medium ${trendTextClass(dashboard.summary.profitPercent)}`}>
                    {formatPercent(dashboard.summary.profitPercent, true)} overall return
                  </p>
                </div>
              </div>
            </motion.section>

            <HoldingsManager
              holdings={holdingsList}
              formatCurrency={formatCurrency}
              formatQuantity={formatQuantity}
              onAddHolding={handleAddHolding}
              onRemoveHolding={handleRemoveHolding}
              busy={isMutatingHolding}
            />

            <HoldingsTable
              holdings={dashboard.holdings}
              formatCurrency={formatCurrency}
              formatPercent={formatPercent}
              formatQuantity={formatQuantity}
            />

            <GainersLosersPanel
              gainers={dashboard.gainers}
              losers={dashboard.losers}
              formatCurrency={formatCurrency}
              formatPercent={formatPercent}
            />

            <ExposurePanel
              exposure={dashboard.exposure}
              formatCurrency={formatCurrency}
              formatPercent={formatPercent}
            />
          </div>
        )}
      </main>
    </div>
  );
}
