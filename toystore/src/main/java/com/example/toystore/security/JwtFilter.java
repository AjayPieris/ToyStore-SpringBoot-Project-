package com.example.toystore.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component // Tells the factory: "This is a working piece of machinery"
public class JwtFilter extends OncePerRequestFilter { // OncePerRequestFilter = "Scan every person exactly once

    @Autowired
    private JwtService jwtService; // The Wristband Maker

    @Autowired
    @Lazy
    private UserDetailsService userDetailsService; // To find the user in the database

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Look at the user's wrist (Check the "Authorization" header)
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // 2. Check if they are wearing the specific "Bearer " brand wristband
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Cut off the word "Bearer " to get the actual token
            username = jwtService.extractUsername(token); // Read the name on the wristband
        }

        // 3. If we found a name, but the Bouncer hasn't checked them off his list yet...
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // 4. Double-check: Is the wristband still glowing (not expired)?
            // (In a real app, we verify expiration here. Our JwtService throws an error if it's expired automatically)

            // 5. Tell the Bouncer to put this person on the VIP list for this visit!
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken); // "Bouncer, let them in!"
        }

        // 6. Let the person keep walking toward the door
        filterChain.doFilter(request, response);
    }
}