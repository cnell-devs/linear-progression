const userWorkoutQueries = require("../models/userWorkoutQueries");

// Search global workouts (for autocomplete)
exports.searchGlobalWorkouts = async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).send({ error: "Search query is required" });
    }

    const workouts = await userWorkoutQueries.searchGlobalWorkouts(
      query.trim(),
      parseInt(limit)
    );
    res.send(workouts);
  } catch (error) {
    console.error("Error searching global workouts:", error);
    res.status(500).send({ error: "Failed to search workouts" });
  }
};

// Get all global workouts with filtering
exports.getGlobalWorkouts = async (req, res) => {
  try {
    const { muscleGroup, equipment } = req.query;

    const filters = {};
    if (muscleGroup) filters.muscleGroup = muscleGroup;
    if (equipment) filters.equipment = equipment;

    const workouts = await userWorkoutQueries.getGlobalWorkouts(filters);
    res.send(workouts);
  } catch (error) {
    console.error("Error getting global workouts:", error);
    res.status(500).send({ error: "Failed to fetch global workouts" });
  }
};

// Get user's workouts (new hybrid system)
exports.getUserWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;

    const filters = {};

    const workouts = await userWorkoutQueries.getUserWorkouts(userId, filters);

    console.log(
      `Retrieved ${workouts.length} user workouts for user ${userId}`
    );
    res.send(workouts);
  } catch (error) {
    console.error("Error getting user workouts:", error);
    res.status(500).send({ error: "Failed to fetch user workouts" });
  }
};

// Create user workout (with intelligent lookup)
exports.createUserWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      globalWorkoutId,
      alt = false,
      ss = false,
      supersettedId,
      alternateId,
      muscleGroup,
      equipment,
      description,
    } = req.body;

    // Validate required fields
    if (!name && !globalWorkoutId) {
      return res.status(400).send({
        error: "Either workout name or global workout ID is required",
      });
    }

    const customData = {
      alt,
      ss,
      ...(supersettedId && { supersettedId }),
      ...(alternateId && { alternateId }),
    };

    let userWorkout;

    if (globalWorkoutId) {
      // User selected a global workout
      userWorkout = await userWorkoutQueries.createUserWorkout({
        userId,
        globalWorkoutId: parseInt(globalWorkoutId),
        customData,
      });
    } else {
      // User entered a custom name - check for global match or create new
      userWorkout = await userWorkoutQueries.createUserWorkout({
        userId,
        workoutName: name,
        customData,
      });

      // If it's a completely new workout and user provided metadata, suggest it as global
      if (
        userWorkout.userCreated &&
        (muscleGroup || equipment || description)
      ) {
        try {
          await userWorkoutQueries.suggestGlobalWorkout({
            name,
            muscleGroup,
            equipment,
            description,
            createdBy: userId,
          });
          console.log(`Suggested global workout: ${name}`);
        } catch (error) {
          // Don't fail the main request if suggestion fails
          console.log("Failed to suggest global workout:", error.message);
        }
      }
    }

    res.status(201).send(userWorkout);
  } catch (error) {
    console.error("Error creating user workout:", error);
    res.status(500).send({ error: "Failed to create workout" });
  }
};

// Update user workout
exports.updateUserWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.userId;
    delete updateData.globalWorkoutId;
    delete updateData.userCreated;
    delete updateData.pendingApproval;

    const updatedWorkout = await userWorkoutQueries.updateUserWorkout(
      parseInt(id),
      userId,
      updateData
    );

    res.send(updatedWorkout);
  } catch (error) {
    console.error("Error updating user workout:", error);
    if (error.message === "Workout not found or not owned by user") {
      return res.status(404).send({ error: error.message });
    }
    res.status(500).send({ error: "Failed to update workout" });
  }
};

// Delete user workout
exports.deleteUserWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await userWorkoutQueries.deleteUserWorkout(parseInt(id), userId);
    res.send({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error("Error deleting user workout:", error);
    if (error.message === "Workout not found or not owned by user") {
      return res.status(404).send({ error: error.message });
    }
    res.status(500).send({ error: "Failed to delete workout" });
  }
};

// Add weight entry (updated for new system)
exports.addUserWorkoutWeight = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userWorkoutId, weight, date, templateId } = req.body;

    if (!userWorkoutId) {
      return res.status(400).send({ error: "userWorkoutId is required" });
    }

    if (!weight) {
      return res.status(400).send({ error: "weight is required" });
    }

    const weightEntry = await userWorkoutQueries.addUserWorkoutWeight({
      userId,
      userWorkoutId: parseInt(userWorkoutId),
      weight: parseInt(weight),
      date,
      templateId: templateId ? parseInt(templateId) : undefined,
    });

    res.status(201).send(weightEntry);
  } catch (error) {
    console.error("Error adding weight entry:", error);
    if (error.message === "Workout not found or not owned by user") {
      return res.status(404).send({ error: error.message });
    }
    res.status(500).send({ error: "Failed to add weight entry" });
  }
};

// Admin functions
exports.getPendingGlobalWorkouts = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.admin) {
      return res.status(403).send({ error: "Admin access required" });
    }

    const pendingWorkouts = await userWorkoutQueries.getPendingGlobalWorkouts();
    res.send(pendingWorkouts);
  } catch (error) {
    console.error("Error getting pending global workouts:", error);
    res.status(500).send({ error: "Failed to fetch pending workouts" });
  }
};

exports.approveGlobalWorkout = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.admin) {
      return res.status(403).send({ error: "Admin access required" });
    }

    const { id } = req.params;
    const approvedWorkout = await userWorkoutQueries.approveGlobalWorkout(
      parseInt(id)
    );
    res.send(approvedWorkout);
  } catch (error) {
    console.error("Error approving global workout:", error);
    res.status(500).send({ error: "Failed to approve workout" });
  }
};

exports.rejectGlobalWorkout = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.admin) {
      return res.status(403).send({ error: "Admin access required" });
    }

    const { id } = req.params;
    await userWorkoutQueries.rejectGlobalWorkout(parseInt(id));
    res.send({ message: "Workout rejected and deleted" });
  } catch (error) {
    console.error("Error rejecting global workout:", error);
    res.status(500).send({ error: "Failed to reject workout" });
  }
};
