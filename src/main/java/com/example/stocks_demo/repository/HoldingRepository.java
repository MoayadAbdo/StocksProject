package com.example.stocks_demo.repository;

import com.example.stocks_demo.model.Holding;
import com.example.stocks_demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HoldingRepository extends JpaRepository<Holding, Long> {
    List<Holding> findByUser(User user);
    Optional<Holding> findByIdAndUser(Long id, User user);
    boolean existsByIdAndUser(Long id, User user);
}