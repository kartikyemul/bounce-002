package com.bounce002.backend.auth;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Blocks a key (an email) after too many failed logins inside a time window. */
public class LoginThrottle {
    private final int max;
    private final Duration window;
    private final Clock clock;
    private final Map<String, Deque<Instant>> failures = new ConcurrentHashMap<>();

    public LoginThrottle(int max, Duration window, Clock clock) {
        this.max = max;
        this.window = window;
        this.clock = clock;
    }

    public boolean blocked(String key) {
        var d = failures.get(key);
        if (d == null) return false;
        synchronized (d) {
            prune(d);
            return d.size() >= max;
        }
    }

    public void fail(String key) {
        var d = failures.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (d) {
            prune(d);
            d.addLast(clock.instant());
        }
    }

    public void clear(String key) { failures.remove(key); }

    private void prune(Deque<Instant> d) {
        Instant cutoff = clock.instant().minus(window);
        while (!d.isEmpty() && d.peekFirst().isBefore(cutoff)) d.removeFirst();
    }
}
