package com.example.toystore;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Configuration                                   // This class is a Spring configuration file (tells Spring to read beans here)
@EnableWebSecurity                               // Enables Spring Security for this app (activates web security)
public class SecurityConfig {

    private final AppUserRepository userRepository;  // Repository to access users in database

    public SecurityConfig(AppUserRepository userRepository) {
        this.userRepository = userRepository;      // Constructor injection: Spring gives the user repository
    }

    // 1. The Password Scrambler
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();       // Bean that scrambles passwords using BCrypt
    }

    // 2. The Logic to Find Users in Database
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            AppUser appUser = userRepository.findByUsername(username) // Look for the user in DB
                    .orElseThrow(() -> new UsernameNotFoundException("User not found")); // Throw error if not found

            return User.builder()                     // Build a Spring Security User object
                    .username(appUser.getUsername())     // Set username
                    .password(appUser.getPassword())     // Set scrambled password
                    .roles(appUser.getRole())            // Set role (USER / ADMIN)
                    .build();                            // Return the built User object
        };
    }

    // 3. The Rules (Who is allowed where)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())            // Disable CSRF protection for simplicity (not recommended in production)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/register").permitAll() // Allow everyone to access /register
                        .anyRequest().authenticated()             // All other URLs require login
                )
                .httpBasic(basic -> {});                 // Show simple browser popup login for authentication

        return http.build();                          // Build the security rules
    }
}
