/**
 * Seeds the shared exercise catalog.
 *
 * Replaces seedGlobalWorkouts.js, which still passed a `category` column that
 * was dropped from GlobalWorkout and would now fail on every row.
 *
 * Idempotent: upserts by name, so re-running adds new entries and refreshes
 * muscleGroup/equipment on existing ones without touching the UserWorkout
 * rows that reference them.
 *
 *   node models/seedExerciseCatalog.js           # dry run
 *   node models/seedExerciseCatalog.js --apply
 */
const prisma = require("./prisma");
require("dotenv").config();

const APPLY = process.argv.includes("--apply");

// [name, muscleGroup, equipment]
const CATALOG = [
  // ---- Chest
  ["Bench Press", "chest", "barbell"],
  ["Incline Bench Press", "chest", "barbell"],
  ["Decline Bench Press", "chest", "barbell"],
  ["Close Grip Bench Press", "triceps", "barbell"],
  ["Paused Bench Press", "chest", "barbell"],
  ["Floor Press", "chest", "barbell"],
  ["Dumbbell Bench Press", "chest", "dumbbell"],
  ["Dumbbell Incline Press", "chest", "dumbbell"],
  ["Dumbbell Decline Press", "chest", "dumbbell"],
  ["Dumbbell Fly", "chest", "dumbbell"],
  ["Incline Dumbbell Fly", "chest", "dumbbell"],
  ["Cable Fly", "chest", "cable"],
  ["Low to High Cable Fly", "chest", "cable"],
  ["High to Low Cable Fly", "chest", "cable"],
  ["Cable Crossover", "chest", "cable"],
  ["Machine Chest Press", "chest", "machine"],
  ["Incline Machine Press", "chest", "machine"],
  ["Pec Deck", "chest", "machine"],
  ["Smith Machine Bench Press", "chest", "machine"],
  ["Push Ups", "chest", "bodyweight"],
  ["Incline Push Ups", "chest", "bodyweight"],
  ["Decline Push Ups", "chest", "bodyweight"],
  ["Chest Dips", "chest", "bodyweight"],

  // ---- Back
  ["Deadlift", "back", "barbell"],
  ["Sumo Deadlift", "back", "barbell"],
  ["Deficit Deadlift", "back", "barbell"],
  ["Rack Pulls", "back", "barbell"],
  ["Barbell Rows", "back", "barbell"],
  ["Pendlay Rows", "back", "barbell"],
  ["T-Bar Row", "back", "barbell"],
  ["Meadows Row", "back", "barbell"],
  ["Dumbbell Rows", "back", "dumbbell"],
  ["Chest Supported Dumbbell Row", "back", "dumbbell"],
  ["Cable Rows", "back", "machine"],
  ["Seated Row", "back", "machine"],
  ["Lat Pulldowns", "back", "machine"],
  ["Wide Grip Lat Pulldown", "back", "machine"],
  ["Close Grip Lat Pulldown", "back", "machine"],
  ["Straight Arm Pulldown", "back", "cable"],
  ["Machine Row", "back", "machine"],
  ["Pull Ups", "back", "bodyweight"],
  ["Chin Ups", "back", "bodyweight"],
  ["Neutral Grip Pull Ups", "back", "bodyweight"],
  ["Inverted Rows", "back", "bodyweight"],
  ["Shrugs", "traps", "barbell"],
  ["Dumbbell Shrugs", "traps", "dumbbell"],
  ["Face Pulls", "rear delts", "cable"],
  ["Banded Face Pulls", "rear delts", "band"],
  ["Back Extensions", "lower back", "bodyweight"],
  ["Good Mornings", "lower back", "barbell"],

  // ---- Shoulders
  ["Overhead Press", "shoulders", "barbell"],
  ["Push Press", "shoulders", "barbell"],
  ["Seated Overhead Press", "shoulders", "barbell"],
  ["Behind the Neck Press", "shoulders", "barbell"],
  ["Dumbbell Shoulder Press", "shoulders", "dumbbell"],
  ["Arnold Press", "shoulders", "dumbbell"],
  ["Lateral Raises", "shoulders", "dumbbell"],
  ["Cable Lateral Raise", "shoulders", "cable"],
  ["Front Raises", "shoulders", "dumbbell"],
  ["Rear Delt Fly", "rear delts", "dumbbell"],
  ["Reverse Pec Deck", "rear delts", "machine"],
  ["Machine Shoulder Press", "shoulders", "machine"],
  ["Upright Rows", "shoulders", "barbell"],

  // ---- Biceps
  ["Barbell Curls", "biceps", "barbell"],
  ["EZ Bar Curls", "biceps", "barbell"],
  ["Dumbbell Curls", "biceps", "dumbbell"],
  ["Hammer Curls", "biceps", "dumbbell"],
  ["Incline Dumbbell Curls", "biceps", "dumbbell"],
  ["Concentration Curls", "biceps", "dumbbell"],
  ["Preacher Curls", "biceps", "barbell"],
  ["Cable Curls", "biceps", "cable"],
  ["Spider Curls", "biceps", "dumbbell"],
  ["Reverse Curls", "forearms", "barbell"],
  ["Wrist Curls", "forearms", "dumbbell"],

  // ---- Triceps
  ["Tricep Extensions", "triceps", "dumbbell"],
  ["Overhead Tricep Extension", "triceps", "dumbbell"],
  ["Skull Crushers", "triceps", "barbell"],
  ["Tricep Pushdown", "triceps", "cable"],
  ["Rope Pushdown", "triceps", "cable"],
  ["Tricep Dips", "triceps", "bodyweight"],
  ["Bench Dips", "triceps", "bodyweight"],
  ["Tricep Kickbacks", "triceps", "dumbbell"],
  ["Diamond Push Ups", "triceps", "bodyweight"],

  // ---- Quads
  ["Squats", "quads", "barbell"],
  ["Front Squats", "quads", "barbell"],
  ["Paused Squats", "quads", "barbell"],
  ["Box Squats", "quads", "barbell"],
  ["Hack Squat", "quads", "machine"],
  ["Smith Machine Squat", "quads", "machine"],
  ["Goblet Squat", "quads", "dumbbell"],
  ["Leg Press", "quads", "machine"],
  ["Leg Extensions", "quads", "machine"],
  ["Lunges", "quads", "dumbbell"],
  ["Walking Lunges", "quads", "dumbbell"],
  ["Reverse Lunges", "quads", "dumbbell"],
  ["Bulgarian Split Squats", "quads", "dumbbell"],
  ["Step Ups", "quads", "dumbbell"],
  ["Sissy Squats", "quads", "bodyweight"],

  // ---- Hamstrings / Glutes
  ["Romanian Deadlifts", "hamstrings", "barbell"],
  ["Dumbbell Romanian Deadlift", "hamstrings", "dumbbell"],
  ["Stiff Leg Deadlift", "hamstrings", "barbell"],
  ["Leg Curls", "hamstrings", "machine"],
  ["Seated Leg Curl", "hamstrings", "machine"],
  ["Nordic Curls", "hamstrings", "bodyweight"],
  ["Hip Thrusts", "glutes", "barbell"],
  ["Glute Bridge", "glutes", "barbell"],
  ["Cable Kickbacks", "glutes", "cable"],
  ["Hip Abduction", "glutes", "machine"],
  ["Hip Adduction", "adductors", "machine"],

  // ---- Calves
  ["Calf Raises", "calves", "dumbbell"],
  ["Standing Calf Raise", "calves", "machine"],
  ["Seated Calf Raise", "calves", "machine"],
  ["Leg Press Calf Raise", "calves", "machine"],

  // ---- Core
  ["Plank", "core", "bodyweight"],
  ["Side Plank", "core", "bodyweight"],
  ["Hanging Leg Raise", "core", "bodyweight"],
  ["Cable Crunch", "core", "cable"],
  ["Ab Wheel Rollout", "core", "bodyweight"],
  ["Russian Twists", "core", "bodyweight"],
  ["Sit Ups", "core", "bodyweight"],
  ["Crunches", "core", "bodyweight"],
  ["Decline Sit Ups", "core", "bodyweight"],
  ["Mountain Climbers", "core", "bodyweight"],
  ["Farmers Walk", "core", "dumbbell"],
  ["Pallof Press", "core", "cable"],

  // ---- Olympic / power
  ["Power Clean", "full body", "barbell"],
  ["Hang Clean", "full body", "barbell"],
  ["Clean and Jerk", "full body", "barbell"],
  ["Snatch", "full body", "barbell"],
  ["Box Jumps", "full body", "bodyweight"],
  ["Kettlebell Swing", "full body", "kettlebell"],
  ["Thrusters", "full body", "barbell"],
  ["Burpees", "full body", "bodyweight"],

  // ---- Cardio
  ["Treadmill Running", "full body", "machine"],
  ["Elliptical", "full body", "machine"],
  ["Stationary Bike", "legs", "machine"],
  ["Rowing Machine", "full body", "machine"],
  ["Stair Climber", "legs", "machine"],
  ["Jump Rope", "full body", "bodyweight"],
  ["Assault Bike", "full body", "machine"],
  ["Incline Walk", "legs", "machine"],
];

async function main() {
  console.log(APPLY ? "APPLYING catalog\n" : "DRY RUN — no changes\n");

  const existing = await prisma.globalWorkout.findMany({ select: { name: true } });
  const existingNames = new Set(existing.map((g) => g.name));

  const toCreate = CATALOG.filter(([name]) => !existingNames.has(name));
  const toUpdate = CATALOG.filter(([name]) => existingNames.has(name));
  const orphans = [...existingNames].filter(
    (n) => !CATALOG.some(([name]) => name === n)
  );

  console.log(`  catalog entries : ${CATALOG.length}`);
  console.log(`  already present : ${toUpdate.length}`);
  console.log(`  new             : ${toCreate.length}`);
  if (orphans.length) {
    console.log(`  in db but not in catalog (left alone): ${orphans.join(", ")}`);
  }

  if (!APPLY) {
    console.log(`\nWould add ${toCreate.length}. Re-run with --apply.`);
    return;
  }

  let created = 0;
  let updated = 0;
  for (const [name, muscleGroup, equipment] of CATALOG) {
    // Upsert by name so existing rows — and the UserWorkouts pointing at
    // them — keep their ids.
    const before = existingNames.has(name);
    await prisma.globalWorkout.upsert({
      where: { name },
      create: { name, muscleGroup, equipment, isApproved: true },
      update: { muscleGroup, equipment },
    });
    before ? updated++ : created++;
  }

  const total = await prisma.globalWorkout.count();
  console.log(`\nCreated ${created}, refreshed ${updated}. Catalog now ${total} exercises.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
