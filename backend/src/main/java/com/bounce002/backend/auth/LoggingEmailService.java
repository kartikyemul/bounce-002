package com.bounce002.backend.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/** Development only: prints the email in the backend log instead of sending it. A real sender replaces this later. */
@Service
public class LoggingEmailService implements EmailService {
    private static final Logger log = LoggerFactory.getLogger(LoggingEmailService.class);

    @Override
    public void send(String to, String subject, String body) {
        log.info("\n---- EMAIL (dev mode, not really sent) ----\nTo: {}\nSubject: {}\n{}\n-------------------------------------------", to, subject, body);
    }
}
