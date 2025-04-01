const { Router } = require("express");
const passport = require("passport");
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
  addWeight,
  passwordLink,
  verifyUrl,
  deleteUser,
  createWorkoutTemplate,
  getWorkoutTemplates,
  getWorkoutTemplate,
  updateWorkoutTemplate,
  deleteWorkoutTemplate,
  getUserPreferences,
  updateTemplateOrder,
} = require("../controller/controller");

const router = Router();

router.get("/", home);
router.post("/login", logInPost);
router.post("/signup", signUpPost);
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

router.get(
  "/validate-token",
  passport.authenticate("jwt", { session: false }),
  validate
);

router.post("/weight-entry", addWeight);
router.post(
  "/weights/add",
  passport.authenticate("jwt", { session: false }),
  addWeight
);
router.post("/recovery", passwordLink);
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

// User Preferences routes
router.get(
  "/preferences",
  passport.authenticate("jwt", { session: false }),
  getUserPreferences
);
router.put(
  "/preferences/template-order",
  passport.authenticate("jwt", { session: false }),
  updateTemplateOrder
);

module.exports = router;
