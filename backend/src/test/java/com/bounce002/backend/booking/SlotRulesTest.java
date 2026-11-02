package com.bounce002.backend.booking;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.time.Instant;
import java.time.ZoneId;
import org.junit.jupiter.api.Test;

class SlotRulesTest {
    private final ZoneId zone = ZoneId.of("Asia/Kolkata");
    private final Instant now = Instant.parse("2026-11-01T00:00:00Z");

    @Test
    void acceptsAnHourlySlotInsideOpeningTimes() {
        // 10:00 local time on 2 Nov
        assertNull(SlotRules.check(Instant.parse("2026-11-02T04:30:00Z"), zone, now));
    }

    @Test
    void rejectsAHalfHourStart() {
        assertEquals("Slots start on the hour", SlotRules.check(Instant.parse("2026-11-02T05:00:00Z"), zone, now));
    }

    @Test
    void rejectsLateNight() {
        // 23:00 local time
        assertEquals("Courts are open 8 am to 10 pm", SlotRules.check(Instant.parse("2026-11-02T17:30:00Z"), zone, now));
    }

    @Test
    void rejectsThePast() {
        assertEquals("Pick a time in the future", SlotRules.check(Instant.parse("2026-10-31T04:30:00Z"), zone, now));
    }
}
