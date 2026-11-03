ALTER TABLE bookings DROP CONSTRAINT bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('HELD', 'CONFIRMED', 'CHECKED_IN', 'CANCELLED'));
