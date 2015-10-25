CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS workers CASCADE;
DROP INDEX IF EXISTS workers_email_idx;

CREATE TABLE workers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  braintree_id      TEXT NOT NULL,
  name              VARCHAR(256),
  email             VARCHAR(256) UNIQUE,
  created_at        TIMESTAMP DEFAULT now(),
  updated_at        TIMESTAMP DEFAULT now(),
  password          VARCHAR(256),
  tags              TEXT[],
  sub_merchant_json JSON
);

CREATE UNIQUE INDEX workers_email_idx ON workers (lower(email) varchar_pattern_ops);
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
DROP TABLE IF EXISTS jobs CASCADE;

CREATE TABLE jobs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        VARCHAR(256),
  cost         INTEGER,
  project_id   UUID NOT NULL,
  accepted_worker_id UUID,
  created_at   TIMESTAMP DEFAULT now(),
  updated_at   TIMESTAMP DEFAULT now(),
  tags         TEXT[],
  paid         BOOLEAN DEFAULT false
);

DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE projects (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        VARCHAR(256),
  description  TEXT,
  owner_id     UUID NOT NULL,
  created_at   TIMESTAMP DEFAULT now(),
  updated_at   TIMESTAMP DEFAULT now(),
  tags         TEXT[]
);
