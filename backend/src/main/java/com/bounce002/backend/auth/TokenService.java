package com.bounce002.backend.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;
import org.springframework.stereotype.Service;

/** Random tokens for sessions, email verification and invites. Only a hash is stored in the database. */
@Service
public class TokenService {
    private static final SecureRandom RANDOM = new SecureRandom();
    private final AuthTokenRepository tokens;
    private final UserRepository users;

    public TokenService(AuthTokenRepository tokens, UserRepository users) {
        this.tokens = tokens;
        this.users = users;
    }

    public String create(User user, String purpose, Duration ttl) {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String raw = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        var t = new AuthToken();
        t.setTokenHash(hash(raw));
        t.setUserId(user.getId());
        t.setPurpose(purpose);
        t.setExpiresAt(Instant.now().plus(ttl));
        tokens.save(t);
        return raw;
    }

    /** Single use: the token is deleted whether or not it was still valid. */
    public Optional<User> consume(String raw, String purpose) {
        var t = tokens.findByTokenHash(hash(raw)).filter(x -> purpose.equals(x.getPurpose()));
        t.ifPresent(tokens::delete);
        return t.filter(x -> x.getExpiresAt().isAfter(Instant.now())).flatMap(x -> users.findById(x.getUserId()));
    }

    public Optional<AuthUser> authenticate(String raw) {
        return tokens.findByTokenHash(hash(raw))
                .filter(t -> "SESSION".equals(t.getPurpose()) && t.getExpiresAt().isAfter(Instant.now()))
                .flatMap(t -> users.findById(t.getUserId()))
                .map(u -> new AuthUser(u.getId(), u.getEmail(), u.getRole(), u.getCourtId()));
    }

    public void revoke(String raw) {
        tokens.findByTokenHash(hash(raw)).ifPresent(tokens::delete);
    }

    static String hash(String raw) {
        try {
            byte[] d = MessageDigest.getInstance("SHA-256").digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(d);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
