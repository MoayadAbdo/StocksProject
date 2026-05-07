package com.example.stocks_demo.service;

import com.example.stocks_demo.dto.StockQuoteResponse;

public class CachedQuote {

    private final StockQuoteResponse quote;
    private final long timestamp;

    public CachedQuote(StockQuoteResponse quote, long timestamp) {
        this.quote = quote;
        this.timestamp = timestamp;
    }

    public StockQuoteResponse getQuote() {
        return quote;
    }

    public long getTimestamp() {
        return timestamp;
    }
}