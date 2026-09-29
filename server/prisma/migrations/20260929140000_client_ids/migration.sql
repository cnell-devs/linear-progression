-- Device-generated identifiers. A phone in a gym has no signal, so it must be
-- able to create a session and its sets locally; these ids let a later sync
-- upsert the same rows instead of duplicating them on every retry.
-- Nullable so every existing row stays valid.
ALTER TABLE "workout_session" ADD COLUMN "clientId" TEXT;
ALTER TABLE "workout_set" ADD COLUMN "clientId" TEXT;

-- Scoped uniqueness: ids only need to be unique within their owner/parent,
-- and NULLs do not collide in Postgres, so legacy rows are unaffected.
CREATE UNIQUE INDEX "workout_session_userId_clientId_key" ON "workout_session"("userId", "clientId");
CREATE UNIQUE INDEX "workout_set_sessionId_clientId_key" ON "workout_set"("sessionId", "clientId");
