DROP TABLE IF EXISTS owners CASCADE;
DROP INDEX IF EXISTS owners_email_idx;

CREATE TABLE owners (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(256),
  email        VARCHAR(256) UNIQUE,
  created_at   TIMESTAMP DEFAULT now(),
  updated_at   TIMESTAMP DEFAULT now(),
  password     VARCHAR(256)
);

CREATE UNIQUE INDEX owners_email_idx ON owners (lower(email) varchar_pattern_ops);
