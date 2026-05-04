package com.example.stocks.dto;

public class LoginResponse {
    private boolean success;
    private String message;
    private String redirectUrl;

    public LoginResponse(boolean success, String message, String redirectUrl) {
        this.success = success;
        this.message = message;
        this.redirectUrl = redirectUrl;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getRedirectUrl() { return redirectUrl; }
}
