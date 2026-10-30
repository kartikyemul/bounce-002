CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE courts (
  id     BIGSERIAL PRIMARY KEY,
  name   VARCHAR(50) NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE users (
  id             BIGSERIAL PRIMARY KEY,
  email          VARCHAR(255) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  full_name      VARCHAR(100) NOT NULL,
  role           VARCHAR(20) NOT NULL CHECK (role IN ('CUSTOMER', 'INCHARGE', 'ADMIN')),
  court_id       BIGINT REFERENCES courts (id),
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE bookings (
  id         BIGSERIAL PRIMARY KEY,
  court_id   BIGINT NOT NULL REFERENCES courts (id),
  user_id    BIGINT REFERENCES users (id), -- filled in once login exists
  starts_at  TIMESTAMPTZ NOT NULL,
  ends_at    TIMESTAMPTZ NOT NULL,
  status     VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('HELD', 'CONFIRMED', 'CANCELLED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at),
  -- the database itself refuses two active bookings that overlap on the same court
  EXCLUDE USING gist (court_id WITH =, tstzrange(starts_at, ends_at) WITH &&) WHERE (status <> 'CANCELLED')
);
