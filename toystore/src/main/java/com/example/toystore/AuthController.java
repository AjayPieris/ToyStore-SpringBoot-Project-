package com.example.toystore;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // The Scrambler

    // The Sign-Up Endpoint
    @PostMapping("/register")
    public AppUser registerUser(@RequestBody AppUser user) {
        // 1. Scramble the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 2. Set default role
        user.setRole("USER");

        // 3. Save to database
        return userRepository.save(user);
    }
}