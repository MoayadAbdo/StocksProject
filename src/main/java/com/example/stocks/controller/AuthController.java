package com.example.stocks.controller;

import com.example.stocks.dto.LoginRequest;
import com.example.stocks.dto.LoginResponse;
import com.example.stocks.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        boolean ok = authService.authenticate(request);

        if (!ok) {
            return ResponseEntity.status(401)
                    .body(new LoginResponse(false, "Invalid username or password", null));
        }

        return ResponseEntity.ok(
                new LoginResponse(true, "Login successful", "/dashboard")
        );
    }
}