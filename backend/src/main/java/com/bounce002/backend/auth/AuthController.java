package com.bounce002.backend.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    record SignupRequest(@NotBlank @Size(min = 2, max = 100) String fullName, @NotBlank @Size(max = 255) String email,
                         @NotBlank @Size(min = 8, max = 72) String password) {}
    record TokenRequest(@NotBlank String token) {}
    record LoginRequest(@NotBlank String email, @NotBlank String password) {}
    record AcceptInvite(@NotBlank String token, @NotBlank @Size(min = 2, max = 100) String fullName,
                        @NotBlank @Size(min = 8, max = 72) String password) {}

    private final AuthService auth;

    public AuthController(AuthService auth) { this.auth = auth; }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> signup(@Valid @RequestBody SignupRequest r) {
        auth.signup(r.fullName(), r.email(), r.password());
        return Map.of("message", "Account created. Check your email for the verification link.");
    }

    @PostMapping("/verify")
    public Map<String, String> verify(@Valid @RequestBody TokenRequest r) {
        auth.verify(r.token());
        return Map.of("message", "Email verified. You can log in now.");
    }

    @PostMapping("/login")
    public AuthService.LoginResult login(@Valid @RequestBody LoginRequest r) { return auth.login(r.email(), r.password()); }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader("Authorization") String header) { auth.logout(header.substring(7)); }

    @PostMapping("/accept-invite")
    public Map<String, String> acceptInvite(@Valid @RequestBody AcceptInvite r) {
        auth.acceptInvite(r.token(), r.fullName(), r.password());
        return Map.of("message", "Your account is ready. You can log in now.");
    }

    @GetMapping("/me")
    public AuthService.UserInfo me(@AuthenticationPrincipal AuthUser me) { return auth.me(me.id()); }
}
