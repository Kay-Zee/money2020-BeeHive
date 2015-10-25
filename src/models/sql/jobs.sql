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

