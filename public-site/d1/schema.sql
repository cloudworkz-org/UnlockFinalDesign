-- Audit record: one row per self-certification.
CREATE TABLE IF NOT EXISTS certifications (
  id                TEXT PRIMARY KEY,
  certified_at      TEXT NOT NULL,   -- ISO 8601 UTC
  category          TEXT NOT NULL,   -- hnw | sophisticated | self-sophisticated
  statement_version TEXT NOT NULL,   -- wording version shown (STATEMENT_VERSION)
  ip                TEXT,            -- CF-Connecting-IP
  user_agent        TEXT,
  expires_at        TEXT NOT NULL    -- ISO 8601 UTC, fixed at certification
);
CREATE INDEX IF NOT EXISTS certifications_at ON certifications (certified_at);
