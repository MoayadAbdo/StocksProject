package com.example.stocks_demo.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class HoldingPerformanceResponse {

    private String symbol;
    private String assetType;

    private BigDecimal quantity;
    private BigDecimal averageBuyPrice;

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
            BigDecimal quantity,
            BigDecimal averageBuyPrice,
            double currentPrice,
            double previousClose
    ) {
        this.symbol = symbol;
        this.assetType = assetType;
        this.quantity = quantity;
        this.averageBuyPrice = averageBuyPrice;
        this.currentPrice = currentPrice;

        BigDecimal currentPriceBD = BigDecimal.valueOf(currentPrice);
        BigDecimal previousCloseBD = BigDecimal.valueOf(previousClose);

        BigDecimal totalCostBD =
                quantity.multiply(averageBuyPrice);

        BigDecimal currentValueBD =
                quantity.multiply(currentPriceBD);

        BigDecimal profitBD =
                currentValueBD.subtract(totalCostBD);

        this.totalCost = totalCostBD.doubleValue();
        this.currentValue = currentValueBD.doubleValue();
        this.profit = profitBD.doubleValue();

        this.profitPercent = totalCostBD.compareTo(BigDecimal.ZERO) == 0
                ? 0
                : profitBD
                  .divide(totalCostBD, 6, RoundingMode.HALF_UP)
                  .multiply(BigDecimal.valueOf(100))
                  .doubleValue();

        BigDecimal dailyChangeBD =
                currentPriceBD.subtract(previousCloseBD)
                        .multiply(quantity);

        this.dailyChange = dailyChangeBD.doubleValue();

        this.dailyChangePercent = previousClose == 0
                ? 0
                : ((currentPrice - previousClose) / previousClose) * 100;
    }

    public String getSymbol() {
        return symbol;
    }

    public String getAssetType() {
        return assetType;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public BigDecimal getAverageBuyPrice() {
        return averageBuyPrice;
    }

    public double getCurrentPrice() {
        return currentPrice;
    }

    public double getTotalCost() {
        return totalCost;
    }

    public double getCurrentValue() {
        return currentValue;
    }

    public double getProfit() {
        return profit;
    }

    public double getProfitPercent() {
        return profitPercent;
    }

    public double getDailyChange() {
        return dailyChange;
    }

    public double getDailyChangePercent() {
        return dailyChangePercent;
    }
}