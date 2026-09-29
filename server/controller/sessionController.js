const db = require("../models/sessionQueries");

exports.createSession = async (req, res) => {
  try {
    const session = await db.createSession(req.user.id, req.body);
    res.status(201).send(session);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).send({ error: "Failed to create session" });
  }
};

exports.getActiveSession = async (req, res) => {
  try {
    const session = await db.getActiveSession(req.user.id);
    // res.json, not res.send: send(null) emits an empty body, which is not
    // parseable JSON on the client.
    res.json(session || null);
  } catch (error) {
    console.error("Error fetching active session:", error);
    res.status(500).send({ error: "Failed to fetch active session" });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const take = Math.min(parseInt(req.query.take) || 20, 100);
    const skip = parseInt(req.query.skip) || 0;
    const sessions = await db.getSessions(req.user.id, { take, skip });
    res.send(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).send({ error: "Failed to fetch sessions" });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await db.getSessionById(req.params.id, req.user.id);
    if (!session) return res.status(404).send({ error: "Session not found" });
    res.send(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).send({ error: "Failed to fetch session" });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const { name, notes, finished, date } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (notes !== undefined) data.notes = notes;
    if (date !== undefined) data.date = new Date(date);
    // `finished` is a toggle rather than a raw timestamp so the client never
    // has to agree with the server about what "now" is.
    if (finished !== undefined) data.finishedAt = finished ? new Date() : null;

    const session = await db.updateSession(req.params.id, req.user.id, data);
    if (!session) return res.status(404).send({ error: "Session not found" });
    res.send(session);
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).send({ error: "Failed to update session" });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const deleted = await db.deleteSession(req.params.id, req.user.id);
    if (!deleted) return res.status(404).send({ error: "Session not found" });
    res.send({ message: "Session deleted" });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).send({ error: "Failed to delete session" });
  }
};

exports.addSet = async (req, res) => {
  try {
    const session = await db.getSessionById(req.params.id, req.user.id);
    if (!session) return res.status(404).send({ error: "Session not found" });

    const { userWorkoutId, setNumber, weight, reps } = req.body;

    if (userWorkoutId === undefined || userWorkoutId === null) {
      return res.status(400).send({ error: "userWorkoutId is required" });
    }
    if (!(await db.userOwnsWorkout(userWorkoutId, req.user.id))) {
      return res.status(403).send({ error: "Workout does not belong to user" });
    }

    const numericFields = { setNumber, weight, reps };
    for (const [field, value] of Object.entries(numericFields)) {
      if (value === undefined || value === null || isNaN(parseInt(value))) {
        return res.status(400).send({ error: `${field} must be a number` });
      }
    }
    if (parseInt(weight) < 0 || parseInt(reps) < 0) {
      return res.status(400).send({ error: "weight and reps cannot be negative" });
    }

    const set = await db.addSet(req.params.id, req.body);
    res.status(201).send(set);
  } catch (error) {
    console.error("Error adding set:", error);
    res.status(500).send({ error: "Failed to add set" });
  }
};

exports.updateSet = async (req, res) => {
  try {
    const { weight, reps, rpe, setNumber, completed, isWarmup } = req.body;

    const data = {};
    for (const [field, value] of Object.entries({
      weight,
      reps,
      setNumber,
    })) {
      if (value !== undefined) {
        const parsed = parseInt(value);
        if (isNaN(parsed)) {
          return res.status(400).send({ error: `${field} must be a number` });
        }
        data[field] = parsed;
      }
    }
    if (rpe !== undefined) data.rpe = rpe === null ? null : parseInt(rpe);
    if (completed !== undefined) data.completed = Boolean(completed);
    if (isWarmup !== undefined) data.isWarmup = Boolean(isWarmup);

    const set = await db.updateSet(req.params.setId, req.user.id, data);
    if (!set) return res.status(404).send({ error: "Set not found" });
    res.send(set);
  } catch (error) {
    console.error("Error updating set:", error);
    res.status(500).send({ error: "Failed to update set" });
  }
};

exports.deleteSet = async (req, res) => {
  try {
    const deleted = await db.deleteSet(req.params.setId, req.user.id);
    if (!deleted) return res.status(404).send({ error: "Set not found" });
    res.send({ message: "Set deleted" });
  } catch (error) {
    console.error("Error deleting set:", error);
    res.status(500).send({ error: "Failed to delete set" });
  }
};

exports.getLastPerformance = async (req, res) => {
  try {
    const performance = await db.getLastPerformance(
      req.params.workoutId,
      req.user.id,
      req.query.excludeSession
    );
    res.json(performance || null);
  } catch (error) {
    console.error("Error fetching last performance:", error);
    res.status(500).send({ error: "Failed to fetch last performance" });
  }
};

exports.getWorkoutHistory = async (req, res) => {
  try {
    const history = await db.getWorkoutHistory(
      req.params.workoutId,
      req.user.id
    );
    res.send(history);
  } catch (error) {
    console.error("Error fetching workout history:", error);
    res.status(500).send({ error: "Failed to fetch workout history" });
  }
};
