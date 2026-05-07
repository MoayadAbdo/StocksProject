package com.example.stocks_demo.dto;

public class ExposureResponse {

    private String symbol;
    private double value;
    private double percentageOfPortfolio;

    public ExposureResponse(
            String symbol,
            double value,
            double percentageOfPortfolio
    ) {
        this.symbol = symbol;
        this.value = value;
        this.percentageOfPortfolio = percentageOfPortfolio;
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
}