package com.example.stocks_demo.dto;

public class HoldingPerformanceResponse {

    private String symbol;
    private String assetType;
    private double quantity;
    private double averageBuyPrice;
    private double currentPrice;

    private double totalCost;
    private double currentValue;
    private double profit;
    private double profitPercent;

    private double dailyChange;
    private double dailyChangePercent;

    public HoldingPerformanceResponse(
            String symbol,
            String assetType,
            double quantity,
            double averageBuyPrice,
            double currentPrice,
            double previousClose
    ) {
        this.symbol = symbol;
        this.assetType = assetType;
        this.quantity = quantity;
        this.averageBuyPrice = averageBuyPrice;
        this.currentPrice = currentPrice;

        this.totalCost = quantity * averageBuyPrice;
        this.currentValue = quantity * currentPrice;
        this.profit = currentValue - totalCost;
        this.profitPercent = totalCost == 0 ? 0 : (profit / totalCost) * 100;

        this.dailyChange = (currentPrice - previousClose) * quantity;
        this.dailyChangePercent = previousClose == 0 ? 0 : ((currentPrice - previousClose) / previousClose) * 100;
    }

    public String getSymbol() { return symbol; }
    public String getAssetType() { return assetType; }
    public double getQuantity() { return quantity; }
    public double getAverageBuyPrice() { return averageBuyPrice; }
    public double getCurrentPrice() { return currentPrice; }
    public double getTotalCost() { return totalCost; }
    public double getCurrentValue() { return currentValue; }
    public double getProfit() { return profit; }
    public double getProfitPercent() { return profitPercent; }
    public double getDailyChange() { return dailyChange; }
    public double getDailyChangePercent() { return dailyChangePercent; }
}