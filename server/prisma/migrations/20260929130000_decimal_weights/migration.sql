-- Weight was an integer, so 2.5 lb / 1.25 kg increments could not be logged.
-- Microloading is central to linear progression, so this is a correctness fix
-- rather than a nicety. Widening is lossless; every existing whole-number
-- value is representable exactly.
--
-- double precision rather than numeric: plate increments (.5, .25, .125, and
-- their kg equivalents) are all binary-exact, arithmetic stays plain JS
-- numbers, and JSON keeps numeric types instead of Prisma Decimal strings.
ALTER TABLE "workout_set" ALTER COLUMN "weight" TYPE DOUBLE PRECISION;
ALTER TABLE "weightentry" ALTER COLUMN "weight" TYPE DOUBLE PRECISION;
