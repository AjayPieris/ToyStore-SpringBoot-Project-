package com.example.toystore;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    // We need to find users by name when they try to login
    Optional<AppUser> findByUsername(String username);
}