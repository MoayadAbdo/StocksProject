package com.example.stocks_demo.service;

public class CachedPrice {

    private final double price;
    private final long timestamp;

    public CachedPrice(double price, long timestamp) {
        this.price = price;
        this.timestamp = timestamp;
    }

    public double getPrice() {
        return price;
    }

    public long getTimestamp() {
        return timestamp;
    }
}