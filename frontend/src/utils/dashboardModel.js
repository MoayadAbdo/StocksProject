function isValidNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric);
}

function pickNumber(value, fallback = 0) {
  return isValidNumber(value) ? Number(value) : fallback;
}

function sumBy(list, key) {
  return list.reduce((total, item) => total + pickNumber(item?.[key]), 0);
}

const ETF_COMPONENT_WEIGHTS = {
  VOO: {
    AAPL: 7.0,
    MSFT: 6.5,
    NVDA: 5.0,
    AMZN: 3.5,
    GOOGL: 2.5,
    META: 2.2
  },
  SPY: {
    AAPL: 7.0,
    MSFT: 6.5,
    NVDA: 5.0,
    AMZN: 3.5,
    GOOGL: 2.5,
    META: 2.2
  },
  VGT: {
    AAPL: 22.0,
    MSFT: 20.0,
    NVDA: 6.5,
    AVGO: 5.0,
    AMD: 3.0
  },
  QQQ: {
    AAPL: 8.5,
    MSFT: 8.0,
    NVDA: 7.0,
    GOOGL: 4.0,
    META: 3.0
  }
};

function buildDerivedExposureBySymbol(holdings = []) {
  const totalPortfolioValue = sumBy(holdings, "currentValue");
  const bySymbol = new Map();

  const addComponent = (symbol, component, value) => {
    if (!symbol || value <= 0) return;
    const key = String(symbol).toUpperCase();
    const existing = bySymbol.get(key) ?? { stockValue: 0, etfValue: 0 };
    if (component === "stock") existing.stockValue += value;
    if (component === "etf") existing.etfValue += value;
    bySymbol.set(key, existing);
  };

  holdings.forEach((holding) => {
    const symbol = String(holding.symbol ?? "").toUpperCase();
    const assetType = String(holding.assetType ?? "").toUpperCase();
    const holdingValue = pickNumber(holding.currentValue);

    if (!symbol || holdingValue <= 0) return;

    if (assetType === "STOCK") {
      addComponent(symbol, "stock", holdingValue);
      return;
    }

    if (assetType === "ETF") {
      const weights = ETF_COMPONENT_WEIGHTS[symbol];
      if (!weights) return;

      Object.entries(weights).forEach(([companySymbol, weightPercent]) => {
        const percent = pickNumber(weightPercent);
        if (percent <= 0) return;
        addComponent(companySymbol, "etf", holdingValue * (percent / 100));
      });
    }
  });

  bySymbol.forEach((value, symbol) => {
    const totalValue = value.stockValue + value.etfValue;
    const stockPercentageOfPortfolio = totalPortfolioValue > 0 ? (value.stockValue / totalPortfolioValue) * 100 : 0;
    const etfPercentageOfPortfolio = totalPortfolioValue > 0 ? (value.etfValue / totalPortfolioValue) * 100 : 0;
    bySymbol.set(symbol, {
      ...value,
      totalValue,
      percentageOfPortfolio: stockPercentageOfPortfolio + etfPercentageOfPortfolio,
      stockPercentageOfPortfolio,
      etfPercentageOfPortfolio
    });
  });

  return bySymbol;
}

function normalizeHoldings(holdings = []) {
  return holdings.map((holding) => {
    const quantity = pickNumber(holding.quantity);
    const averageBuyPrice = pickNumber(holding.averageBuyPrice);
    const currentPrice = pickNumber(holding.currentPrice);

    const computedCost = quantity * averageBuyPrice;
    const computedValue = quantity * currentPrice;

    const totalCost = pickNumber(holding.totalCost, computedCost);
    const currentValue = pickNumber(holding.currentValue, computedValue);
    const profit = pickNumber(holding.profit, currentValue - totalCost);
    const profitPercent = pickNumber(
      holding.profitPercent,
      totalCost === 0 ? 0 : (profit / totalCost) * 100
    );

    return {
      symbol: String(holding.symbol ?? "").toUpperCase(),
      assetType: String(holding.assetType ?? "UNKNOWN").toUpperCase(),
      quantity,
      averageBuyPrice,
      currentPrice,
      totalCost,
      currentValue,
      profit,
      profitPercent,
      dailyChange: pickNumber(holding.dailyChange),
      dailyChangePercent: pickNumber(holding.dailyChangePercent)
    };
  });
}

function normalizeExposure(exposure = [], holdings = []) {
  const derivedExposureBySymbol = buildDerivedExposureBySymbol(holdings);
  const normalizedRaw = exposure.map((item) => ({
    symbol: String(item.symbol ?? "").toUpperCase(),
    raw: item
  }));

  const rawBySymbol = new Map(normalizedRaw.map((item) => [item.symbol, item.raw]));
  for (const symbol of derivedExposureBySymbol.keys()) {
    if (!rawBySymbol.has(symbol)) {
      rawBySymbol.set(symbol, { symbol });
    }
  }

  return [...rawBySymbol.entries()]
    .map(([symbol, raw]) => {
      const derived = derivedExposureBySymbol.get(symbol);
      const hasStockValue = isValidNumber(raw.stockValue);
      const hasEtfValue = isValidNumber(raw.etfValue);
      const hasStockPercent = isValidNumber(raw.stockPercentageOfPortfolio);
      const hasEtfPercent = isValidNumber(raw.etfPercentageOfPortfolio);
      const hasTotalValue = isValidNumber(raw.value);
      const hasTotalPercent = isValidNumber(raw.percentageOfPortfolio);

      let stockValue = hasStockValue ? pickNumber(raw.stockValue) : pickNumber(derived?.stockValue);
      let etfValue = hasEtfValue ? pickNumber(raw.etfValue) : pickNumber(derived?.etfValue);

      let value = hasTotalValue ? pickNumber(raw.value) : pickNumber(derived?.totalValue, stockValue + etfValue);

      if (!hasStockValue && !hasEtfValue && derived) {
        stockValue = pickNumber(derived.stockValue);
        etfValue = pickNumber(derived.etfValue);
      } else {
        if (!hasStockValue && hasEtfValue) stockValue = Math.max(value - etfValue, 0);
        if (hasStockValue && !hasEtfValue) etfValue = Math.max(value - stockValue, 0);
      }

      if (derived) {
        const derivedStockValue = pickNumber(derived.stockValue);
        const derivedEtfValue = pickNumber(derived.etfValue);

        if (stockValue <= 0 && derivedStockValue > 0) stockValue = derivedStockValue;
        if (etfValue <= 0 && derivedEtfValue > 0) etfValue = derivedEtfValue;
      }

      if (!hasTotalValue) {
        value = stockValue + etfValue;
      }
      value = Math.max(value, stockValue + etfValue);

      let percentageOfPortfolio = hasTotalPercent
        ? pickNumber(raw.percentageOfPortfolio)
        : pickNumber(derived?.percentageOfPortfolio);

      let stockPercentageOfPortfolio = hasStockPercent
        ? pickNumber(raw.stockPercentageOfPortfolio)
        : pickNumber(derived?.stockPercentageOfPortfolio);
      let etfPercentageOfPortfolio = hasEtfPercent
        ? pickNumber(raw.etfPercentageOfPortfolio)
        : pickNumber(derived?.etfPercentageOfPortfolio);

      if (derived) {
        const derivedStockPercent = pickNumber(derived.stockPercentageOfPortfolio);
        const derivedEtfPercent = pickNumber(derived.etfPercentageOfPortfolio);

        if (stockPercentageOfPortfolio <= 0 && derivedStockPercent > 0) {
          stockPercentageOfPortfolio = derivedStockPercent;
        }
        if (etfPercentageOfPortfolio <= 0 && derivedEtfPercent > 0) {
          etfPercentageOfPortfolio = derivedEtfPercent;
        }
      }

      if (!hasStockPercent && !hasEtfPercent) {
        const totalComponentValue = stockValue + etfValue;
        if (totalComponentValue > 0 && isValidNumber(percentageOfPortfolio)) {
          stockPercentageOfPortfolio = percentageOfPortfolio * (stockValue / totalComponentValue);
          etfPercentageOfPortfolio = percentageOfPortfolio * (etfValue / totalComponentValue);
        } else {
          stockPercentageOfPortfolio = pickNumber(derived?.stockPercentageOfPortfolio);
          etfPercentageOfPortfolio = pickNumber(derived?.etfPercentageOfPortfolio);
          percentageOfPortfolio = stockPercentageOfPortfolio + etfPercentageOfPortfolio;
        }
      } else {
        if (!hasStockPercent && hasEtfPercent) {
          stockPercentageOfPortfolio = Math.max(percentageOfPortfolio - etfPercentageOfPortfolio, 0);
        }
        if (hasStockPercent && !hasEtfPercent) {
          etfPercentageOfPortfolio = Math.max(percentageOfPortfolio - stockPercentageOfPortfolio, 0);
        }
      }

      percentageOfPortfolio = Math.max(
        percentageOfPortfolio,
        stockPercentageOfPortfolio + etfPercentageOfPortfolio
      );

      return {
        symbol,
        value,
        percentageOfPortfolio,
        stockValue,
        etfValue,
        stockPercentageOfPortfolio,
        etfPercentageOfPortfolio
      };
    })
    .sort((a, b) => b.value - a.value);
}

export function buildDashboardModel(payload) {
  const holdings = normalizeHoldings(payload?.holdings ?? []);
  const exposure = normalizeExposure(payload?.exposure ?? [], holdings);
  const summaryInput = payload?.summary ?? {};

  const totalValueFromHoldings = sumBy(holdings, "currentValue");
  const totalCostFromHoldings = sumBy(holdings, "totalCost");

  const totalValue = pickNumber(summaryInput.totalValue, totalValueFromHoldings);
  const totalCost = pickNumber(summaryInput.totalCost, totalCostFromHoldings);

  const profit = pickNumber(summaryInput.profit, totalValue - totalCost);
  const profitPercent = pickNumber(
    summaryInput.profitPercent,
    totalCost === 0 ? 0 : (profit / totalCost) * 100
  );

  const dailyChange = sumBy(holdings, "dailyChange");
  const priorValue = totalValue - dailyChange;
  const dailyChangePercent = priorValue === 0 ? 0 : (dailyChange / priorValue) * 100;

  const gainers = [...holdings].sort((a, b) => b.profitPercent - a.profitPercent).slice(0, 3);
  const losers = [...holdings].sort((a, b) => a.profitPercent - b.profitPercent).slice(0, 3);

  return {
    summary: {
      totalValue,
      totalCost,
      profit,
      profitPercent,
      dailyChange,
      dailyChangePercent
    },
    holdings,
    gainers,
    losers,
    exposure,
    updatedAt: new Date().toISOString()
  };
}
