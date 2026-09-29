const { Router } = require("express");
const passport = require("passport");
const { weightEntry } = require("./weight-entry");
const { password } = require("./password");
const { userWorkouts } = require("./userWorkouts");
const { sessions } = require("./sessions");
const { authLimiter, emailLimiter } = require("../config/rateLimit");
const {
  home,
  logInPost,
  signUpPost,
  logout,
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  validate,
  updatePreferences,
  addWeight,
  passwordLink,
  verifyUrl,
  deleteUser,
  createWorkoutTemplate,
  getWorkoutTemplates,
  getWorkoutTemplate,
  updateWorkoutTemplate,
  deleteWorkoutTemplate,
} = require("../controller/controller");

const router = Router();

// Mount the weight-entry router. Authenticated: these handlers read and
// destroy per-user weight entries.
router.use(
  "/weight-entry",
  passport.authenticate("jwt", { session: false }),
  weightEntry
);

// Mount the password recovery router
router.use("/recovery", emailLimiter, password);

// Mount the new user workouts router (v2 API)
router.use(
  "/v2/workouts",
  passport.authenticate("jwt", { session: false }),
  userWorkouts
);

// Session + per-set tracking
router.use(
  "/sessions",
  passport.authenticate("jwt", { session: false }),
  sessions
);

router.get("/", home);
router.post("/login", authLimiter, logInPost);
router.post("/signup", authLimiter, signUpPost);
router.get("/logout", logout);

// Workout routes
router.get(
  "/workouts",
  passport.authenticate("jwt", { session: false }),
  getWorkouts
);
router.get(
  "/workouts/:id",
  passport.authenticate("jwt", { session: false }),
  getWorkoutById
);
router.post(
  "/workouts",
  passport.authenticate("jwt", { session: false }),
  createWorkout
);
router.put(
  "/workouts/:id",
  passport.authenticate("jwt", { session: false }),
  updateWorkout
);
router.delete(
  "/workouts/:id",
  passport.authenticate("jwt", { session: false }),
  deleteWorkout
);

router.patch(
  "/me/preferences",
  passport.authenticate("jwt", { session: false }),
  updatePreferences
);

router.get(
  "/validate-token",
  passport.authenticate("jwt", { session: false }),
  validate
);

router.post(
  "/weights/add",
  passport.authenticate("jwt", { session: false }),
  addWeight
);
router.get("/verify", verifyUrl);
router.delete("/delete", deleteUser);

// Workout Template routes
router.post(
  "/templates",
  passport.authenticate("jwt", { session: false }),
  createWorkoutTemplate
);
router.get(
  "/templates",
  passport.authenticate("jwt", { session: false }),
  getWorkoutTemplates
);
router.get(
  "/templates/:id",
  passport.authenticate("jwt", { session: false }),
  getWorkoutTemplate
);
router.put(
  "/templates/:id",
  passport.authenticate("jwt", { session: false }),
  updateWorkoutTemplate
);
router.delete(
  "/templates/:id",
  passport.authenticate("jwt", { session: false }),
  deleteWorkoutTemplate
);

module.exports = router;
