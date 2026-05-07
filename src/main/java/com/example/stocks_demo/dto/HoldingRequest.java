package com.example.stocks_demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public class HoldingRequest {

    @NotBlank(message = "Symbol is required")
    private String symbol;

    @NotBlank(message = "Asset type is required")
    private String assetType;

    @Positive(message = "Quantity must be more than 0")
    private double quantity;

    @PositiveOrZero(message = "Average buy price cannot be negative")
    private double averageBuyPrice;

    public String getSymbol() {
        return symbol;
    }
    public String getAssetType() {
        return assetType;
    }
    public double getQuantity() {
        return quantity;
    }
    public double getAverageBuyPrice() {
        return averageBuyPrice;
    }
}
