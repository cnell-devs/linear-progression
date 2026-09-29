const prisma = require("./prisma");

// Everything the client needs to render a session card / logger screen.
const sessionInclude = {
  template: {
    select: { id: true, name: true },
  },
  sets: {
    orderBy: [{ userWorkoutId: "asc" }, { setNumber: "asc" }],
    include: {
      userWorkout: {
        include: { globalWorkout: true },
      },
    },
  },
};

exports.createSession = async (userId, { templateId, name, date, notes }) => {
  return prisma.workoutSession.create({
    data: {
      userId,
      name: name || null,
      notes: notes || null,
      ...(templateId ? { templateId: parseInt(templateId) } : {}),
      ...(date ? { date: new Date(date) } : {}),
    },
    include: sessionInclude,
  });
};

// The session the user is currently in the middle of, if any. Lets the app
// drop them back into their workout after a refresh or a phone lock.
exports.getActiveSession = async (userId) => {
  return prisma.workoutSession.findFirst({
    where: { userId, finishedAt: null },
    orderBy: { startedAt: "desc" },
    include: sessionInclude,
  });
};

exports.getSessions = async (userId, { take = 20, skip = 0 } = {}) => {
  return prisma.workoutSession.findMany({
    where: { userId },
    orderBy: [{ date: "desc" }, { startedAt: "desc" }],
    take,
    skip,
    include: sessionInclude,
  });
};

exports.getSessionById = async (id, userId) => {
  return prisma.workoutSession.findFirst({
    where: { id: parseInt(id), userId },
    include: sessionInclude,
  });
};

exports.updateSession = async (id, userId, data) => {
  const existing = await prisma.workoutSession.findFirst({
    where: { id: parseInt(id), userId },
    select: { id: true },
  });
  if (!existing) return null;

  return prisma.workoutSession.update({
    where: { id: existing.id },
    data,
    include: sessionInclude,
  });
};

exports.deleteSession = async (id, userId) => {
  const existing = await prisma.workoutSession.findFirst({
    where: { id: parseInt(id), userId },
    select: { id: true },
  });
  if (!existing) return null;

  return prisma.workoutSession.delete({ where: { id: existing.id } });
};

// Confirms the workout belongs to the requesting user before any set is
// attached to it, so one user can never log sets onto another's exercise.
exports.userOwnsWorkout = async (userWorkoutId, userId) => {
  const workout = await prisma.userWorkout.findFirst({
    where: { id: parseInt(userWorkoutId), userId },
    select: { id: true },
  });
  return Boolean(workout);
};

exports.addSet = async (sessionId, data) => {
  return prisma.workoutSet.create({
    data: {
      sessionId: parseInt(sessionId),
      userWorkoutId: parseInt(data.userWorkoutId),
      setNumber: parseInt(data.setNumber),
      weight: parseFloat(data.weight),
      reps: parseInt(data.reps),
      rpe: data.rpe === undefined || data.rpe === null ? null : parseInt(data.rpe),
      isWarmup: Boolean(data.isWarmup),
      completed: data.completed === undefined ? true : Boolean(data.completed),
    },
    include: {
      userWorkout: { include: { globalWorkout: true } },
    },
  });
};

exports.updateSet = async (id, userId, data) => {
  const existing = await prisma.workoutSet.findFirst({
    where: { id: parseInt(id), session: { userId } },
    select: { id: true },
  });
  if (!existing) return null;

  return prisma.workoutSet.update({
    where: { id: existing.id },
    data,
    include: {
      userWorkout: { include: { globalWorkout: true } },
    },
  });
};

exports.deleteSet = async (id, userId) => {
  const existing = await prisma.workoutSet.findFirst({
    where: { id: parseInt(id), session: { userId } },
    select: { id: true },
  });
  if (!existing) return null;

  return prisma.workoutSet.delete({ where: { id: existing.id } });
};

// Upserts an entire session from a device, keyed by its client id.
//
// The client owns the document while a workout is in progress and may sync it
// many times — or replay the same sync after a failure — so this has to be
// idempotent and must converge on exactly the payload it was given. Sets
// absent from the payload were deleted on the device and are removed here.
//
// Runs in a transaction: a partially-applied workout is worse than a failed
// sync, because the device would then reconcile against a torn session.
exports.syncSession = async (userId, payload) => {
  const { clientId, sets = [] } = payload;
  if (!clientId) throw new Error("clientId is required");

  // Sets may only reference the caller's own exercises.
  const workoutIds = [
    ...new Set(sets.map((s) => parseInt(s.userWorkoutId)).filter(Number.isInteger)),
  ];
  const owned = await prisma.userWorkout.findMany({
    where: { id: { in: workoutIds }, userId },
    select: { id: true },
  });
  const ownedIds = new Set(owned.map((w) => w.id));
  const validSets = sets.filter((s) => ownedIds.has(parseInt(s.userWorkoutId)));

  return prisma.$transaction(async (tx) => {
    const existing = await tx.workoutSession.findUnique({
      where: { userId_clientId: { userId, clientId } },
      select: { id: true },
    });

    const data = {
      name: payload.name ?? null,
      notes: payload.notes ?? null,
      templateId: payload.templateId ? parseInt(payload.templateId) : null,
      ...(payload.date ? { date: new Date(payload.date) } : {}),
      ...(payload.startedAt ? { startedAt: new Date(payload.startedAt) } : {}),
      finishedAt: payload.finishedAt ? new Date(payload.finishedAt) : null,
    };

    const session = existing
      ? await tx.workoutSession.update({ where: { id: existing.id }, data })
      : await tx.workoutSession.create({ data: { ...data, userId, clientId } });

    // Converge the set list on the payload.
    const keep = validSets.map((s) => s.clientId).filter(Boolean);
    await tx.workoutSet.deleteMany({
      where: {
        sessionId: session.id,
        ...(keep.length ? { clientId: { notIn: keep } } : {}),
      },
    });

    for (const set of validSets) {
      const fields = {
        userWorkoutId: parseInt(set.userWorkoutId),
        setNumber: parseInt(set.setNumber),
        weight: parseFloat(set.weight) || 0,
        reps: parseInt(set.reps) || 0,
        rpe: set.rpe === undefined || set.rpe === null ? null : parseInt(set.rpe),
        isWarmup: Boolean(set.isWarmup),
        completed: Boolean(set.completed),
      };
      await tx.workoutSet.upsert({
        where: { sessionId_clientId: { sessionId: session.id, clientId: set.clientId } },
        create: { ...fields, sessionId: session.id, clientId: set.clientId },
        update: fields,
      });
    }

    return tx.workoutSession.findUnique({
      where: { id: session.id },
      include: sessionInclude,
    });
  });
};

// The sets this user last performed for a given exercise, excluding the
// session they're in right now. Drives the "last time" reference shown
// next to each set while logging.
exports.getLastPerformance = async (userWorkoutId, userId, excludeSessionId) => {
  // Comes straight off the query string, so it may be absent or junk; only
  // apply the exclusion when it is actually an id.
  const excludeId = parseInt(excludeSessionId);
  const hasExclude = Number.isInteger(excludeId);
  const lastSet = await prisma.workoutSet.findFirst({
    where: {
      userWorkoutId: parseInt(userWorkoutId),
      // "Last time" should reflect actual working performance — warm-ups
      // would otherwise shift the reference off by a row.
      completed: true,
      isWarmup: false,
      session: {
        userId,
        ...(hasExclude ? { id: { not: excludeId } } : {}),
      },
    },
    orderBy: [{ session: { date: "desc" } }, { createdAt: "desc" }],
    select: { sessionId: true },
  });

  if (!lastSet) return null;

  const sets = await prisma.workoutSet.findMany({
    where: {
      sessionId: lastSet.sessionId,
      userWorkoutId: parseInt(userWorkoutId),
      completed: true,
      isWarmup: false,
    },
    orderBy: { setNumber: "asc" },
  });

  const session = await prisma.workoutSession.findUnique({
    where: { id: lastSet.sessionId },
    select: { id: true, date: true, name: true },
  });

  return { session, sets };
};

// Per-session rollups for one exercise: heaviest set and total volume over
// time. This is what makes "same weight, more reps" visible as progress.
exports.getWorkoutHistory = async (userWorkoutId, userId) => {
  const sets = await prisma.workoutSet.findMany({
    where: {
      userWorkoutId: parseInt(userWorkoutId),
      session: { userId },
      isWarmup: false,
      // Rows the user left unchecked were never performed, so they must not
      // inflate volume, rep counts, or the 1RM estimate.
      completed: true,
    },
    include: {
      session: { select: { id: true, date: true, name: true } },
    },
    orderBy: [{ session: { date: "asc" } }, { setNumber: "asc" }],
  });

  const bySession = new Map();
  for (const set of sets) {
    const key = set.sessionId;
    if (!bySession.has(key)) {
      bySession.set(key, {
        sessionId: key,
        date: set.session.date,
        name: set.session.name,
        sets: [],
        topWeight: 0,
        avgWeight: 0,
        totalVolume: 0,
        totalReps: 0,
        estimatedOneRepMax: 0,
      });
    }
    const entry = bySession.get(key);
    entry.sets.push({
      setNumber: set.setNumber,
      weight: set.weight,
      reps: set.reps,
      rpe: set.rpe,
    });
    entry.topWeight = Math.max(entry.topWeight, set.weight);
    entry.totalVolume += set.weight * set.reps;
    entry.totalReps += set.reps;
    // Epley formula, the same estimate Hevy-style apps chart.
    const e1rm = Math.round(set.weight * (1 + set.reps / 30));
    entry.estimatedOneRepMax = Math.max(entry.estimatedOneRepMax, e1rm);
  }

  // Mean load across the session's working sets, rounded to whole pounds.
  for (const entry of bySession.values()) {
    // Rounded to two decimals, not to a whole number: a session of 137.5 and
    // 140 averages 138.75, and reporting 139 would be wrong.
    entry.avgWeight = entry.sets.length
      ? Math.round(
          (entry.sets.reduce((total, s) => total + s.weight, 0) /
            entry.sets.length) *
            100
        ) / 100
      : 0;
  }

  return Array.from(bySession.values());
};
