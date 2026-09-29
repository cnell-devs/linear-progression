/**
 * Seeds a realistic PPL training history for one user.
 *
 * Creates user workouts (linked to the global catalog), three templates, and
 * ~8 weeks of finished sessions with per-set weight/reps so the logger,
 * History, and Progress screens all have something to show.
 *
 * Usage:  node models/seedSampleUser.js [username]
 * Defaults to the "user" account. Re-running wipes this user's sessions,
 * templates, and workouts first, so it is safe to repeat.
 */
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

const USERNAME = process.argv[2] || "user";
const WEEKS = 8;

// The program. `start` is the working weight in week 1; `step` is how much is
// added each time the lift is trained (linear progression). `sets`/`reps` are
// the prescribed scheme that also seeds the templates.
const PROGRAM = {
  Push: [
    { name: "Bench Press", sets: 4, reps: "5", start: 155, step: 5 },
    { name: "Overhead Press", sets: 3, reps: "8", start: 85, step: 2.5 },
    { name: "Incline Bench Press", sets: 3, reps: "8-10", start: 115, step: 2.5 },
    { name: "Tricep Extensions", sets: 3, reps: "12", start: 30, step: 2.5 },
    { name: "Lateral Raises", sets: 3, reps: "15", start: 15, step: 0 },
  ],
  Pull: [
    { name: "Deadlift", sets: 3, reps: "5", start: 225, step: 10 },
    { name: "Barbell Rows", sets: 4, reps: "8", start: 135, step: 5 },
    { name: "Lat Pulldowns", sets: 3, reps: "10-12", start: 110, step: 5 },
    { name: "Barbell Curls", sets: 3, reps: "10", start: 65, step: 2.5 },
    { name: "Hammer Curls", sets: 3, reps: "12", start: 25, step: 2.5 },
    // Deliberately absent from the global catalog, so it seeds a user-created
    // exercise and the "My Exercises" library has something to manage.
    { name: "Banded Face Pulls", sets: 3, reps: "15", start: 30, step: 2.5 },
  ],
  Legs: [
    { name: "Squats", sets: 4, reps: "5", start: 185, step: 5 },
    { name: "Romanian Deadlifts", sets: 3, reps: "8", start: 155, step: 5 },
    { name: "Leg Press", sets: 3, reps: "12", start: 270, step: 10 },
    { name: "Leg Curls", sets: 3, reps: "12", start: 70, step: 5 },
    { name: "Calf Raises", sets: 4, reps: "15", start: 45, step: 2.5 },
  ],
};

// Barbell lifts can't be loaded below 5lb increments; dumbbell/machine work
// rounds to 2.5. Keeps the numbers plausible rather than arbitrary decimals.
const roundLoad = (weight, step) =>
  step >= 5 ? Math.round(weight / 5) * 5 : Math.round(weight / 2.5) * 2.5;

const parseTopReps = (reps) => {
  const match = String(reps).match(/\d+/);
  return match ? parseInt(match[0]) : 8;
};

// Deterministic pseudo-random so re-seeding produces the same history.
let rngState = 42;
const rand = () => {
  rngState = (rngState * 1103515245 + 12345) & 0x7fffffff;
  return rngState / 0x7fffffff;
};

async function main() {
  const user = await prisma.users.findUnique({ where: { username: USERNAME } });
  if (!user) {
    console.error(`No user named "${USERNAME}". Aborting.`);
    process.exit(1);
  }
  console.log(`Seeding sample data for "${USERNAME}" (${user.id})\n`);

  // --- reset this user's training data (leaves the account itself alone)
  const wiped = {
    sessions: (await prisma.workoutSession.deleteMany({ where: { userId: user.id } })).count,
    entries: (await prisma.weightEntry.deleteMany({ where: { userId: user.id } })).count,
    templates: (await prisma.workoutTemplate.deleteMany({ where: { userId: user.id } })).count,
    workouts: (await prisma.userWorkout.deleteMany({ where: { userId: user.id } })).count,
  };
  console.log("Cleared existing:", wiped);

  // --- user workouts, linked to the global catalog where a name matches
  const globals = await prisma.globalWorkout.findMany();
  const globalByName = new Map(globals.map((g) => [g.name, g]));

  const allNames = [...new Set(Object.values(PROGRAM).flat().map((e) => e.name))];
  const workoutByName = new Map();

  for (const name of allNames) {
    const globalWorkout = globalByName.get(name);
    const created = await prisma.userWorkout.create({
      data: {
        userId: user.id,
        ...(globalWorkout
          ? { globalWorkoutId: globalWorkout.id }
          : { customName: name, userCreated: true }),
      },
    });
    workoutByName.set(name, created);
  }
  console.log(
    `Created ${workoutByName.size} user workouts ` +
      `(${allNames.filter((n) => globalByName.has(n)).length} linked to global catalog)`
  );

  // --- one template per day of the split
  const templateByDay = {};
  for (const [day, exercises] of Object.entries(PROGRAM)) {
    const template = await prisma.workoutTemplate.create({
      data: {
        userId: user.id,
        name: `${day} Day`,
        description: `Linear progression ${day.toLowerCase()} session`,
        templateWorkouts: {
          create: exercises.map((e) => ({
            userWorkoutId: workoutByName.get(e.name).id,
            sets: e.sets,
            reps: e.reps,
            // Last set of the main compound is taken to failure.
            amrap: e.reps === "5" && e.step >= 5,
          })),
        },
      },
    });
    templateByDay[day] = template;
  }
  console.log(`Created ${Object.keys(templateByDay).length} templates\n`);

  // --- sessions: Push/Pull/Legs, 3 per week, walking backwards from today
  const days = Object.keys(PROGRAM);
  const today = new Date();
  let sessionCount = 0;
  let setCount = 0;
  let entryCount = 0;

  for (let week = 0; week < WEEKS; week++) {
    for (let d = 0; d < days.length; d++) {
      const day = days[d];
      const exercises = PROGRAM[day];

      // Oldest week first, sessions on Mon/Wed/Fri of each week.
      const weeksAgo = WEEKS - 1 - week;
      const date = new Date(today);
      date.setDate(today.getDate() - weeksAgo * 7 - (4 - d * 2));
      date.setHours(0, 0, 0, 0);

      // A stall week: weeks 5 repeats week 4's load instead of adding.
      const progressWeeks = week >= 5 ? week - 1 : week;

      const startedAt = new Date(date);
      startedAt.setHours(17, 30, 0, 0);
      const durationMin = 52 + Math.floor(rand() * 20);
      const finishedAt = new Date(startedAt.getTime() + durationMin * 60000);

      const session = await prisma.workoutSession.create({
        data: {
          userId: user.id,
          templateId: templateByDay[day].id,
          name: `${day} Day`,
          date,
          startedAt,
          finishedAt,
          notes:
            week === 5 && d === 0
              ? "Felt heavy today — held weight instead of adding."
              : null,
        },
      });
      sessionCount++;

      for (const [exerciseIndex, exercise] of exercises.entries()) {
        const isLastExercise = exerciseIndex === exercises.length - 1;
        const workout = workoutByName.get(exercise.name);
        const load = roundLoad(
          exercise.start + exercise.step * progressWeeks,
          exercise.step
        );
        const targetReps = parseTopReps(exercise.reps);
        let setNumber = 0;
        const setsToCreate = [];

        // Warm-up on the heavy barbell lifts only.
        if (exercise.step >= 5 && load >= 100) {
          setsToCreate.push({
            setNumber: ++setNumber,
            weight: roundLoad(load * 0.5, 5),
            reps: 10,
            isWarmup: true,
            completed: true,
            rpe: null,
          });
        }

        for (let s = 0; s < exercise.sets; s++) {
          const isLast = s === exercise.sets - 1;
          // Reps drift down slightly on later sets; AMRAP finisher goes up.
          let reps = targetReps;
          if (isLast && exercise.reps === "5" && exercise.step >= 5) {
            reps = targetReps + 1 + Math.floor(rand() * 3);
          } else if (s > 0 && rand() < 0.35) {
            reps = Math.max(1, targetReps - 1);
          }

          // In the most recent session, the final accessory's last set is left
          // unchecked — as if they ran out of time. Exercises the
          // uncompleted-set path without making the whole session look bailed.
          const completed = !(
            weeksAgo === 0 &&
            d === days.length - 1 &&
            isLastExercise &&
            isLast
          );

          setsToCreate.push({
            setNumber: ++setNumber,
            weight: load,
            reps,
            isWarmup: false,
            completed,
            rpe: isLast ? 8 + Math.floor(rand() * 2) : null,
          });
        }

        await prisma.workoutSet.createMany({
          data: setsToCreate.map((s) => ({
            ...s,
            sessionId: session.id,
            userWorkoutId: workout.id,
            weight: Math.round(s.weight),
          })),
        });
        setCount += setsToCreate.length;

        // Mirror the top set into the legacy WeightEntry table so the older
        // Profile → Stats chart shows the same history rather than nothing.
        await prisma.weightEntry.create({
          data: {
            userId: user.id,
            userWorkoutId: workout.id,
            templateId: templateByDay[day].id,
            weight: Math.round(load),
            date,
          },
        });
        entryCount++;
      }
    }
  }

  console.log(
    `Created ${sessionCount} sessions, ${setCount} sets, ${entryCount} legacy weight entries`
  );

  // --- summary of what the Progress page will chart
  const bench = workoutByName.get("Bench Press");
  const benchSets = await prisma.workoutSet.findMany({
    where: { userWorkoutId: bench.id, isWarmup: false, completed: true },
    include: { session: { select: { date: true } } },
    orderBy: { session: { date: "asc" } },
  });
  const first = benchSets[0];
  const last = benchSets[benchSets.length - 1];
  console.log(
    `\nBench Press progression: ${first.weight}lb -> ${last.weight}lb ` +
      `over ${WEEKS} weeks`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
