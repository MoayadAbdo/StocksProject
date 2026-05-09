function trendClass(value) {
  if (value > 0) return "text-emerald-600 dark:text-emerald-400";
  if (value < 0) return "text-rose-600 dark:text-rose-400";
  return "text-zinc-500 dark:text-zinc-400";
}

export default function HoldingsTable({ holdings, formatCurrency, formatPercent, formatQuantity }) {
  if (!holdings.length) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No holdings yet.</p>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-zinc-200/70 px-6 py-5 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Holdings Performance</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Real-time position performance across stocks and ETFs.
        </p>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-[1180px] text-sm">
          <thead className="bg-zinc-50/90 text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Symbol</th>
              <th className="px-3 py-3 text-left font-medium">Asset</th>
              <th className="px-3 py-3 text-right font-medium">Qty</th>
              <th className="px-3 py-3 text-right font-medium">Avg Buy</th>
              <th className="px-3 py-3 text-right font-medium">Current</th>
              <th className="px-3 py-3 text-right font-medium">Current Value</th>
              <th className="px-3 py-3 text-right font-medium">Total P/L</th>
              <th className="px-3 py-3 text-right font-medium">P/L %</th>
              <th className="px-3 py-3 text-right font-medium">Daily Change</th>
              <th className="px-6 py-3 text-right font-medium">Daily %</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => (
              <tr
                key={holding.symbol}
                className="border-t border-zinc-100 transition-colors hover:bg-zinc-50/70 dark:border-zinc-800 dark:hover:bg-zinc-900/45"
              >
                <td className="px-6 py-4 font-semibold">{holding.symbol}</td>
                <td className="px-3 py-4 text-zinc-500 dark:text-zinc-400">{holding.assetType}</td>
                <td className="px-3 py-4 text-right">{formatQuantity(holding.quantity)}</td>
                <td className="px-3 py-4 text-right">{formatCurrency(holding.averageBuyPrice)}</td>
                <td className="px-3 py-4 text-right">{formatCurrency(holding.currentPrice)}</td>
                <td className="px-3 py-4 text-right font-medium">{formatCurrency(holding.currentValue)}</td>
                <td className={`px-3 py-4 text-right font-medium ${trendClass(holding.profit)}`}>
                  {formatCurrency(holding.profit, true)}
                </td>
                <td className={`px-3 py-4 text-right font-medium ${trendClass(holding.profitPercent)}`}>
                  {formatPercent(holding.profitPercent, true)}
                </td>
                <td className={`px-3 py-4 text-right font-medium ${trendClass(holding.dailyChange)}`}>
                  {formatCurrency(holding.dailyChange, true)}
                </td>
                <td className={`px-6 py-4 text-right font-medium ${trendClass(holding.dailyChangePercent)}`}>
                  {formatPercent(holding.dailyChangePercent, true)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {holdings.map((holding) => (
          <article key={holding.symbol} className="rounded-xl border border-zinc-200/80 p-4 dark:border-zinc-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-semibold">{holding.symbol}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{holding.assetType}</p>
              </div>
              <p className="text-sm font-medium">{formatQuantity(holding.quantity)} shares</p>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Avg Buy</dt>
                <dd>{formatCurrency(holding.averageBuyPrice)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Current</dt>
                <dd>{formatCurrency(holding.currentPrice)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Current Value</dt>
                <dd>{formatCurrency(holding.currentValue)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Total P/L</dt>
                <dd className={trendClass(holding.profit)}>{formatCurrency(holding.profit, true)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">P/L %</dt>
                <dd className={trendClass(holding.profitPercent)}>{formatPercent(holding.profitPercent, true)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Daily Change</dt>
                <dd className={trendClass(holding.dailyChange)}>{formatCurrency(holding.dailyChange, true)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
