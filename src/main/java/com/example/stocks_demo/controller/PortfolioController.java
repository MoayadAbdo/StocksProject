package com.example.stocks_demo.controller;

import com.example.stocks_demo.dto.ExposureResponse;
import com.example.stocks_demo.dto.PortfolioPerformanceResponse;
import com.example.stocks_demo.dto.PortfolioSummaryResponse;
import com.example.stocks_demo.service.PortfolioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/summary")
    public PortfolioSummaryResponse getSummary() {
        return portfolioService.getSummary();
    }

    @GetMapping("/exposure")
    public List<ExposureResponse> getExposure() {
        return portfolioService.getExposure();
    }
    @GetMapping("/performance")
    public PortfolioPerformanceResponse getPerformance() {
        return portfolioService.getPerformance();
    }
}