package com.bounce002.backend.booking;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record BookingRequest(@NotNull Long courtId, @NotNull Instant startsAt) {
}
