package com.example.stocks_demo.dto;

public class ExposureResponse {

    private String symbol;
    private double value;
    private double percentageOfPortfolio;
    private double stockValue;
    private double etfValue;
    private double stockPercentageOfPortfolio;
    private double etfPercentageOfPortfolio;

    public ExposureResponse(
            String symbol,
            double value,
            double percentageOfPortfolio,
            double stockValue,
            double etfValue,
            double stockPercentageOfPortfolio,
            double etfPercentageOfPortfolio
    ) {
        this.symbol = symbol;
        this.value = value;
        this.percentageOfPortfolio = percentageOfPortfolio;
        this.stockValue = stockValue;
        this.etfValue = etfValue;
        this.stockPercentageOfPortfolio = stockPercentageOfPortfolio;
        this.etfPercentageOfPortfolio = etfPercentageOfPortfolio;
    }

    public String getSymbol() {
        return symbol;
    }

    public double getValue() {
        return value;
    }

    public double getPercentageOfPortfolio() {
        return percentageOfPortfolio;
    }

    public double getStockValue() {
        return stockValue;
    }

    public double getEtfValue() {
        return etfValue;
    }

    public double getStockPercentageOfPortfolio() {
        return stockPercentageOfPortfolio;
    }

    public double getEtfPercentageOfPortfolio() {
        return etfPercentageOfPortfolio;
    }
}
