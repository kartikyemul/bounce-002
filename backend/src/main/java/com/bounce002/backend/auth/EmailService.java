package com.bounce002.backend.auth;

public interface EmailService {
    void send(String to, String subject, String body);
}
