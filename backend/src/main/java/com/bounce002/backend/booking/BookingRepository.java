package com.bounce002.backend.booking;

import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("select b from Booking b where b.courtId = :courtId and b.startsAt >= :from "
         + "and b.startsAt < :to and b.status <> 'CANCELLED' order by b.startsAt")
    List<Booking> findActive(@Param("courtId") Long courtId, @Param("from") Instant from, @Param("to") Instant to);

    @Query("select b from Booking b where b.startsAt >= :from and b.status <> 'CANCELLED' order by b.startsAt")
    List<Booking> findFrom(@Param("from") Instant from);

    @Query("select b from Booking b where b.userId = :userId and b.startsAt >= :from and b.status <> 'CANCELLED' order by b.startsAt")
    List<Booking> findMine(@Param("userId") Long userId, @Param("from") Instant from);
}
