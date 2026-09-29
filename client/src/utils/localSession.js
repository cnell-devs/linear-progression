const KEY = "activeSession";
const DIRTY_KEY = "activeSessionDirty";

// A workout in progress lives on the device, not the server. Gyms have poor
// signal, and a set that fails to POST is a set the user has to remember. The
// session is written to localStorage on every change and synced opportunis-
// tically; losing connectivity mid-workout is invisible.

export const newId = () =>
  (crypto.randomUUID && crypto.randomUUID()) ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const readSession = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const writeSession = (session) => {
  if (!session) {
    localStorage.removeItem(KEY);
    localStorage.removeItem(DIRTY_KEY);
    return;
  }
  localStorage.setItem(KEY, JSON.stringify(session));
};

// "Dirty" means the device holds changes the server hasn't acknowledged.
export const markDirty = (dirty) => {
  if (dirty) localStorage.setItem(DIRTY_KEY, "1");
  else localStorage.removeItem(DIRTY_KEY);
};

export const isDirty = () => localStorage.getItem(DIRTY_KEY) === "1";

// A session the server has never seen, created entirely on-device.
export const createLocalSession = ({ templateId, name } = {}) => {
  const now = new Date();
  return {
    clientId: newId(),
    name: name || null,
    templateId: templateId || null,
    date: now.toISOString(),
    startedAt: now.toISOString(),
    finishedAt: null,
    notes: null,
    sets: [],
  };
};

export const createLocalSet = (data) => ({
  clientId: newId(),
  userWorkoutId: data.userWorkoutId,
  setNumber: data.setNumber,
  weight: data.weight ?? 0,
  reps: data.reps ?? 0,
  rpe: data.rpe ?? null,
  isWarmup: Boolean(data.isWarmup),
  completed: data.completed ?? false,
});

// The server echoes back its own row ids and joined userWorkout records. Keep
// those (the cards read userWorkout for names) but stay keyed by clientId, so
// a sync never remounts a row the user is typing into.
export const mergeServerSession = (local, server) => {
  if (!server) return local;
  const byClientId = new Map(
    (server.sets || []).filter((s) => s.clientId).map((s) => [s.clientId, s])
  );
  return {
    ...local,
    id: server.id,
    sets: local.sets.map((set) => {
      const match = byClientId.get(set.clientId);
      return match
        ? { ...set, id: match.id, userWorkout: match.userWorkout }
        : set;
    }),
  };
};

// Last-performance lookups are network calls, so cache them: the "previous"
// column is one of the most useful things on the screen and should survive
// losing signal mid-workout.
const PREV_KEY = "lastPerformance";

export const readCachedPrevious = (workoutId) => {
  try {
    const all = JSON.parse(localStorage.getItem(PREV_KEY) || "{}");
    return all[workoutId] ?? null;
  } catch {
    return null;
  }
};

export const cachePrevious = (workoutId, data) => {
  try {
    const all = JSON.parse(localStorage.getItem(PREV_KEY) || "{}");
    all[workoutId] = data;
    localStorage.setItem(PREV_KEY, JSON.stringify(all));
  } catch {
    // cache is best-effort; a full quota must not break logging
  }
};
