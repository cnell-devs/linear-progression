const { Router } = require("express");
const {
  createSession,
  getActiveSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  addSet,
  updateSet,
  deleteSet,
  getLastPerformance,
  getWorkoutHistory,
  syncSession,
} = require("../controller/sessionController");

// Mounted behind JWT auth in routes.js, so every handler can rely on req.user.
const sessions = Router();

// "/active" must be declared before "/:id" or Express matches it as an id.
sessions.get("/active", getActiveSession);
sessions.get("/", getSessions);
// Whole-session upsert used by the offline queue; must precede "/:id".
sessions.put("/sync", syncSession);
sessions.post("/", createSession);

sessions.get("/history/:workoutId", getWorkoutHistory);
sessions.get("/last/:workoutId", getLastPerformance);

// Literal "/sets" paths must precede "/:id" or Express matches "sets" as an id.
sessions.patch("/sets/:setId", updateSet);
sessions.delete("/sets/:setId", deleteSet);

sessions.get("/:id", getSession);
sessions.patch("/:id", updateSession);
sessions.delete("/:id", deleteSession);

sessions.post("/:id/sets", addSet);

module.exports = { sessions };
