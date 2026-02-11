package com.example.toystore.controller;

import com.example.toystore.model.Toy;
import com.example.toystore.service.ToyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/toys")
public class ToyController {

    // The Manager ONLY has a walkie-talkie for the Inspector now!
    @Autowired
    private ToyService toyService;

    // 1. GET all toys
    @GetMapping
    public List<Toy> getAllToys() {
        return toyService.getAllToys();
    }

    // 2. SEARCH toys
    @GetMapping("/search")
    public List<Toy> searchToys(@RequestParam String name) {
        return toyService.searchToys(name); // Asked the Inspector!
    }

    // 3. POST a new toy
    @PostMapping
    public Toy createToy(@RequestBody Toy toy) {
        return toyService.createToy(toy); // Asked the Inspector!
    }

    // 4. PUT (Update) a toy
    @PutMapping("/{id}")
    public Toy updateToy(@PathVariable Long id, @RequestBody Toy toyDetails) {
        return toyService.updateToy(id, toyDetails); // Asked the Inspector!

    }

    // 5. DELETE a toy
    @DeleteMapping("/{id}")
    public void deleteToy(@PathVariable Long id) {
        toyService.deleteToy(id); // Asked the Inspector!
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}

