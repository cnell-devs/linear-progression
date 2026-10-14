/**
 * Merges duplicate exercises belonging to the same user.
 *
 * The autocomplete could not surface a user's own custom exercise, so adding
 * one to a second template found nothing and a new row was created instead.
 * History then split across both copies.
 *
 * For each group of same-named exercises per user, the row with the most
 * history wins; sets, weight entries and template slots are repointed onto it
 * and the losers are deleted. Nothing is discarded except a losing row's
 * template slot where the winner already occupies that template, since
 * template_workout is unique on (templateId, userWorkoutId).
 *
 *   node models/mergeDuplicateWorkouts.js           # dry run
 *   node models/mergeDuplicateWorkouts.js --apply
 */
const prisma = require("./prisma");
require("dotenv").config();

const APPLY = process.argv.includes("--apply");

const nameOf = (w) =>
  (w.customName || w.globalWorkout?.name || "").trim().toLowerCase();

async function main() {
  console.log(APPLY ? "APPLYING merges\n" : "DRY RUN — no changes\n");

  const all = await prisma.userWorkout.findMany({
    include: {
      user: { select: { username: true } },
      globalWorkout: true,
      _count: { select: { sets: true, weights: true, templateWorkouts: true } },
    },
  });

  const groups = new Map();
  for (const w of all) {
    const key = `${w.userId}|${nameOf(w)}`;
    if (!nameOf(w)) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }

  const dupes = [...groups.values()].filter((g) => g.length > 1);
  if (!dupes.length) {
    console.log("No duplicates found.");
    return;
  }

  let merged = 0;
  let movedSets = 0;
  let movedEntries = 0;
  let movedSlots = 0;
  let droppedSlots = 0;

  for (const group of dupes) {
    // Keep the row carrying the most history; ties break toward the oldest id
    // so the surviving record is the one the user has had longest.
    const sorted = [...group].sort((a, b) => {
      const score = (w) =>
        w._count.sets + w._count.weights + w._count.templateWorkouts;
      return score(b) - score(a) || a.id - b.id;
    });
    const [winner, ...losers] = sorted;
    const label = winner.customName || winner.globalWorkout?.name;

    console.log(
      `  "${label}" (${winner.user.username}): keep id=${winner.id}, ` +
        `merge ${losers.map((l) => l.id).join(", ")}`
    );

    for (const loser of losers) {
      if (!APPLY) {
        movedSets += loser._count.sets;
        movedEntries += loser._count.weights;
        movedSlots += loser._count.templateWorkouts;
        continue;
      }

      await prisma.$transaction(async (tx) => {
        const s = await tx.workoutSet.updateMany({
          where: { userWorkoutId: loser.id },
          data: { userWorkoutId: winner.id },
        });
        const e = await tx.weightEntry.updateMany({
          where: { userWorkoutId: loser.id },
          data: { userWorkoutId: winner.id },
        });
        movedSets += s.count;
        movedEntries += e.count;

        // Template slots can collide: if the winner is already in a template
        // the loser also sits in, that slot cannot be repointed.
        const slots = await tx.templateWorkout.findMany({
          where: { userWorkoutId: loser.id },
        });
        for (const slot of slots) {
          const taken = await tx.templateWorkout.findFirst({
            where: { templateId: slot.templateId, userWorkoutId: winner.id },
          });
          if (taken) {
            await tx.templateWorkout.delete({ where: { id: slot.id } });
            droppedSlots++;
          } else {
            await tx.templateWorkout.update({
              where: { id: slot.id },
              data: { userWorkoutId: winner.id },
            });
            movedSlots++;
          }
        }

        await tx.userWorkout.delete({ where: { id: loser.id } });
      });
      merged++;
    }
  }

  console.log(
    `\n${APPLY ? "Merged" : "Would merge"} ${
      APPLY ? merged : dupes.reduce((n, g) => n + g.length - 1, 0)
    } duplicate row(s): ` +
      `${movedSets} sets, ${movedEntries} weight entries, ${movedSlots} template slots moved` +
      (droppedSlots ? `, ${droppedSlots} redundant template slot(s) removed` : "")
  );
  if (!APPLY) console.log("Re-run with --apply to write.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
