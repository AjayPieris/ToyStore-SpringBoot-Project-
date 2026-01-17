package com.example.toystore;

import jakarta.persistence.*;

@Entity // This sticker tells Spring: "This class is a database table!"
@Table(name = "toys")
public class Toy {

    @Id // This is the unique barcode for the toy
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment the ID (1, 2, 3...)
    private Long id;

    private String name;
    private Double price;

    // Standard Getters and Setters (needed so Spring can read/write the data)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}