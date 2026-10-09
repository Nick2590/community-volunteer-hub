CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('VOLUNTEER', 'ORGANIZATION')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days')
);

-- For databases created before session expiration was added
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days');

CREATE INDEX IF NOT EXISTS sessions_user_id_idx
  ON sessions(user_id);

CREATE INDEX IF NOT EXISTS sessions_expires_at_idx
  ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS volunteer_signups (
  id UUID PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  volunteer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  signup_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED'
    CHECK (status IN ('CONFIRMED', 'CANCELED')),

  CONSTRAINT volunteer_signups_project_volunteer_unique
    UNIQUE (project_id, volunteer_id)
);

CREATE INDEX IF NOT EXISTS volunteer_signups_project_id_idx
  ON volunteer_signups(project_id);

CREATE INDEX IF NOT EXISTS volunteer_signups_volunteer_id_idx
  ON volunteer_signups(volunteer_id);