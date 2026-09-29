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
// not a running total.
export const averageWeight = (sets = []) => {
  const working = workingSets(sets);
  if (!working.length) return 0;
  return Math.round(
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

export const formatWeight = (weight) => `${Math.round(weight).toLocaleString()} lbs`;

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
