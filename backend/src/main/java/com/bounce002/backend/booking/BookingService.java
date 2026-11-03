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

    /** Every active booking from the start of today (club time) onwards, all courts. */
    public List<Booking> fromToday() {
        return bookings.findFrom(LocalDate.now(zone).atStartOfDay(zone).toInstant());
    }

    public void cancel(Long id) {
        var b = find(id);
        b.setStatus("CANCELLED");
        bookings.save(b);
    }

    public Booking toggleCheckIn(Long id) {
        var b = find(id);
        if ("CANCELLED".equals(b.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That booking was cancelled");
        }
        b.setStatus("CHECKED_IN".equals(b.getStatus()) ? "CONFIRMED" : "CHECKED_IN");
        return bookings.save(b);
    }

    private Booking find(Long id) {
        return bookings.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
    }
}
