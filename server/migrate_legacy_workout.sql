-- Migration script to consolidate legacy workout data
-- This script migrates the single remaining legacy workout to the UserWorkout system

BEGIN;

-- Step 1: Get the legacy workout data
-- (There's only 1 record: id=37, name="custom lift test", userId="7f7526dd-263e-4d40-bdab-395c0d1ccbf6")

-- Step 2: Create corresponding UserWorkout for the legacy workout
INSERT INTO user_workouts (
    "userId",
    "customName",
    "userCreated",
    "createdAt",
    "updatedAt"
)
SELECT
    "userId",
    name,
    true,
    NOW(),
    NOW()
FROM workout
WHERE id = 37;

-- Step 3: Get the new UserWorkout ID for reference
-- This will be used to update the related records

-- Step 4: Update WeightEntry to reference new UserWorkout
UPDATE weightentry
SET
    "userWorkoutId" = (
        SELECT id FROM user_workouts
        WHERE "userId" = '7f7526dd-263e-4d40-bdab-395c0d1ccbf6'
        AND "customName" = 'custom lift test'
        ORDER BY "createdAt" DESC
        LIMIT 1
    ),
    "workoutId" = NULL
WHERE "workoutId" = 37;

-- Step 5: Update TemplateWorkout to reference new UserWorkout
UPDATE template_workout
SET
    "userWorkoutId" = (
        SELECT id FROM user_workouts
        WHERE "userId" = '7f7526dd-263e-4d40-bdab-395c0d1ccbf6'
        AND "customName" = 'custom lift test'
        ORDER BY "createdAt" DESC
        LIMIT 1
    ),
    "workoutId" = NULL
WHERE "workoutId" = 37;

-- Step 6: Verify the migration worked correctly
-- Check that no records still reference the legacy workout
SELECT 'WeightEntry legacy references' as check_type, COUNT(*) as count
FROM weightentry WHERE "workoutId" = 37
UNION ALL
SELECT 'TemplateWorkout legacy references', COUNT(*)
FROM template_workout WHERE "workoutId" = 37;

-- Step 7: Delete the legacy workout record
DELETE FROM workout WHERE id = 37;

-- Verify the legacy table is now empty
SELECT 'Legacy workouts remaining' as check_type, COUNT(*) as count FROM workout;

COMMIT;
