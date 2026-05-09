export default function ExposurePanel({ exposure, formatCurrency, formatPercent }) {
  const topExposure = exposure.slice(0, 8);

  return (
    <section className="surface-card p-5 sm:p-6">
      <h2 className="text-lg font-semibold">ETF & Company Exposure</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Combined direct holdings and weighted ETF ownership.
      </p>
      <div className="mt-3 flex items-center gap-4 text-xs">
        <div className="inline-flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-accent-500" />
          Stock
        </div>
        <div className="inline-flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-cyan-500" />
          ETF
        </div>
      </div>

      {!topExposure.length ? (
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          Exposure insights will appear once holdings are available.
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {topExposure.map((item) => {
            const totalPercentage = Math.max(0, Math.min(item.percentageOfPortfolio, 100));
            const stockPercentage = Math.max(0, item.stockPercentageOfPortfolio);
            const etfPercentage = Math.max(0, item.etfPercentageOfPortfolio);
            const componentTotal = stockPercentage + etfPercentage;
            const stockRatio = componentTotal === 0 ? 0 : stockPercentage / componentTotal;
            const etfRatio = componentTotal === 0 ? 0 : etfPercentage / componentTotal;

            return (
              <li key={item.symbol}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.symbol}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {formatCurrency(item.value)} | Stock {formatPercent(stockPercentage)} | ETF{" "}
                      {formatPercent(etfPercentage)}
                    </p>
                  </div>
                  <p className="text-base font-semibold">{formatPercent(totalPercentage)}</p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className="flex h-full overflow-hidden rounded-full" style={{ width: `${totalPercentage}%` }}>
                    <div
                      className="h-full bg-accent-500/90"
                      style={{ width: `${stockRatio * 100}%` }}
                    />
                    <div
                      className="h-full bg-cyan-500/90"
                      style={{ width: `${etfRatio * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
