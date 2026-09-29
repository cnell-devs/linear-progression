// A UserWorkout's name lives in one of three places depending on whether it
// came from the global catalog, was renamed, or is fully user-created.
export const workoutName = (userWorkout) =>
  userWorkout?.customName ||
  userWorkout?.globalWorkout?.name ||
  userWorkout?.name ||
  "Unknown Exercise";

// Warm-ups and unchecked rows are excluded everywhere, so any number shown
// always agrees with the set count displayed beside it.
const workingSets = (sets = []) =>
  sets.filter((s) => !s.isWarmup && s.completed);

// Mean load across working sets — the average weight actually on the bar,
// not a running total. Kept fractional: plate increments are halves and
// quarters, so rounding to whole numbers would misreport a 137.5 average.
export const averageWeight = (sets = []) => {
  const working = workingSets(sets);
  if (!working.length) return 0;
  return roundWeight(
    working.reduce((total, s) => total + (s.weight || 0), 0) / working.length
  );
};

// Groups a flat set list into per-exercise blocks, preserving the order the
// exercises were first logged in.
export const groupSetsByWorkout = (sets = []) => {
  const groups = new Map();
  for (const set of sets) {
    if (!groups.has(set.userWorkoutId)) {
      groups.set(set.userWorkoutId, {
        userWorkoutId: set.userWorkoutId,
        userWorkout: set.userWorkout,
        name: workoutName(set.userWorkout),
        sets: [],
      });
    }
    groups.get(set.userWorkoutId).sets.push(set);
  }
  for (const group of groups.values()) {
    group.sets.sort((a, b) => a.setNumber - b.setNumber);
  }
  return Array.from(groups.values());
};

// Two decimals is enough for every plate increment in use (2.5 lb, 1.25 kg,
// 0.5 kg microplates) and absorbs any float drift from averaging.
export const roundWeight = (weight) =>
  Math.round((Number(weight) || 0) * 100) / 100;

// Trailing zeros are noise on a weight: 185 not 185.00, but 137.5 kept.
export const formatWeight = (weight) =>
  `${roundWeight(weight).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })} lbs`;

export const formatDuration = (startedAt, finishedAt) => {
  if (!startedAt) return "";
  const end = finishedAt ? new Date(finishedAt) : new Date();
  const minutes = Math.max(
    0,
    Math.round((end - new Date(startedAt)) / 1000 / 60)
  );
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};
