package com.example.stocks_demo.dto;

public class StockQuoteResponse {

    private String symbol;
    private double price;
    private double open;
    private double high;
    private double low;
    private double previousClose;
    private double change;
    private double changePercent;

    public StockQuoteResponse(
            String symbol,
            double price,
            double open,
            double high,
            double low,
            double previousClose
    ) {
        this.symbol = symbol;
        this.price = price;
        this.open = open;
        this.high = high;
        this.low = low;
        this.previousClose = previousClose;
        this.change = price - previousClose;
        this.changePercent = previousClose == 0 ? 0 : (this.change / previousClose) * 100;
    }

    public String getSymbol() { return symbol; }
    public double getPrice() { return price; }
    public double getOpen() { return open; }
    public double getHigh() { return high; }
    public double getLow() { return low; }
    public double getPreviousClose() { return previousClose; }
    public double getChange() { return change; }
    public double getChangePercent() { return changePercent; }
}