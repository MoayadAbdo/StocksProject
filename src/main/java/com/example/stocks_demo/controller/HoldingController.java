package com.example.stocks_demo.controller;

import com.example.stocks_demo.dto.HoldingPerformanceResponse;
import com.example.stocks_demo.dto.HoldingRequest;
import com.example.stocks_demo.model.Holding;
import com.example.stocks_demo.service.HoldingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/holdings")
public class HoldingController {

    private final HoldingService holdingService;

    public HoldingController(HoldingService holdingService) {
        this.holdingService = holdingService;
    }

    @GetMapping
    public List<Holding> getAll() {
        return holdingService.getAll();
    }

    @GetMapping("/performance")
    public List<HoldingPerformanceResponse> getPerformance() {
        return holdingService.getPerformance();
    }

    @GetMapping("/{id}")
    public Holding getHoldingById(@PathVariable Long id) {
        return holdingService.getById(id);
    }

    @PostMapping
    public Holding addHolding(@Valid @RequestBody HoldingRequest request) {
        return holdingService.add(request);
    }

    @PutMapping("/{id}")
    public Holding updateHolding(
            @PathVariable Long id,
            @Valid @RequestBody HoldingRequest request
    ) {
        return holdingService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteHolding(@PathVariable Long id) {
        holdingService.delete(id);
    }
}