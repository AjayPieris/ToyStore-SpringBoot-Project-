package com.example.toystore;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController // Tells Spring: "This class handles web requests"
@RequestMapping("/toys") // All URLs will start with /toys
public class ToyController {

    @Autowired // Dependency Injection: "Hey Spring, please bring me the Stock Clerk (Repository)"
    private ToyRepository toyRepository;

    // 1. GET all toys (Read)
    @GetMapping
    public List<Toy> getAllToys() {
        return toyRepository.findAll();
    }

    @GetMapping("/search")
    public List<Toy> searchToys(@RequestParam String name) {
        return toyRepository.findByName(name);
    }

    // 2. POST a new toy (Create)
    @PostMapping
    public Toy createToy(@RequestBody Toy toy) {
        return toyRepository.save(toy);
    }

    // 3. PUT (Update) a toy
    @PutMapping("/{id}")
    public Toy updateToy(@PathVariable Long id, @RequestBody Toy toyDetails) {
        Toy toy = toyRepository.findById(id).orElseThrow(); // Find the toy or error
        toy.setName(toyDetails.getName());
        toy.setPrice(toyDetails.getPrice());
        return toyRepository.save(toy);
    }

    // 4. DELETE a toy
    @DeleteMapping("/{id}")
    public void deleteToy(@PathVariable Long id) {
        toyRepository.deleteById(id);
    }
}