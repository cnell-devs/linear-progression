-- The previous default, (now() + '01:00:00'::interval), evaluates now() as a
-- timestamptz and stores it into a timestamp-without-time-zone column using
-- the session's TimeZone. On a non-UTC database that yields a value in the
-- past, so a token created without an explicit expiresAt was born expired.
-- Anchoring to UTC makes the default match how the column is read back.
ALTER TABLE "tokens"
  ALTER COLUMN "expiresAt"
  SET DEFAULT ((now() AT TIME ZONE 'UTC') + '01:00:00'::interval);
