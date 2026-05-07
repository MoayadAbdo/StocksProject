package com.example.stocks_demo.service;
//fake/mock ETF holdings

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EtfService {
    public Map<String,Double> getHoldings(String etfSymbol){
        return switch (etfSymbol.toUpperCase()){
            // S&P 500 ETF
            case "VOO", "SPY" -> Map.of(
                    "AAPL", 7.0,
                    "MSFT", 6.5,
                    "NVDA", 5.0,
                    "AMZN", 3.5,
                    "GOOGL", 2.5
            );

            // Vanguard Information Technology ETF
            case "VGT" -> Map.of(
                    "AAPL", 22.0,
                    "MSFT", 20.0,
                    "NVDA", 6.5,
                    "AVGO", 5.0,
                    "AMD", 3.0
            );

            // Nasdaq
            case "QQQ" -> Map.of(
                    "AAPL", 8.5,
                    "MSFT", 8.0,
                    "NVDA", 7.0,
                    "GOOGL", 4.0
            );

            default -> Map.of();
        };
    }
}
