-- invited staff have no name or password until they accept the invite
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ALTER COLUMN full_name DROP NOT NULL;

CREATE TABLE auth_tokens (
  id         BIGSERIAL PRIMARY KEY,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  user_id    BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  purpose    VARCHAR(20) NOT NULL CHECK (purpose IN ('SESSION', 'VERIFY', 'INVITE')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_auth_tokens_user ON auth_tokens (user_id);
CREATE INDEX idx_bookings_user ON bookings (user_id);
