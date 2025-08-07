SELECT 'Legacy Workout table count:' as table_name, COUNT(*) as count FROM workout
UNION ALL
SELECT 'UserWorkout table count:', COUNT(*) FROM user_workouts
UNION ALL
SELECT 'GlobalWorkout table count:', COUNT(*) FROM global_workouts
UNION ALL
SELECT 'WeightEntry with workoutId count:', COUNT(*) FROM weightentry WHERE "workoutId" IS NOT NULL
UNION ALL
SELECT 'WeightEntry with userWorkoutId count:', COUNT(*) FROM weightentry WHERE "userWorkoutId" IS NOT NULL
UNION ALL
SELECT 'TemplateWorkout with workoutId count:', COUNT(*) FROM template_workout WHERE "workoutId" IS NOT NULL
UNION ALL
SELECT 'TemplateWorkout with userWorkoutId count:', COUNT(*) FROM template_workout WHERE "userWorkoutId" IS NOT NULL;
