const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
      weight: parseInt(data.weight),
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

// The sets this user last performed for a given exercise, excluding the
// session they're in right now. Drives the "last time" reference shown
// next to each set while logging.
exports.getLastPerformance = async (userWorkoutId, userId, excludeSessionId) => {
  const lastSet = await prisma.workoutSet.findFirst({
    where: {
      userWorkoutId: parseInt(userWorkoutId),
      // "Last time" should reflect actual working performance — warm-ups
      // would otherwise shift the reference off by a row.
      completed: true,
      isWarmup: false,
      session: {
        userId,
        ...(excludeSessionId
          ? { id: { not: parseInt(excludeSessionId) } }
          : {}),
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
    entry.avgWeight = entry.sets.length
      ? Math.round(
          entry.sets.reduce((total, s) => total + s.weight, 0) /
            entry.sets.length
        )
      : 0;
  }

  return Array.from(bySession.values());
};
