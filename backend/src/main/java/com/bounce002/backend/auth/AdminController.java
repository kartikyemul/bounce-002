package com.bounce002.backend.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    record InviteRequest(@NotBlank @Size(max = 255) String email, @NotNull Long courtId) {}

    private final AuthService auth;

    public AdminController(AuthService auth) { this.auth = auth; }

    @GetMapping("/incharges")
    public List<AuthService.StaffInfo> incharges() { return auth.staff(); }

    @PostMapping("/incharges")
    @ResponseStatus(HttpStatus.CREATED)
    public void invite(@Valid @RequestBody InviteRequest r) { auth.invite(r.email(), r.courtId()); }
}
