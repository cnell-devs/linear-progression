const { Router } = require("express");
const userWorkoutController = require("../controller/userWorkoutController");

const userWorkouts = Router();

// Global workout routes
userWorkouts.get("/global/search", userWorkoutController.searchGlobalWorkouts);
userWorkouts.get("/global", userWorkoutController.getGlobalWorkouts);

// User workout routes
userWorkouts.get("/", userWorkoutController.getUserWorkouts);
userWorkouts.post("/", userWorkoutController.createUserWorkout);
userWorkouts.put("/:id", userWorkoutController.updateUserWorkout);
userWorkouts.delete("/:id", userWorkoutController.deleteUserWorkout);

// Weight entry route
userWorkouts.post("/weights", userWorkoutController.addUserWorkoutWeight);

// Admin routes
userWorkouts.get(
  "/admin/pending",
  userWorkoutController.getPendingGlobalWorkouts
);
userWorkouts.post(
  "/admin/approve/:id",
  userWorkoutController.approveGlobalWorkout
);
userWorkouts.delete(
  "/admin/reject/:id",
  userWorkoutController.rejectGlobalWorkout
);

module.exports = { userWorkouts };
