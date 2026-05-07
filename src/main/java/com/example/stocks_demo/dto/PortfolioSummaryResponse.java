package com.example.stocks_demo.dto;

public class PortfolioSummaryResponse {

    private double totalValue;
    private double totalCost;
    private double profit;
    private double profitPercent;

    public PortfolioSummaryResponse(
            double totalValue,
            double totalCost,
            double profit,
            double profitPercent
    ) {
        this.totalValue = totalValue;
        this.totalCost = totalCost;
        this.profit = profit;
        this.profitPercent = profitPercent;
    }

    public double getTotalValue() {
        return totalValue;
    }

    public double getTotalCost() {
        return totalCost;
    }

    public double getProfit() {
        return profit;
    }

    public double getProfitPercent() {
        return profitPercent;
    }
}