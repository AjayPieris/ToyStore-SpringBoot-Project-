package com.example.toystore;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

// We extend JpaRepository.
// <Toy, Long> means: "I manage 'Toy' objects, and their ID is a 'Long'."
@Repository
public interface ToyRepository extends JpaRepository<Toy, Long> {
    // That's it! It automatically knows how to Save, Delete, and Find toys.

    // MAGIC HAPPENS HERE!
    // We just write "findBy" + "Name".
    // Spring reads this and automatically writes the SQL: SELECT * FROM toys WHERE name = ?
    List<Toy> findByName(String name);
}