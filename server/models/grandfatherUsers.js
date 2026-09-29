/**
 * Grants PRO to users who existed before the paid tier, permanently and at no
 * cost. Their plan never lapses (planExpiresAt stays null) and grandfatheredAt
 * records why, so granted users stay distinguishable from paying ones.
 *
 * Only ever upgrades: a user already on PRO through a real subscription is
 * left untouched, so re-running cannot overwrite billing state.
 *
 *   node models/grandfatherUsers.js           # dry run
 *   node models/grandfatherUsers.js --apply   # writes
 *
 * Pass --before=YYYY-MM-DD to limit the grant to accounts created before a
 * cutoff; by default every existing FREE user qualifies.
 */
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");
const beforeArg = process.argv.find((a) => a.startsWith("--before="));
const CUTOFF = beforeArg ? new Date(beforeArg.split("=")[1]) : null;

async function main() {
  console.log(APPLY ? "APPLYING grants\n" : "DRY RUN — no changes\n");
  if (CUTOFF) console.log(`Cutoff: accounts active before ${CUTOFF.toISOString().slice(0, 10)}\n`);

  // Users has no createdAt, so lastLogin is the closest available proxy for
  // "existed before now" when a cutoff is supplied.
  const candidates = await prisma.users.findMany({
    where: {
      plan: "FREE",
      ...(CUTOFF ? { lastLogin: { lt: CUTOFF } } : {}),
    },
    select: {
      id: true,
      username: true,
      lastLogin: true,
      _count: { select: { sessions: true, WorkoutTemplate: true, userWorkouts: true } },
    },
    orderBy: { username: "asc" },
  });

  const alreadyPro = await prisma.users.count({ where: { plan: "PRO" } });

  if (candidates.length === 0) {
    console.log(`Nothing to grant. ${alreadyPro} user(s) already on PRO.`);
    return;
  }

  console.log("  username              sessions  templates  exercises");
  for (const u of candidates) {
    console.log(
      `  ${u.username.padEnd(20)} ${String(u._count.sessions).padStart(8)}` +
        ` ${String(u._count.WorkoutTemplate).padStart(10)}` +
        ` ${String(u._count.userWorkouts).padStart(10)}`
    );
  }

  if (APPLY) {
    const now = new Date();
    const result = await prisma.users.updateMany({
      where: { id: { in: candidates.map((u) => u.id) } },
      data: { plan: "PRO", planExpiresAt: null, grandfatheredAt: now },
    });
    console.log(`\nGranted PRO to ${result.count} user(s), no expiry.`);
  } else {
    console.log(`\nWould grant PRO to ${candidates.length} user(s). Re-run with --apply.`);
  }
  console.log(`${alreadyPro} user(s) were already on PRO and were not modified.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
