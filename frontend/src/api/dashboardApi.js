import api from "./httpClient";

export async function fetchDashboardPayload() {
  const [summaryRes, holdingsRes, exposureRes] = await Promise.all([
    api.get("api/portfolio/summary"),
    api.get("api/holdings/performance"),
    api.get("api/portfolio/exposure")
  ]);

  return {
    summary: summaryRes.data,
    holdings: holdingsRes.data,
    exposure: exposureRes.data
  };
}

export function getDemoPayload() {
  return {
    summary: {
      totalValue: 294210.37,
      totalCost: 256300.2,
      profit: 37910.17,
      profitPercent: 14.79
    },
    holdings: [
      {
        symbol: "AAPL",
        assetType: "STOCK",
        quantity: 90,
        averageBuyPrice: 167.2,
        currentPrice: 194.52,
        totalCost: 15048.0,
        currentValue: 17506.8,
        profit: 2458.8,
        profitPercent: 16.34,
        dailyChange: 210.6,
        dailyChangePercent: 1.22
      },
      {
        symbol: "MSFT",
        assetType: "STOCK",
        quantity: 60,
        averageBuyPrice: 320.5,
        currentPrice: 411.78,
        totalCost: 19230.0,
        currentValue: 24706.8,
        profit: 5476.8,
        profitPercent: 28.48,
        dailyChange: 185.4,
        dailyChangePercent: 0.76
      },
      {
        symbol: "NVDA",
        assetType: "STOCK",
        quantity: 95,
        averageBuyPrice: 98.45,
        currentPrice: 118.33,
        totalCost: 9352.75,
        currentValue: 11241.35,
        profit: 1888.6,
        profitPercent: 20.19,
        dailyChange: -74.1,
        dailyChangePercent: -0.65
      },
      {
        symbol: "GOOGL",
        assetType: "STOCK",
        quantity: 50,
        averageBuyPrice: 142.4,
        currentPrice: 169.15,
        totalCost: 7120.0,
        currentValue: 8457.5,
        profit: 1337.5,
        profitPercent: 18.79,
        dailyChange: 94.5,
        dailyChangePercent: 1.13
      },
      {
        symbol: "VOO",
        assetType: "ETF",
        quantity: 180,
        averageBuyPrice: 405.1,
        currentPrice: 471.24,
        totalCost: 72918.0,
        currentValue: 84823.2,
        profit: 11905.2,
        profitPercent: 16.33,
        dailyChange: 412.2,
        dailyChangePercent: 0.49
      },
      {
        symbol: "VGT",
        assetType: "ETF",
        quantity: 130,
        averageBuyPrice: 430.2,
        currentPrice: 493.71,
        totalCost: 55926.0,
        currentValue: 64182.3,
        profit: 8256.3,
        profitPercent: 14.76,
        dailyChange: 328.9,
        dailyChangePercent: 0.52
      },
      {
        symbol: "QQQ",
        assetType: "ETF",
        quantity: 105,
        averageBuyPrice: 351.8,
        currentPrice: 360.88,
        totalCost: 36939.0,
        currentValue: 37892.4,
        profit: 953.4,
        profitPercent: 2.58,
        dailyChange: -157.5,
        dailyChangePercent: -0.41
      }
    ],
    exposure: [
      {
        symbol: "AAPL",
        value: 36510.78,
        percentageOfPortfolio: 12.41,
        stockValue: 14800.78,
        etfValue: 21710.0,
        stockPercentageOfPortfolio: 5.03,
        etfPercentageOfPortfolio: 7.38
      },
      {
        symbol: "MSFT",
        value: 34761.24,
        percentageOfPortfolio: 11.82,
        stockValue: 11000.0,
        etfValue: 23761.24,
        stockPercentageOfPortfolio: 3.74,
        etfPercentageOfPortfolio: 8.08
      },
      {
        symbol: "NVDA",
        value: 25288.15,
        percentageOfPortfolio: 8.60,
        stockValue: 9000.0,
        etfValue: 16288.15,
        stockPercentageOfPortfolio: 3.06,
        etfPercentageOfPortfolio: 5.54
      },
      {
        symbol: "AMZN",
        value: 14308.22,
        percentageOfPortfolio: 4.86,
        stockValue: 4000.0,
        etfValue: 10308.22,
        stockPercentageOfPortfolio: 1.36,
        etfPercentageOfPortfolio: 3.5
      },
      {
        symbol: "GOOGL",
        value: 12843.14,
        percentageOfPortfolio: 4.37,
        stockValue: 3000.0,
        etfValue: 9843.14,
        stockPercentageOfPortfolio: 1.02,
        etfPercentageOfPortfolio: 3.35
      },
      {
        symbol: "AVGO",
        value: 8224.42,
        percentageOfPortfolio: 2.79,
        stockValue: 1500.0,
        etfValue: 6724.42,
        stockPercentageOfPortfolio: 0.51,
        etfPercentageOfPortfolio: 2.28
      },
      {
        symbol: "AMD",
        value: 5347.09,
        percentageOfPortfolio: 1.82,
        stockValue: 1000.0,
        etfValue: 4347.09,
        stockPercentageOfPortfolio: 0.34,
        etfPercentageOfPortfolio: 1.48
      }
    ]
  };
}

export async function fetchHoldingsList() {
  const response = await api.get("api/holdings");
  return response.data;
}

export async function createHolding(payload) {
  const response = await api.post("api/holdings", payload);
  return response.data;
}

export async function removeHoldingById(id) {
  await api.delete(`api/holdings/${id}`);
}
