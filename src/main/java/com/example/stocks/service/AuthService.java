package com.example.stocks.service;

import com.example.stocks.dto.LoginRequest;
import com.example.stocks.entity.User;
import com.example.stocks.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean authenticate(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername()).orElse(null);

        if (user == null) {
            return false;
        }

        return request.getPassword().equals(user.getPassword());
    }
}
