package com.example.stocks_demo.service;

import com.example.stocks_demo.dto.HoldingPerformanceResponse;
import com.example.stocks_demo.dto.HoldingRequest;
import com.example.stocks_demo.dto.StockQuoteResponse;
import com.example.stocks_demo.model.Holding;
import com.example.stocks_demo.model.User;
import com.example.stocks_demo.repository.HoldingRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HoldingService {

    private final HoldingRepository repo;
    private final StockService stockService;
    private final CurrentUserService currentUserService;

    public HoldingService(
            HoldingRepository repo,
            StockService stockService,
            CurrentUserService currentUserService
    ) {
        this.repo = repo;
        this.stockService = stockService;
        this.currentUserService = currentUserService;
    }

    public List<Holding> getAll() {
        User user = currentUserService.getCurrentUser();
        return repo.findByUser(user);
    }

    public Holding getById(Long id) {
        User user = currentUserService.getCurrentUser();

        return repo.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Holding not found with id: " + id));
    }

    public Holding add(HoldingRequest request) {
        User user = currentUserService.getCurrentUser();

        Holding holding = new Holding();
        holding.setSymbol(request.getSymbol().toUpperCase());
        holding.setAssetType(request.getAssetType().toUpperCase());
        holding.setQuantity(request.getQuantity());
        holding.setAverageBuyPrice(request.getAverageBuyPrice());
        holding.setUser(user);

        return repo.save(holding);
    }

    public Holding update(Long id, HoldingRequest request) {
        User user = currentUserService.getCurrentUser();

        Holding holding = repo.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Holding not found with id: " + id));

        holding.setSymbol(request.getSymbol().toUpperCase());
        holding.setAssetType(request.getAssetType().toUpperCase());
        holding.setQuantity(request.getQuantity());
        holding.setAverageBuyPrice(request.getAverageBuyPrice());

        return repo.save(holding);
    }

    public void delete(Long id) {
        User user = currentUserService.getCurrentUser();

        Holding holding = repo.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Holding not found with id: " + id));

        repo.delete(holding);
    }

    public List<HoldingPerformanceResponse> getPerformance() {
        User user = currentUserService.getCurrentUser();
        List<Holding> holdings = repo.findByUser(user);

        List<HoldingPerformanceResponse> response = new ArrayList<>();

        for (Holding h : holdings) {
            StockQuoteResponse quote = stockService.getQuote(h.getSymbol());

            response.add(new HoldingPerformanceResponse(
                    h.getSymbol(),
                    h.getAssetType(),
                    h.getQuantity(),
                    h.getAverageBuyPrice(),
                    quote.getPrice(),
                    quote.getPreviousClose()
            ));
        }

        response.sort((a, b) -> Double.compare(b.getCurrentValue(), a.getCurrentValue()));

        return response;
    }
}