package com.bounce002.backend.auth;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;

class AuthRulesTest {
    static class MutableClock extends Clock {
        Instant now = Instant.parse("2026-11-01T00:00:00Z");
        public ZoneId getZone() { return ZoneOffset.UTC; }
        public Clock withZone(ZoneId zone) { return this; }
        public Instant instant() { return now; }
    }

    @Test
    void blocksDisposableDomains() {
        assertTrue(DisposableEmails.isDisposable("someone@mailinator.com"));
        assertFalse(DisposableEmails.isDisposable("someone@gmail.com"));
    }

    @Test
    void throttleBlocksAfterTooManyFailuresAndClearResets() {
        var t = new LoginThrottle(3, Duration.ofMinutes(15), Clock.systemUTC());
        for (int i = 0; i < 3; i++) t.fail("a@b.com");
        assertTrue(t.blocked("a@b.com"));
        t.clear("a@b.com");
        assertFalse(t.blocked("a@b.com"));
    }

    @Test
    void throttleForgetsOldFailures() {
        var clock = new MutableClock();
        var t = new LoginThrottle(2, Duration.ofMinutes(15), clock);
        t.fail("a@b.com");
        t.fail("a@b.com");
        assertTrue(t.blocked("a@b.com"));
        clock.now = clock.now.plus(Duration.ofMinutes(16));
        assertFalse(t.blocked("a@b.com"));
    }
}
