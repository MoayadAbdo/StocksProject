package com.example.stocks_demo.controller;

import com.example.stocks_demo.dto.HoldingRequest;
import com.example.stocks_demo.model.Holding;
import com.example.stocks_demo.repository.HoldingRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//GET    /api/holdings
//POST   /api/holdings
//DELETE /api/holdings/{id}
@RestController
@RequestMapping("/api/holdings")
public class HoldingController {

    private final HoldingRepository repo;

    public HoldingController(HoldingRepository repo) {
        this.repo = repo;
    }
    @GetMapping
    public List<Holding> getAll(){
        return repo.findAll();
    }
    @GetMapping("/{id}")
    public Holding getHoldingById(@PathVariable Long id){
        return repo.findById(id)
                .orElseThrow(()-> new RuntimeException("Holding not found with id: "+id));
    }

    @PostMapping
    public Holding addHolding(@Valid @RequestBody HoldingRequest request){
        Holding holding = new Holding();
        holding.setSymbol(request.getSymbol().toUpperCase());
        holding.setAssetType(request.getAssetType().toUpperCase());
        holding.setQuantity(request.getQuantity());
        holding.setAverageBuyPrice(request.getAverageBuyPrice());

        return repo.save(holding);
    }
    @PutMapping("/{id}")
    public Holding updateHolding(
            @PathVariable Long id,
            @RequestBody Holding updatedHolding
    ){
        Holding existingHolding = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Holding not found with id: " + id));

        existingHolding.setSymbol(updatedHolding.getSymbol().toUpperCase());
        existingHolding.setAssetType(updatedHolding.getAssetType());
        existingHolding.setQuantity(updatedHolding.getQuantity());
        existingHolding.setAverageBuyPrice(updatedHolding.getAverageBuyPrice());

        return repo.save(existingHolding);
    }
    @DeleteMapping("/{id}")
    public void deleteHolding(@PathVariable Long id){
        if(!repo.existsById(id)){
            throw new RuntimeException("Holding not found with id: "+id);
        }
        repo.deleteById(id);
    }
}
