package com.example.toystore.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service // Marks this class as a Spring service (used for business logic like handling JWTs)
public class JwtService {

    // Secret key used to sign and verify JWT tokens (must be kept safe in real apps)
    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    // Method to create a JWT token for a given username
    public String generateToken(String username) {
        return Jwts.builder() // Start building the JWT token
                .setSubject(username) // Store the username inside the token
                .setIssuedAt(new Date(System.currentTimeMillis())) // Set token creation time
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                // Set expiration time (24 hours from now)

                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                // Sign the token using secret key and HS256 algorithm (prevents tampering)

                .compact(); // Convert the token into a compact string format and return it
    }

    // Method to extract username from an existing JWT token
    public String extractUsername(String token) {
        return Jwts.parserBuilder() // Start reading/parsing the token
                .setSigningKey(getSignInKey()) // Use the same secret key to verify signature
                .build()
                .parseClaimsJws(token) // Decode and validate the token
                .getBody() // Get the data (claims) stored inside
                .getSubject(); // Return the username that was stored earlier
    }

    // Helper method to convert the secret string into a Key object
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY); // Decode the secret key from Base64
        return Keys.hmacShaKeyFor(keyBytes); // Create an HMAC SHA key used for signing tokens
    }
}
