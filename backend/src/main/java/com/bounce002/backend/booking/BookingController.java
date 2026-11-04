package com.bounce002.backend.booking;

import com.bounce002.backend.auth.AuthUser;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService service;

    public BookingController(BookingService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking create(@Valid @RequestBody BookingRequest req, @AuthenticationPrincipal AuthUser me) {
        return service.book(req, me);
    }

    @GetMapping
    public List<Booking> forDay(@RequestParam Long courtId, @RequestParam LocalDate date) {
        return service.forDay(courtId, date);
    }

    @GetMapping("/upcoming")
    public List<Booking> fromToday() { return service.fromToday(); }

    @GetMapping("/mine")
    public List<Booking> mine(@AuthenticationPrincipal AuthUser me) { return service.mine(me); }

    @PatchMapping("/{id}/check-in")
    public Booking checkIn(@PathVariable Long id, @AuthenticationPrincipal AuthUser me) { return service.toggleCheckIn(id, me); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(@PathVariable Long id, @AuthenticationPrincipal AuthUser me) { service.cancel(id, me); }
}
