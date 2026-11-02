package com.bounce002.backend.booking;

import com.bounce002.backend.court.CourtRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BookingService {
    private final BookingRepository bookings;
    private final CourtRepository courts;
    private final ZoneId zone;

    public BookingService(BookingRepository bookings, CourtRepository courts, @Value("${bounce.timezone}") String zone) {
        this.bookings = bookings;
        this.courts = courts;
        this.zone = ZoneId.of(zone);
    }

    public Booking book(BookingRequest req) {
        var court = courts.findById(req.courtId())
                .filter(c -> c.isActive())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Court not found"));
        String problem = SlotRules.check(req.startsAt(), zone, Instant.now());
        if (problem != null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, problem);

        var b = new Booking();
        b.setCourtId(court.getId());
        b.setStartsAt(req.startsAt());
        b.setEndsAt(req.startsAt().plus(SlotRules.LENGTH));
        try {
            return bookings.saveAndFlush(b);
        } catch (DataIntegrityViolationException e) {
            // the database exclusion rule caught an overlap, even if two people clicked at the same moment
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That slot is already booked");
        }
    }

    public List<Booking> forDay(Long courtId, LocalDate day) {
        Instant from = day.atStartOfDay(zone).toInstant();
        return bookings.findActive(courtId, from, day.plusDays(1).atStartOfDay(zone).toInstant());
    }

    public void cancel(Long id) {
        var b = bookings.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        b.setStatus("CANCELLED");
        bookings.save(b);
    }
}
