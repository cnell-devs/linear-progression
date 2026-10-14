/**
 * Reshapes already-imported sessions to the current estimate for legacy data:
 * three sets of eight at the recorded weight.
 *
 * Only the weight was ever stored in WeightEntry, so sets and reps are an
 * estimate of the program behind it. This script exists so that estimate can
 * be revised without re-running the whole backfill: it rebuilds each imported
 * exercise's sets from the one fact that is real — the weight.
 *
 * Idempotent: the sets for an imported exercise are replaced wholesale, so
 * running it repeatedly converges on the same three rows.
 *
 * Only touches sessions whose notes mark them as imported. Genuinely logged
 * workouts are never reshaped.
 *
 *   node models/reshapeImportedSets.js           # dry run
 *   node models/reshapeImportedSets.js --apply
 */
const prisma = require("./prisma");
require("dotenv").config();

const APPLY = process.argv.includes("--apply");

const IMPORT_SETS = 3;
const IMPORT_REPS = 8;
const IMPORT_NOTE =
  "Imported from weight-only history — only the weight was recorded, " +
  `estimated as ${IMPORT_SETS} sets of ${IMPORT_REPS} reps.`;

async function main() {
  console.log(APPLY ? "APPLYING reshape\n" : "DRY RUN — no changes\n");

  const sessions = await prisma.workoutSession.findMany({
    where: { notes: { startsWith: "Imported" } },
    include: { sets: true, user: { select: { username: true } } },
  });

  if (!sessions.length) {
    console.log("No imported sessions found.");
    return;
  }

  const before = sessions.reduce((n, s) => n + s.sets.length, 0);
  let after = 0;
  let exercises = 0;
  const perUser = {};

  for (const session of sessions) {
    // One group per exercise. Every set in a group came from the same legacy
    // entry, so they share the recorded weight.
    const byExercise = new Map();
    for (const set of session.sets) {
      if (!byExercise.has(set.userWorkoutId)) byExercise.set(set.userWorkoutId, []);
      byExercise.get(set.userWorkoutId).push(set);
    }
    exercises += byExercise.size;
    after += byExercise.size * IMPORT_SETS;
    perUser[session.user.username] =
      (perUser[session.user.username] || 0) + byExercise.size * IMPORT_SETS;

    if (!APPLY) continue;

    await prisma.$transaction(async (tx) => {
      for (const [userWorkoutId, sets] of byExercise) {
        const weight = Math.max(...sets.map((s) => s.weight));
        await tx.workoutSet.deleteMany({
          where: { sessionId: session.id, userWorkoutId },
        });
        await tx.workoutSet.createMany({
          data: Array.from({ length: IMPORT_SETS }, (_, i) => ({
            sessionId: session.id,
            userWorkoutId,
            setNumber: i + 1,
            weight,
            reps: IMPORT_REPS,
            isWarmup: false,
            completed: true,
          })),
        });
      }
      // Keep the note truthful about what the numbers represent.
      await tx.workoutSession.update({
        where: { id: session.id },
        data: { notes: IMPORT_NOTE },
      });
    });
  }

  console.log(`  imported sessions : ${sessions.length}`);
  console.log(`  exercise groups   : ${exercises}`);
  console.log(`  sets ${before} -> ${after} (${IMPORT_SETS} x ${IMPORT_REPS} each)`);
  console.log("  per user:", JSON.stringify(perUser));
  if (!APPLY) console.log("\nRe-run with --apply to write.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
