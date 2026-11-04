package com.bounce002.backend.auth;

/** Who is making the current request. Built from a valid session token. */
public record AuthUser(Long id, String email, String role, Long courtId) {
}
