package com.example.stocks_demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class HoldingRequest {

    @NotBlank(message = "Symbol is required")
    private String symbol;

    @NotBlank(message = "Asset type is required")
    private String assetType;

    private BigDecimal quantity;

    private BigDecimal averageBuyPrice;

    public String getSymbol() {
        return symbol;
    }
    public String getAssetType() {
        return assetType;
    }
    public BigDecimal getQuantity() {
        return quantity;
    }
    public BigDecimal getAverageBuyPrice() {
        return averageBuyPrice;
    }
}
