const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Search for global workouts by name with autocomplete
exports.searchGlobalWorkouts = async (query, limit = 10) => {
  try {
    const workouts = await prisma.globalWorkout.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        isApproved: true, // Only show approved workouts
      },
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    return workouts;
  } catch (error) {
    console.error("Error searching global workouts:", error);
    throw error;
  }
};

// Get all global workouts with optional filtering
exports.getGlobalWorkouts = async (filters = {}) => {
  try {
    const where = { isApproved: true };

    if (filters.muscleGroup) {
      where.muscleGroup = filters.muscleGroup;
    }

    if (filters.equipment) {
      where.equipment = filters.equipment;
    }

    const workouts = await prisma.globalWorkout.findMany({
      where,
      orderBy: [{ name: "asc" }],
    });

    return workouts;
  } catch (error) {
    console.error("Error getting global workouts:", error);
    throw error;
  }
};

// Create or reference a workout for a user
exports.createUserWorkout = async ({
  userId,
  workoutName,
  globalWorkoutId,
  customData = {},
}) => {
  try {
    // If globalWorkoutId is provided, reference the global workout
    if (globalWorkoutId) {
      // Check if user already has this global workout
      const existingUserWorkout = await prisma.userWorkout.findFirst({
        where: {
          userId,
          globalWorkoutId,
        },
      });

      if (existingUserWorkout) {
        return existingUserWorkout;
      }

      // Create new user workout referencing global workout
      return await prisma.userWorkout.create({
        data: {
          userId,
          globalWorkoutId,
          userCreated: false,
          ...customData,
        },
        include: {
          globalWorkout: true,
        },
      });
    }

    // If no globalWorkoutId, check if a global workout with this name exists
    const existingGlobal = await prisma.globalWorkout.findFirst({
      where: {
        name: {
          equals: workoutName,
          mode: "insensitive",
        },
        isApproved: true,
      },
    });

    if (existingGlobal) {
      // Global workout exists, reference it
      return await exports.createUserWorkout({
        userId,
        globalWorkoutId: existingGlobal.id,
        customData,
      });
    }

    // No global workout exists, create user-specific workout
    return await prisma.userWorkout.create({
      data: {
        userId,
        customName: workoutName,
        userCreated: true,
        pendingApproval: false, // Could be set to true if you want admin review
        ...customData,
      },
    });
  } catch (error) {
    console.error("Error creating user workout:", error);
    throw error;
  }
};

// Get user's workouts (including both referenced and custom workouts)
exports.getUserWorkouts = async (userId, filters = {}) => {
  try {
    const where = { userId };

    const userWorkouts = await prisma.userWorkout.findMany({
      where,
      include: {
        globalWorkout: true,
        weights: {
          where: { userId },
          orderBy: { date: "desc" },
          // Remove the 'take: 1' limit to get all weight entries
        },
        superset: true,
        alternate: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to have a consistent interface
    return userWorkouts.map((userWorkout) => ({
      id: userWorkout.id,
      name: userWorkout.globalWorkout?.name || userWorkout.customName,
      muscleGroup: userWorkout.globalWorkout?.muscleGroup,
      equipment: userWorkout.globalWorkout?.equipment,
      userCreated: userWorkout.userCreated,
      pendingApproval: userWorkout.pendingApproval,
      alt: userWorkout.alt,
      ss: userWorkout.ss,
      weights: userWorkout.weights,
      superset: userWorkout.superset,
      alternate: userWorkout.alternate,
      globalWorkoutId: userWorkout.globalWorkoutId,
      userId: userWorkout.userId,
      createdAt: userWorkout.createdAt,
      updatedAt: userWorkout.updatedAt,
    }));
  } catch (error) {
    console.error("Error getting user workouts:", error);
    throw error;
  }
};

// Update user workout
exports.updateUserWorkout = async (userWorkoutId, userId, updateData) => {
  try {
    // Verify ownership
    const existingWorkout = await prisma.userWorkout.findFirst({
      where: {
        id: userWorkoutId,
        userId,
      },
    });

    if (!existingWorkout) {
      throw new Error("Workout not found or not owned by user");
    }

    // Don't allow changing the name if it references a global workout
    if (existingWorkout.globalWorkoutId && updateData.customName) {
      delete updateData.customName;
    }

    return await prisma.userWorkout.update({
      where: { id: userWorkoutId },
      data: updateData,
      include: {
        globalWorkout: true,
        weights: {
          where: { userId },
          orderBy: { date: "desc" },
          // Remove the 'take: 1' limit to get all weight entries
        },
      },
    });
  } catch (error) {
    console.error("Error updating user workout:", error);
    throw error;
  }
};

// Delete user workout
exports.deleteUserWorkout = async (userWorkoutId, userId) => {
  try {
    // Verify ownership
    const existingWorkout = await prisma.userWorkout.findFirst({
      where: {
        id: userWorkoutId,
        userId,
      },
    });

    if (!existingWorkout) {
      throw new Error("Workout not found or not owned by user");
    }

    return await prisma.userWorkout.delete({
      where: { id: userWorkoutId },
    });
  } catch (error) {
    console.error("Error deleting user workout:", error);
    throw error;
  }
};

// Add weight entry for user workout
exports.addUserWorkoutWeight = async ({
  userId,
  userWorkoutId,
  weight,
  date,
  templateId,
}) => {
  try {
    // Verify the user workout belongs to the user
    const userWorkout = await prisma.userWorkout.findFirst({
      where: {
        id: userWorkoutId,
        userId,
      },
    });

    if (!userWorkout) {
      throw new Error("Workout not found or not owned by user");
    }

    return await prisma.weightEntry.create({
      data: {
        userId,
        userWorkoutId,
        weight,
        date: date ? new Date(date) : new Date(),
        ...(templateId && { templateId }),
      },
    });
  } catch (error) {
    console.error("Error adding weight entry:", error);
    throw error;
  }
};

// Suggest global workout creation (for admin approval)
exports.suggestGlobalWorkout = async ({
  name,
  muscleGroup,
  equipment,
  description,
  createdBy,
}) => {
  try {
    // Check if workout already exists
    const existing = await prisma.globalWorkout.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      throw new Error("A workout with this name already exists");
    }

    return await prisma.globalWorkout.create({
      data: {
        name,
        muscleGroup,
        equipment,
        description,
        createdBy,
        isApproved: false, // Requires admin approval
      },
    });
  } catch (error) {
    console.error("Error suggesting global workout:", error);
    throw error;
  }
};

// Admin functions
exports.getPendingGlobalWorkouts = async () => {
  try {
    return await prisma.globalWorkout.findMany({
      where: { isApproved: false },
      include: {
        creator: {
          select: { username: true, id: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("Error getting pending global workouts:", error);
    throw error;
  }
};

exports.approveGlobalWorkout = async (globalWorkoutId) => {
  try {
    return await prisma.globalWorkout.update({
      where: { id: globalWorkoutId },
      data: { isApproved: true },
    });
  } catch (error) {
    console.error("Error approving global workout:", error);
    throw error;
  }
};

exports.rejectGlobalWorkout = async (globalWorkoutId) => {
  try {
    return await prisma.globalWorkout.delete({
      where: { id: globalWorkoutId },
    });
  } catch (error) {
    console.error("Error rejecting global workout:", error);
    throw error;
  }
};
