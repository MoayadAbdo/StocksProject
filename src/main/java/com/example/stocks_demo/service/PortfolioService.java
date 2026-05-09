package com.example.stocks_demo.service;

import com.example.stocks_demo.dto.ExposureResponse;
import com.example.stocks_demo.dto.PortfolioPerformanceResponse;
import com.example.stocks_demo.dto.PortfolioSummaryResponse;
import com.example.stocks_demo.model.Holding;
import com.example.stocks_demo.repository.HoldingRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class PortfolioService {
    private static final class ExposureAccumulator {
        private BigDecimal stockValue = BigDecimal.ZERO;
        private BigDecimal etfValue = BigDecimal.ZERO;

        private BigDecimal getTotalValue() {
            return stockValue.add(etfValue);
        }
    }

    private final HoldingRepository repo;
    private final StockService stockService;
    private final EtfService etfService;
    private final CurrentUserService currentUserService;

    public PortfolioService(
            HoldingRepository repo,
            StockService stockService,
            EtfService etfService,
            CurrentUserService currentUserService
    ) {
        this.repo = repo;
        this.stockService = stockService;
        this.etfService = etfService;
        this.currentUserService = currentUserService;
    }

    public PortfolioSummaryResponse getSummary() {
        List<Holding> holdings = repo.findByUser(currentUserService.getCurrentUser());

        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;

        for (Holding h : holdings) {
            BigDecimal currentPrice = BigDecimal.valueOf(
                    stockService.getPrice(h.getSymbol())
            );

            BigDecimal holdingValue = h.getQuantity().multiply(currentPrice);
            BigDecimal holdingCost = h.getQuantity().multiply(h.getAverageBuyPrice());

            totalValue = totalValue.add(holdingValue);
            totalCost = totalCost.add(holdingCost);
        }

        BigDecimal profit = totalValue.subtract(totalCost);

        double profitPercent = totalCost.compareTo(BigDecimal.ZERO) == 0
                ? 0
                : profit
                  .divide(totalCost, 6, RoundingMode.HALF_UP)
                  .multiply(BigDecimal.valueOf(100))
                  .doubleValue();

        return new PortfolioSummaryResponse(
                totalValue.doubleValue(),
                totalCost.doubleValue(),
                profit.doubleValue(),
                profitPercent
        );
    }

    public List<ExposureResponse> getExposure() {
        List<Holding> holdings = repo.findByUser(currentUserService.getCurrentUser());

        Map<String, ExposureAccumulator> exposure = new HashMap<>();
        BigDecimal totalPortfolioValue = BigDecimal.ZERO;

        for (Holding h : holdings) {
            BigDecimal currentPrice = BigDecimal.valueOf(
                    stockService.getPrice(h.getSymbol())
            );

            BigDecimal holdingValue = h.getQuantity().multiply(currentPrice);

            totalPortfolioValue = totalPortfolioValue.add(holdingValue);

            if (h.getAssetType().equalsIgnoreCase("STOCK")) {
                String symbol = h.getSymbol().toUpperCase();
                ExposureAccumulator bucket = exposure.computeIfAbsent(
                        symbol,
                        ignored -> new ExposureAccumulator()
                );
                bucket.stockValue = bucket.stockValue.add(holdingValue);
            }

            if (h.getAssetType().equalsIgnoreCase("ETF")) {
                Map<String, Double> etfHoldings = etfService.getHoldings(h.getSymbol());

                for (Map.Entry<String, Double> entry : etfHoldings.entrySet()) {
                    String companySymbol = entry.getKey().toUpperCase();

                    BigDecimal weightPercent = BigDecimal.valueOf(entry.getValue());

                    BigDecimal companyExposure = holdingValue
                            .multiply(weightPercent)
                            .divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP);

                    ExposureAccumulator bucket = exposure.computeIfAbsent(
                            companySymbol,
                            ignored -> new ExposureAccumulator()
                    );
                    bucket.etfValue = bucket.etfValue.add(companyExposure);
                }
            }
        }

        List<ExposureResponse> response = new ArrayList<>();

        for (Map.Entry<String, ExposureAccumulator> entry : exposure.entrySet()) {
            ExposureAccumulator accumulator = entry.getValue();
            BigDecimal stockValue = accumulator.stockValue;
            BigDecimal etfValue = accumulator.etfValue;
            BigDecimal value = accumulator.getTotalValue();

            double percentage = totalPortfolioValue.compareTo(BigDecimal.ZERO) == 0
                    ? 0
                    : value
                      .divide(totalPortfolioValue, 6, RoundingMode.HALF_UP)
                      .multiply(BigDecimal.valueOf(100))
                      .doubleValue();

            double stockPercentage = totalPortfolioValue.compareTo(BigDecimal.ZERO) == 0
                    ? 0
                    : stockValue
                      .divide(totalPortfolioValue, 6, RoundingMode.HALF_UP)
                      .multiply(BigDecimal.valueOf(100))
                      .doubleValue();

            double etfPercentage = totalPortfolioValue.compareTo(BigDecimal.ZERO) == 0
                    ? 0
                    : etfValue
                      .divide(totalPortfolioValue, 6, RoundingMode.HALF_UP)
                      .multiply(BigDecimal.valueOf(100))
                      .doubleValue();

            response.add(new ExposureResponse(
                    entry.getKey(),
                    value.doubleValue(),
                    percentage,
                    stockValue.doubleValue(),
                    etfValue.doubleValue(),
                    stockPercentage,
                    etfPercentage
            ));
        }

        response.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));

        return response;
    }

    public PortfolioPerformanceResponse getPerformance() {
        List<Holding> holdings = repo.findByUser(currentUserService.getCurrentUser());

        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;

        String topGainer = null;
        String topLoser = null;

        double maxProfitPercent = Double.NEGATIVE_INFINITY;
        double minProfitPercent = Double.POSITIVE_INFINITY;

        for (Holding h : holdings) {
            BigDecimal currentPrice = BigDecimal.valueOf(
                    stockService.getPrice(h.getSymbol())
            );

            BigDecimal cost = h.getQuantity().multiply(h.getAverageBuyPrice());
            BigDecimal value = h.getQuantity().multiply(currentPrice);
            BigDecimal profit = value.subtract(cost);

            double profitPercent = cost.compareTo(BigDecimal.ZERO) == 0
                    ? 0
                    : profit
                      .divide(cost, 6, RoundingMode.HALF_UP)
                      .multiply(BigDecimal.valueOf(100))
                      .doubleValue();

            totalValue = totalValue.add(value);
            totalCost = totalCost.add(cost);

            if (profitPercent > maxProfitPercent) {
                maxProfitPercent = profitPercent;
                topGainer = h.getSymbol();
            }

            if (profitPercent < minProfitPercent) {
                minProfitPercent = profitPercent;
                topLoser = h.getSymbol();
            }
        }

        BigDecimal totalProfit = totalValue.subtract(totalCost);

        double totalProfitPercent = totalCost.compareTo(BigDecimal.ZERO) == 0
                ? 0
                : totalProfit
                  .divide(totalCost, 6, RoundingMode.HALF_UP)
                  .multiply(BigDecimal.valueOf(100))
                  .doubleValue();

        return new PortfolioPerformanceResponse(
                totalValue.doubleValue(),
                totalCost.doubleValue(),
                totalProfit.doubleValue(),
                totalProfitPercent,
                topGainer,
                topLoser
        );
    }
}
