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
