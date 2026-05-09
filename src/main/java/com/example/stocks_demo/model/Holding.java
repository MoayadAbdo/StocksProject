package com.example.stocks_demo.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
public class Holding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symbol;

    private String assetType;

    @Column(precision = 30, scale = 10)
    private BigDecimal quantity;

    @Column(precision = 30, scale = 10)
    private BigDecimal averageBuyPrice;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Long getId() {
        return id;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getAssetType() {
        return assetType;
    }

    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getAverageBuyPrice() {
        return averageBuyPrice;
    }

    public void setAverageBuyPrice(BigDecimal averageBuyPrice) {
        this.averageBuyPrice = averageBuyPrice;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}