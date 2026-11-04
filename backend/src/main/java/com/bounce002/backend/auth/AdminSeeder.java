package com.bounce002.backend.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Creates the first admin on startup from backend/local.properties, if none exists with that email. */
@Component
public class AdminSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final String email;
    private final String password;

    public AdminSeeder(UserRepository users, PasswordEncoder encoder,
                       @Value("${bounce.admin.email:}") String email, @Value("${bounce.admin.password:}") String password) {
        this.users = users;
        this.encoder = encoder;
        this.email = email.trim().toLowerCase();
        this.password = password;
    }

    @Override
    public void run(String... args) {
        if (email.isBlank() || password.length() < 8) {
            log.warn("No admin account created. Set bounce.admin.email and bounce.admin.password (8+ characters) in backend/local.properties");
            return;
        }
        if (users.findByEmail(email).isPresent()) return;
        var u = new User();
        u.setEmail(email);
        u.setFullName("Admin");
        u.setPasswordHash(encoder.encode(password));
        u.setRole("ADMIN");
        u.setEmailVerified(true);
        users.save(u);
        log.info("Admin account created for {}", email);
    }
}
