package com.example.stocks_demo.service;

import com.example.stocks_demo.dto.ExposureResponse;
import com.example.stocks_demo.dto.PortfolioSummaryResponse;
import com.example.stocks_demo.model.Holding;
import com.example.stocks_demo.repository.HoldingRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PortfolioService {

    private final HoldingRepository repo;
    private final StockService stockService;
    private final EtfService etfService;

    public PortfolioService(
            HoldingRepository repo,
            StockService stockService,
            EtfService etfService
    ) {
        this.repo = repo;
        this.stockService = stockService;
        this.etfService = etfService;
    }

    public PortfolioSummaryResponse getSummary() {
        List<Holding> holdings = repo.findAll();

        double totalValue = 0;
        double totalCost = 0;

        for (Holding h : holdings) {
            double price = stockService.getPrice(h.getSymbol());

            totalValue += h.getQuantity() * price;
            totalCost += h.getQuantity() * h.getAverageBuyPrice();
        }

        double profit = totalValue - totalCost;
        double profitPercent = totalCost == 0 ? 0 : (profit / totalCost) * 100;

        return new PortfolioSummaryResponse(
                totalValue,
                totalCost,
                profit,
                profitPercent
        );
    }

    public List<ExposureResponse> getExposure() {
        List<Holding> holdings = repo.findAll();

        Map<String, Double> exposure = new HashMap<>();
        double totalPortfolioValue = 0;

        for (Holding h : holdings) {
            double price = stockService.getPrice(h.getSymbol());
            double holdingValue = h.getQuantity() * price;

            totalPortfolioValue += holdingValue;

            if (h.getAssetType().equalsIgnoreCase("STOCK")) {
                exposure.merge(h.getSymbol().toUpperCase(), holdingValue, Double::sum);
            }

            if (h.getAssetType().equalsIgnoreCase("ETF")) {
                Map<String, Double> etfHoldings = etfService.getHoldings(h.getSymbol());

                for (Map.Entry<String, Double> entry : etfHoldings.entrySet()) {
                    String companySymbol = entry.getKey();
                    double weightPercent = entry.getValue();

                    double companyExposure = holdingValue * (weightPercent / 100);
                    exposure.merge(companySymbol, companyExposure, Double::sum);
                }
            }
        }

        List<ExposureResponse> response = new ArrayList<>();

        for (Map.Entry<String, Double> entry : exposure.entrySet()) {
            double value = entry.getValue();

            double percentage = totalPortfolioValue == 0
                    ? 0
                    : (value / totalPortfolioValue) * 100;

            response.add(new ExposureResponse(
                    entry.getKey(),
                    value,
                    percentage
            ));
        }

        response.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));

        return response;
    }
}