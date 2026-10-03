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