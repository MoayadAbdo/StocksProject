function trendClass(value) {
  if (value > 0) return "text-emerald-600 dark:text-emerald-400";
  if (value < 0) return "text-rose-600 dark:text-rose-400";
  return "text-zinc-500 dark:text-zinc-400";
}

function ListPanel({ title, subtitle, entries, formatCurrency, formatPercent, emptyText }) {
  return (
    <article className="surface-card p-5 sm:p-6">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>

      {!entries.length ? (
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">{emptyText}</p>
      ) : (
        <ul className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
          {entries.map((item) => (
            <li key={item.symbol} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold">{item.symbol}</p>
                <p className={`text-sm ${trendClass(item.profitPercent)}`}>{formatPercent(item.profitPercent, true)}</p>
              </div>

              <div className="text-right">
                <p className={`text-sm font-medium ${trendClass(item.profit)}`}>
                  {formatCurrency(item.profit, true)}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{formatCurrency(item.currentValue)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function GainersLosersPanel({ gainers, losers, formatCurrency, formatPercent }) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <ListPanel
        title="Top Gainers"
        subtitle="Best-performing holdings by total return."
        entries={gainers}
        formatCurrency={formatCurrency}
        formatPercent={formatPercent}
        emptyText="No gainers available."
      />
      <ListPanel
        title="Top Losers"
        subtitle="Holdings currently underperforming."
        entries={losers}
        formatCurrency={formatCurrency}
        formatPercent={formatPercent}
        emptyText="No losers available."
      />
    </section>
  );
}
