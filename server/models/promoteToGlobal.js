/**
 * Promotes a user's custom exercise into the shared catalog, optionally
 * renaming it on the way.
 *
 * The schema already anticipates this — GlobalWorkout carries createdBy and
 * UserWorkout carries pendingApproval — but nothing implemented it.
 *
 * History is untouched: sets and weight entries reference the UserWorkout,
 * not the catalog entry, so the row is repointed rather than replaced. Any
 * other user who already has their own copy under the same name is also
 * linked to the new catalog entry, so the catalog converges instead of
 * leaving parallel customs behind.
 *
 *   node models/promoteToGlobal.js --id=59 --name="Weighted Crunch Machine" \
 *     --muscle=core --equipment=machine
 *
 * Dry run unless --apply is passed.
 */
const prisma = require("./prisma");
require("dotenv").config();

const APPLY = process.argv.includes("--apply");
const arg = (key) => {
  const hit = process.argv.find((a) => a.startsWith(`--${key}=`));
  return hit ? hit.slice(key.length + 3) : null;
};

async function main() {
  const id = parseInt(arg("id"));
  const newName = arg("name");
  const muscleGroup = arg("muscle");
  const equipment = arg("equipment");

  if (!Number.isInteger(id)) {
    console.error('Usage: --id=<userWorkoutId> [--name="..."] [--muscle=] [--equipment=] [--apply]');
    process.exit(1);
  }

  console.log(APPLY ? "APPLYING promotion\n" : "DRY RUN — no changes\n");

  const workout = await prisma.userWorkout.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true } },
      globalWorkout: true,
      _count: { select: { sets: true, weights: true, templateWorkouts: true } },
    },
  });

  if (!workout) {
    console.error(`No user exercise with id ${id}.`);
    process.exit(1);
  }
  if (workout.globalWorkoutId) {
    console.error(
      `id ${id} already points at catalog entry "${workout.globalWorkout.name}". Nothing to promote.`
    );
    process.exit(1);
  }

  const currentName = workout.customName;
  const name = newName || currentName;

  const clash = await prisma.globalWorkout.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (clash) {
    console.error(`A catalog entry named "${clash.name}" already exists (id ${clash.id}).`);
    process.exit(1);
  }

  // Other users holding their own custom copy of the same name get linked to
  // the new entry too, rather than being left on a parallel custom row.
  const others = await prisma.userWorkout.findMany({
    where: {
      id: { not: id },
      globalWorkoutId: null,
      customName: { equals: currentName, mode: "insensitive" },
    },
    include: { user: { select: { username: true } } },
  });

  console.log(`  "${currentName}" (${workout.user.username})`);
  if (newName && newName !== currentName) console.log(`  renamed to "${name}"`);
  console.log(`  muscle group: ${muscleGroup || "—"} | equipment: ${equipment || "—"}`);
  console.log(
    `  history preserved: ${workout._count.sets} sets, ${workout._count.weights} weight entries, ${workout._count.templateWorkouts} template slots`
  );
  if (others.length) {
    console.log(`  also linking ${others.length} other user copy/copies: ${others.map((o) => o.user.username).join(", ")}`);
  }

  if (!APPLY) {
    console.log("\nRe-run with --apply to write.");
    return;
  }

  const result = await prisma.$transaction(async (tx) => {
    const global = await tx.globalWorkout.create({
      data: {
        name,
        muscleGroup: muscleGroup || null,
        equipment: equipment || null,
        isApproved: true,
        createdBy: workout.user.id, // attribution for whoever suggested it
      },
    });

    // Repoint rather than recreate: every set already hangs off this row.
    await tx.userWorkout.update({
      where: { id },
      data: {
        globalWorkoutId: global.id,
        customName: null,
        userCreated: false,
        pendingApproval: false,
      },
    });

    for (const other of others) {
      await tx.userWorkout.update({
        where: { id: other.id },
        data: {
          globalWorkoutId: global.id,
          customName: null,
          userCreated: false,
          pendingApproval: false,
        },
      });
    }

    return global;
  });

  console.log(`\nCreated catalog entry ${result.id} "${result.name}" and linked ${1 + others.length} user exercise(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
