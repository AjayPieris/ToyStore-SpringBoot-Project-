package com.example.toystore;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// We extend JpaRepository.
// <Toy, Long> means: "I manage 'Toy' objects, and their ID is a 'Long'."
@Repository
public interface ToyRepository extends JpaRepository<Toy, Long> {
    // That's it! It automatically knows how to Save, Delete, and Find toys.
}