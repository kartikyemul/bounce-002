package com.bounce002.backend.auth;

import com.bounce002.backend.court.CourtRepository;
import java.time.Clock;
import java.time.Duration;
import java.util.List;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    public record UserInfo(Long id, String email, String fullName, String role, Long courtId) {
        static UserInfo of(User u) { return new UserInfo(u.getId(), u.getEmail(), u.getFullName(), u.getRole(), u.getCourtId()); }
    }
    public record LoginResult(String token, UserInfo user) {}
    public record StaffInfo(String email, Long courtId, boolean active) {}

    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$");

    private final UserRepository users;
    private final CourtRepository courts;
    private final TokenService tokens;
    private final PasswordEncoder encoder;
    private final EmailService email;
    private final String frontendUrl;
    private final LoginThrottle throttle = new LoginThrottle(5, Duration.ofMinutes(15), Clock.systemUTC());

    public AuthService(UserRepository users, CourtRepository courts, TokenService tokens, PasswordEncoder encoder,
                       EmailService email, @Value("${bounce.frontend-url}") String frontendUrl) {
        this.users = users;
        this.courts = courts;
        this.tokens = tokens;
        this.encoder = encoder;
        this.email = email;
        this.frontendUrl = frontendUrl;
    }

    public void signup(String fullName, String rawEmail, String password) {
        String e = cleanEmail(rawEmail);
        checkPassword(password);
        if (users.findByEmail(e).isPresent()) throw fail(HttpStatus.CONFLICT, "An account with this email already exists");
        var u = new User();
        u.setEmail(e);
        u.setFullName(fullName.trim());
        u.setPasswordHash(encoder.encode(password));
        u.setRole("CUSTOMER");
        try {
            users.save(u);
        } catch (DataIntegrityViolationException ex) {
            throw fail(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        String link = frontendUrl + "/verify?token=" + tokens.create(u, "VERIFY", Duration.ofHours(24));
        email.send(e, "Verify your Bounce 002 email", "Welcome! Open this link to verify your email (valid for 24 hours):\n" + link);
    }

    public void verify(String token) {
        var u = tokens.consume(token, "VERIFY").orElseThrow(() -> fail(HttpStatus.BAD_REQUEST, "This link is invalid or has expired"));
        u.setEmailVerified(true);
        users.save(u);
    }

    public LoginResult login(String rawEmail, String password) {
        String e = rawEmail.trim().toLowerCase();
        if (throttle.blocked(e)) throw fail(HttpStatus.TOO_MANY_REQUESTS, "Too many attempts. Try again in a few minutes");
        var u = users.findByEmail(e).orElse(null);
        if (u == null || u.getPasswordHash() == null || !encoder.matches(password, u.getPasswordHash())) {
            throttle.fail(e);
            throw fail(HttpStatus.UNAUTHORIZED, "Wrong email or password");
        }
        if (!u.isEmailVerified()) throw fail(HttpStatus.FORBIDDEN, "Please verify your email first. Check your inbox for the link");
        throttle.clear(e);
        return new LoginResult(tokens.create(u, "SESSION", Duration.ofDays(7)), UserInfo.of(u));
    }

    public void logout(String token) { tokens.revoke(token); }

    public UserInfo me(Long id) {
        return UserInfo.of(users.findById(id).orElseThrow(() -> fail(HttpStatus.UNAUTHORIZED, "Please log in again")));
    }

    public void invite(String rawEmail, Long courtId) {
        String e = cleanEmail(rawEmail);
        courts.findById(courtId).orElseThrow(() -> fail(HttpStatus.NOT_FOUND, "Court not found"));
        if (users.findByEmail(e).isPresent()) throw fail(HttpStatus.CONFLICT, "An account with this email already exists");
        if (users.findByRole("INCHARGE").stream().anyMatch(s -> courtId.equals(s.getCourtId()))) {
            throw fail(HttpStatus.CONFLICT, "That court already has an in-charge");
        }
        var u = new User();
        u.setEmail(e);
        u.setRole("INCHARGE");
        u.setCourtId(courtId);
        users.save(u);
        String link = frontendUrl + "/accept-invite?token=" + tokens.create(u, "INVITE", Duration.ofDays(3));
        email.send(e, "You are invited to run a court at Bounce 002", "Open this link to set your name and password (valid for 3 days):\n" + link);
    }

    public void acceptInvite(String token, String fullName, String password) {
        checkPassword(password);
        var u = tokens.consume(token, "INVITE").orElseThrow(() -> fail(HttpStatus.BAD_REQUEST, "This invite is invalid or has expired"));
        u.setFullName(fullName.trim());
        u.setPasswordHash(encoder.encode(password));
        u.setEmailVerified(true); // the invite went to this address, so it is proven
        users.save(u);
    }

    public List<StaffInfo> staff() {
        return users.findByRole("INCHARGE").stream().map(u -> new StaffInfo(u.getEmail(), u.getCourtId(), u.getPasswordHash() != null)).toList();
    }

    private String cleanEmail(String raw) {
        String e = raw.trim().toLowerCase();
        if (e.length() > 255 || !EMAIL.matcher(e).matches()) throw fail(HttpStatus.BAD_REQUEST, "Enter a valid email address");
        if (DisposableEmails.isDisposable(e)) throw fail(HttpStatus.BAD_REQUEST, "Please use a real email address, not a disposable one");
        return e;
    }

    private void checkPassword(String p) {
        if (p.length() < 8 || p.length() > 72) throw fail(HttpStatus.BAD_REQUEST, "Password must be 8 to 72 characters");
    }

    private ResponseStatusException fail(HttpStatus status, String message) { return new ResponseStatusException(status, message); }
}
