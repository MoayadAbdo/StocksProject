import { useState } from "react";

const ASSET_TYPES = ["STOCK", "ETF"];

function defaultForm() {
  return {
    symbol: "",
    assetType: "STOCK",
    quantity: "",
    averageBuyPrice: ""
  };
}

export default function HoldingsManager({
  holdings,
  formatCurrency,
  formatQuantity,
  onAddHolding,
  onRemoveHolding,
  busy
}) {
  const [form, setForm] = useState(defaultForm);
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const quantityValue = form.quantity.trim();
    const averageBuyPriceValue = form.averageBuyPrice.trim();
    const quantityNumber = Number(quantityValue);
    const averageBuyPriceNumber = Number(averageBuyPriceValue);

    const payload = {
      symbol: form.symbol.trim().toUpperCase(),
      assetType: form.assetType,
      quantity: quantityValue,
      averageBuyPrice: averageBuyPriceValue
    };

    if (
      !payload.symbol ||
      !Number.isFinite(quantityNumber) ||
      !Number.isFinite(averageBuyPriceNumber) ||
      quantityNumber <= 0 ||
      averageBuyPriceNumber < 0
    ) {
      setErrorMessage("Please provide valid symbol, quantity, and average buy price.");
      return;
    }

    try {
      await onAddHolding(payload);
      setForm(defaultForm());
    } catch (error) {
      const details = error?.response?.data?.details;
      if (Array.isArray(details) && details.length > 0) {
        setErrorMessage(details[0]);
      } else {
        setErrorMessage("Failed to add holding.");
      }
    }
  };

  return (
    <section className="grid gap-4 xl:grid-cols-[1.05fr_1.35fr]">
      <article className="surface-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Add Holding</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Create a stock or ETF position.</p>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">Symbol</span>
            <input
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent-500 dark:border-zinc-800 dark:bg-zinc-900"
              placeholder="AAPL"
              value={form.symbol}
              onChange={(event) => setForm((prev) => ({ ...prev, symbol: event.target.value }))}
              maxLength={10}
              autoComplete="off"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">Asset Type</span>
            <select
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent-500 dark:border-zinc-800 dark:bg-zinc-900"
              value={form.assetType}
              onChange={(event) => setForm((prev) => ({ ...prev, assetType: event.target.value }))}
            >
              {ASSET_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">Quantity</span>
              <input
                type="number"
                min="0"
                step="any"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent-500 dark:border-zinc-800 dark:bg-zinc-900"
                placeholder="10"
                value={form.quantity}
                onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">Avg Buy Price</span>
              <input
                type="number"
                min="0"
                step="any"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent-500 dark:border-zinc-800 dark:bg-zinc-900"
                placeholder="189.25"
                value={form.averageBuyPrice}
                onChange={(event) => setForm((prev) => ({ ...prev, averageBuyPrice: event.target.value }))}
              />
            </label>
          </div>

          {errorMessage ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-700/50 dark:bg-rose-900/20 dark:text-rose-300">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {busy ? "Saving..." : "Add Holding"}
          </button>
        </form>
      </article>

      <article className="surface-card overflow-hidden">
        <div className="border-b border-zinc-200/70 px-6 py-5 dark:border-zinc-800">
          <h2 className="text-lg font-semibold">Holdings Table</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Manage current positions.</p>
        </div>

        {!holdings.length ? (
          <div className="p-6 text-sm text-zinc-500 dark:text-zinc-400">No holdings yet. Add your first position.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[780px] text-sm">
              <thead className="bg-zinc-50/90 text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Symbol</th>
                  <th className="px-3 py-3 text-left font-medium">Asset</th>
                  <th className="px-3 py-3 text-right font-medium">Quantity</th>
                  <th className="px-3 py-3 text-right font-medium">Avg Buy Price</th>
                  <th className="px-6 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => (
                  <tr
                    key={holding.id}
                    className="border-t border-zinc-100 transition-colors hover:bg-zinc-50/70 dark:border-zinc-800 dark:hover:bg-zinc-900/45"
                  >
                    <td className="px-6 py-4 font-semibold">{holding.symbol}</td>
                    <td className="px-3 py-4 text-zinc-500 dark:text-zinc-400">{holding.assetType}</td>
                    <td className="px-3 py-4 text-right">{formatQuantity(holding.quantity)}</td>
                    <td className="px-3 py-4 text-right">{formatCurrency(holding.averageBuyPrice)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onRemoveHolding(holding.id)}
                        disabled={busy}
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-700/60 dark:text-rose-300 dark:hover:bg-rose-900/20"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
