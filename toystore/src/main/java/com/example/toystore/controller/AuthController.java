package com.example.toystore.controller;

import com.example.toystore.model.AppUser;
import com.example.toystore.repository.AppUserRepository;
import com.example.toystore.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
public class AuthController {

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // The Scrambler

    @Autowired
    private AuthenticationManager authenticationManager; // The Password Checker

    @Autowired
    private JwtService jwtService; // The Wristband Maker

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
    // NEW: The Front Desk (Login)
    @PostMapping("/login")
    public String login(@RequestBody AppUser user) {

        // 1. Hand the username and password to the Password Checker
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        // 2. If the checker says "Yes, they match!", print the wristband
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getUsername());
        } else {
            return "Login Failed!";
        }
    }
}