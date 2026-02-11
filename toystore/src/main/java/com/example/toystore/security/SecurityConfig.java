package com.example.toystore.security;

import com.example.toystore.model.AppUser;
import com.example.toystore.repository.AppUserRepository;

import org.springframework.beans.factory.annotation.Autowired; // NEW IMPORT
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // NEW IMPORT

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AppUserRepository userRepository;

    // NEW: We bring the Laser Scanner (JwtFilter) into the room!
    @Autowired
    private JwtFilter jwtFilter;

    public SecurityConfig(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 1. The Password Scrambler
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. The Logic to Find Users in Database
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            AppUser appUser = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            return User.builder()
                    .username(appUser.getUsername())
                    .password(appUser.getPassword())
                    .roles(appUser.getRole())
                    .build();
        };
    }

    // 3. The Master Password Checker (For the Front Desk)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // 4. The Connector (Tells the Password Checker how to find users and unscramble passwords)
    @Bean
    public AuthenticationProvider authenticationProvider() {

        // THE FIX: We put userDetailsService() directly inside the parentheses!
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService());

        // We still add the password scrambler right after
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    // 5. The NEW Rules (Who is allowed where)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // We added "/login" so people can get their token!
                        .requestMatchers("/register", "/login").permitAll()
                        .anyRequest().authenticated()
                )
                // Tell the factory to have total amnesia. Rely 100% on the Token.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())

                // NEW: Plug the Laser Scanner in right before the Bouncer!
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}