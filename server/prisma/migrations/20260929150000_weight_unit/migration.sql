-- Display/input unit preference. Weights stay stored in pounds — every
-- existing row is already in pounds — and are converted at the edges, so
-- switching units never rewrites or reinterprets history.
CREATE TYPE "WeightUnit" AS ENUM ('LB', 'KG');
ALTER TABLE "users" ADD COLUMN "weightUnit" "WeightUnit" NOT NULL DEFAULT 'LB';
