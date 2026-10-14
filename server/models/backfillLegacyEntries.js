/**
 * Converts pre-set-tracking WeightEntry rows into WorkoutSessions + WorkoutSets
 * so old history appears in History and Progress alongside new workouts.
 *
 * A WeightEntry recorded one weight for an exercise on a given day and never
 * stored reps. The program behind that data was three working sets of eight at
 * the recorded weight, so each entry is reconstructed as IMPORT_SETS x
 * IMPORT_REPS. That is an estimate, and every imported session says so in its
 * notes: only the weight was actually recorded.
 *
 * Entries are skipped when a WorkoutSet already exists for that exercise on
 * that date, so running this after set-level data exists cannot duplicate it.
 *
 *   node models/backfillLegacyEntries.js           # dry run, changes nothing
 *   node models/backfillLegacyEntries.js --apply   # writes
 */
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");
const IMPORT_SETS = 3;
const IMPORT_REPS = 8;
const IMPORT_NOTE =
  "Imported from weight-only history — only the weight was recorded, " +
  `estimated as ${IMPORT_SETS} sets of ${IMPORT_REPS} reps.`;

const dateKey = (d) => new Date(d).toISOString().slice(0, 10);

async function main() {
  console.log(APPLY ? "APPLYING backfill\n" : "DRY RUN — no changes\n");

  const users = await prisma.users.findMany({ select: { id: true, username: true } });
  let totalSessions = 0;
  let totalSets = 0;
  let totalSkipped = 0;

  for (const user of users) {
    const entries = await prisma.weightEntry.findMany({
      where: { userId: user.id },
      orderBy: { date: "asc" },
    });
    if (!entries.length) continue;

    // Drop anything already represented at set level.
    const pending = [];
    for (const entry of entries) {
      const existing = await prisma.workoutSet.count({
        where: {
          userWorkoutId: entry.userWorkoutId,
          session: { userId: user.id, date: entry.date },
        },
      });
      if (existing > 0) totalSkipped++;
      else pending.push(entry);
    }
    if (!pending.length) {
      console.log(`  ${user.username}: nothing to import (${entries.length} already tracked)`);
      continue;
    }

    // One session per training day, split by template so a day that used two
    // templates stays two sessions.
    const byDay = new Map();
    for (const entry of pending) {
      const key = `${dateKey(entry.date)}|${entry.templateId ?? "none"}`;
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key).push(entry);
    }

    let userSessions = 0;
    let userSets = 0;

    for (const [key, group] of byDay) {
      const templateId = group[0].templateId;
      const template = templateId
        ? await prisma.workoutTemplate.findUnique({
            where: { id: templateId },
            include: { templateWorkouts: true },
          })
        : null;

      const date = new Date(group[0].date);

      if (APPLY) {
        const session = await prisma.workoutSession.create({
          data: {
            userId: user.id,
            templateId: template?.id ?? null,
            name: template?.name ?? "Imported Workout",
            date,
            startedAt: date,
            finishedAt: date, // marked complete so it shows in History
            notes: IMPORT_NOTE,
          },
        });

        await prisma.workoutSet.createMany({
          data: group.flatMap((entry) =>
            Array.from({ length: IMPORT_SETS }, (_, i) => ({
              sessionId: session.id,
              userWorkoutId: entry.userWorkoutId,
              setNumber: i + 1,
              weight: entry.weight,
              reps: IMPORT_REPS,
              isWarmup: false,
              completed: true,
            }))
          ),
        });
      }

      userSessions++;
      userSets += group.length;
      if (!APPLY && userSessions <= 3) {
        console.log(`    would create session ${key} with ${group.length} sets`);
      }
    }

    console.log(
      `  ${user.username}: ${userSessions} sessions, ${userSets} sets from ${pending.length} legacy entries`
    );
    totalSessions += userSessions;
    totalSets += userSets;
  }

  console.log(
    `\n${APPLY ? "Created" : "Would create"} ${totalSessions} sessions / ${totalSets} sets` +
      ` (skipped ${totalSkipped} entries already tracked at set level)`
  );
  if (!APPLY && totalSessions) console.log("Re-run with --apply to write.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
