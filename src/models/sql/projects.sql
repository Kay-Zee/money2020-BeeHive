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
