package com.example.stocks_demo.controller;

import com.example.stocks_demo.dto.StockQuoteResponse;
import com.example.stocks_demo.service.StockService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/{symbol}/quote")
    public StockQuoteResponse getQuote(@PathVariable String symbol) {
        return stockService.getQuote(symbol);
    }
}