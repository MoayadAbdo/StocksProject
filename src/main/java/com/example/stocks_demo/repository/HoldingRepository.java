package com.example.stocks_demo.repository;

import com.example.stocks_demo.model.Holding;
import org.springframework.data.jpa.repository.JpaRepository;

//to talk to the database
public interface HoldingRepository extends JpaRepository<Holding, Long> {

}
