package com.bounce002.backend.booking;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

/** Plain Java rules for what counts as a valid slot. No Spring, so it is easy to test. */
public final class SlotRules {
    public static final Duration LENGTH = Duration.ofHours(1);
    public static final int OPEN_HOUR = 8;
    public static final int CLOSE_HOUR = 22;

    private SlotRules() {}

    /** Returns null when the slot is fine, otherwise the reason it is not. */
    public static String check(Instant start, ZoneId zone, Instant now) {
        ZonedDateTime local = start.atZone(zone);
        if (local.getMinute() != 0 || local.getSecond() != 0 || local.getNano() != 0) {
            return "Slots start on the hour";
        }
        if (local.getHour() < OPEN_HOUR || local.getHour() >= CLOSE_HOUR) {
            return "Courts are open 8 am to 10 pm";
        }
        if (!start.isAfter(now)) {
            return "Pick a time in the future";
        }
        return null;
    }
}
