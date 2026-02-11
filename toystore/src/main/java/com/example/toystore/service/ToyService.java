package com.example.toystore.service;

import com.example.toystore.model.Toy;
import com.example.toystore.repository.ToyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ToyService {

    @Autowired
    private ToyRepository toyRepository;

    // 1. Get all
    public List<Toy> getAllToys() {
        return toyRepository.findAll();
    }

    // 2. Create
    public Toy createToy(Toy toy) {
        if (toy.getPrice() < 0) {
            throw new IllegalArgumentException("Wait! A toy cannot have a negative price!");
        }
        if (toy.getName() == null || toy.getName().isEmpty()) {
            throw new IllegalArgumentException("Wait! The toy must have a name!");
        }
        return toyRepository.save(toy);
    }

    // 3. Search
    public List<Toy> searchToys(String name) {
        return toyRepository.findByName(name);
    }

    // 4. Update
    public Toy updateToy(Long id, Toy toyDetails) {
        // The Inspector finds the old toy first
        Toy toy = toyRepository.findById(id).orElseThrow(() -> new RuntimeException("Toy not found!"));

        // --- QUALITY CONTROL ---

        // Check the new price
        if (toyDetails.getPrice() < 0) {
            throw new IllegalArgumentException("Wait! The new price cannot be negative!");
        }

        // THE FIX IS HERE: We changed 'toy.getName()' to 'toyDetails.getName()'
        if (toyDetails.getName() == null || toyDetails.getName().isEmpty()) {
            throw new IllegalArgumentException("Wait! The new toy must have a name!");
        }

        // If it passes the rules, update the old toy with the new details
        toy.setName(toyDetails.getName());
        toy.setPrice(toyDetails.getPrice());

        return toyRepository.save(toy); // Save the updated toy
    }

    // 5. Delete
    public void deleteToy(Long id) {
        toyRepository.deleteById(id);
    }
}