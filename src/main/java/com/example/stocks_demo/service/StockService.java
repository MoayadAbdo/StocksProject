package com.example.stocks_demo.service;

import com.example.stocks_demo.dto.StockQuoteResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StockService {

    private final WebClient webClient;
    private final String apiKey;

    private final Map<String, CachedQuote> quoteCache = new ConcurrentHashMap<>();

    private static final long CACHE_DURATION = 60_000;

    public StockService(@Value("${finnhub.api.key}") String apiKey) {
        this.apiKey = apiKey;
        this.webClient = WebClient.create("https://finnhub.io/api/v1");
    }

    public double getPrice(String symbol) {
        return getQuote(symbol).getPrice();
    }

    public StockQuoteResponse getQuote(String symbol) {
        String upperSymbol = symbol.toUpperCase();

        if (quoteCache.containsKey(upperSymbol)) {
            CachedQuote cached = quoteCache.get(upperSymbol);
            long now = System.currentTimeMillis();

            if (now - cached.getTimestamp() < CACHE_DURATION) {
                System.out.println("QUOTE CACHE HIT: " + upperSymbol);
                return cached.getQuote();
            }
        }

        System.out.println("QUOTE API CALL: " + upperSymbol);

        Map response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/quote")
                        .queryParam("symbol", upperSymbol)
                        .queryParam("token", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response == null || response.get("c") == null) {
            throw new RuntimeException("Failed to fetch quote for " + upperSymbol);
        }

        double currentPrice = ((Number) response.get("c")).doubleValue();
        double high = ((Number) response.get("h")).doubleValue();
        double low = ((Number) response.get("l")).doubleValue();
        double open = ((Number) response.get("o")).doubleValue();
        double previousClose = ((Number) response.get("pc")).doubleValue();

        StockQuoteResponse quote = new StockQuoteResponse(
                upperSymbol,
                currentPrice,
                open,
                high,
                low,
                previousClose
        );

        quoteCache.put(upperSymbol, new CachedQuote(quote, System.currentTimeMillis()));

        return quote;
    }
}