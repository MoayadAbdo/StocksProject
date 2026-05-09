package com.example.stocks_demo.dto;

public class PortfolioPerformanceResponse {

    private double totalValue;
    private double totalCost;
    private double totalProfit;
    private double totalProfitPercent;
    private String topGainer;
    private String topLoser;

    public PortfolioPerformanceResponse(
            double totalValue,
            double totalCost,
            double totalProfit,
            double totalProfitPercent,
            String topGainer,
            String topLoser
    ) {
        this.totalValue = totalValue;
        this.totalCost = totalCost;
        this.totalProfit = totalProfit;
        this.totalProfitPercent = totalProfitPercent;
        this.topGainer = topGainer;
        this.topLoser = topLoser;
    }

    public double getTotalValue() { return totalValue; }
    public double getTotalCost() { return totalCost; }
    public double getTotalProfit() { return totalProfit; }
    public double getTotalProfitPercent() { return totalProfitPercent; }
    public String getTopGainer() { return topGainer; }
    public String getTopLoser() { return topLoser; }
}