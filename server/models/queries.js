const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addUser = async (user) => {
  try {
    const prismaUser = await prisma.users.create({
      data: {
        username: user.username,
        password: user.password,
        email: user.email,
      },
    });
    return prismaUser;
  } catch (error) {
    return error;
  }
};

exports.getUser = async (username) => {
  console.log(username);

  const email = username.includes("@");
  console.log(email);

  try {
    const user = await prisma.users.findUnique({
      where: email
        ? {
            email: username,
          }
        : { username: username },
    });

    return user;
  } catch (error) {
    return error;
  }
};

exports.getUserById = async (userId) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (error) {
    return error;
  }
};

exports.updateLastLogin = async (userId) => {
  try {
    const user = await prisma.users.update({
      where: { id: userId },
      data: {
        lastLogin: new Date(),
      },
    });

    return user;
  } catch (error) {
    return error;
  }
};

exports.verifyUser = async (userId) => {
  try {
    const user = await prisma.users.update({
      where: { id: userId },
      data: {
        verified: true,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
};
exports.deleteUser = async (userId) => {
  try {
    const user = await prisma.users.delete({
      where: { id: userId },
    });
    return user;
  } catch (error) {
    return error;
  }
};

exports.changePassword = async (userId, password) => {
  try {
    const user = await prisma.users.update({
      where: { id: userId },
      data: {
        password: password,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
};

exports.getToken = async (userId, tokenid = false) => {
  try {
    const token = await prisma.token.findUnique({
      where: tokenid
        ? {
            userId: userId,
            token: tokenid.id,
          }
        : {
            userId: userId,
          },
    });

    return token;
  } catch (error) {
    return error;
  }
};

exports.addToken = async (user, token) => {
  const oneHourFromNow = new Date();
  oneHourFromNow.setHours(oneHourFromNow.getHours() + 1); // Add 1 hour to the current time

  try {
    const veriToken = await prisma.token.create({
      data: {
        userId: user.id,
        token: token,
        expiresAt: oneHourFromNow,
      },
    });
    return veriToken;
  } catch (error) {
    return error;
  }
};

exports.removeToken = async (token) => {
  console.log("deleting", token.id);

  try {
    const veriToken = await prisma.token.delete({
      where: {
        id: token.id,
      },
    });

    console.log(veriToken);

    return veriToken;
  } catch (error) {
    return error;
  }
};

exports.getWorkouts = async (split, userId = null) => {
  try {
    console.log("Getting workouts with userId:", userId);

    // Build the base query
    const query = {
      where: {},
      include: {
        superset: true,
        weights: true,
      },
    };

    // Add split type filter if provided
    if (split) {
      query.where.type = split;
    }

    // Filter based on user status
    if (userId) {
      // If userId is provided, get global workouts and user's custom workouts
      query.where = {
        ...query.where,
        OR: [{ isGlobal: true }, { userId: userId }],
      };
      console.log("Query with user:", JSON.stringify(query, null, 2));
    } else {
      // If no userId, only get global workouts
      query.where.isGlobal = true;
      console.log("Query without user:", JSON.stringify(query, null, 2));
    }

    console.log("Final query:", JSON.stringify(query, null, 2));
    const workouts = await prisma.workout.findMany(query);

    console.log(`Found ${workouts.length} total workouts`);
    console.log(
      `- Global workouts: ${workouts.filter((w) => w.isGlobal).length}`
    );
    console.log(
      `- User workouts: ${workouts.filter((w) => w.userId === userId).length}`
    );

    return workouts;
  } catch (error) {
    console.error("Error in getWorkouts:", error);
    throw error;
  }
};

exports.getWorkoutById = async (id) => {
  try {
    const workout = await prisma.workout.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        superset: true,
        weights: true,
        user: true,
      },
    });

    return workout;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.createWorkout = async (workoutData) => {
  try {
    const workout = await prisma.workout.create({
      data: {
        name: workoutData.name,
        sets: workoutData.sets,
        reps: workoutData.reps,
        amrap: workoutData.amrap || false,
        type: workoutData.type,
        alt: workoutData.alt || false,
        ss: workoutData.ss || false,
        isTemplate: workoutData.isTemplate || false,
        isGlobal:
          workoutData.isGlobal !== undefined
            ? workoutData.isGlobal
            : !workoutData.userId,
        userId: workoutData.userId,
        // Handle relationships if provided
        ...(workoutData.supersettedId && {
          supersetted: { connect: { id: workoutData.supersettedId } },
        }),
        ...(workoutData.alternateId && {
          alternate: { connect: { id: workoutData.alternateId } },
        }),
      },
      include: {
        superset: true,
      },
    });

    return workout;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateWorkout = async (id, workoutData, userId = null) => {
  try {
    // First check if this workout belongs to the user or is global
    const existingWorkout = await prisma.workout.findUnique({
      where: { id: parseInt(id) },
    });

    // If workout doesn't exist, throw error
    if (!existingWorkout) {
      throw new Error("Workout not found");
    }

    // If workout is not global and doesn't belong to user, throw error
    if (!existingWorkout.isGlobal && existingWorkout.userId !== userId) {
      throw new Error("Unauthorized to update this workout");
    }

    // If workout is global and user wants to modify it, create a copy for the user
    if (existingWorkout.isGlobal && userId && !workoutData.isGlobal) {
      // Create a user-specific copy of the workout
      const newWorkout = await prisma.workout.create({
        data: {
          name: existingWorkout.name,
          sets: existingWorkout.sets,
          reps: existingWorkout.reps,
          amrap: existingWorkout.amrap,
          type: existingWorkout.type,
          alt: existingWorkout.alt,
          ss: existingWorkout.ss,
          isTemplate: existingWorkout.isTemplate,
          isGlobal: false,
          userId: userId,
          // Apply the updates
          ...(workoutData.name !== undefined && { name: workoutData.name }),
          ...(workoutData.sets !== undefined && { sets: workoutData.sets }),
          ...(workoutData.reps !== undefined && { reps: workoutData.reps }),
          ...(workoutData.amrap !== undefined && { amrap: workoutData.amrap }),
          ...(workoutData.type !== undefined && { type: workoutData.type }),
          ...(workoutData.alt !== undefined && { alt: workoutData.alt }),
          ...(workoutData.ss !== undefined && { ss: workoutData.ss }),
        },
        include: {
          superset: true,
          weights: true,
        },
      });
      return newWorkout;
    }

    // Normal update for user's own workout or admin updating global workout
    const workout = await prisma.workout.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...(workoutData.name !== undefined && { name: workoutData.name }),
        ...(workoutData.sets !== undefined && { sets: workoutData.sets }),
        ...(workoutData.reps !== undefined && { reps: workoutData.reps }),
        ...(workoutData.amrap !== undefined && { amrap: workoutData.amrap }),
        ...(workoutData.type !== undefined && { type: workoutData.type }),
        ...(workoutData.alt !== undefined && { alt: workoutData.alt }),
        ...(workoutData.ss !== undefined && { ss: workoutData.ss }),
      },
      include: {
        superset: true,
        weights: true,
      },
    });

    return workout;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteWorkout = async (id, userId = null) => {
  try {
    // First check if this workout belongs to the user
    const existingWorkout = await prisma.workout.findUnique({
      where: { id: parseInt(id) },
    });

    // If workout doesn't exist, throw error
    if (!existingWorkout) {
      throw new Error("Workout not found");
    }

    // If workout is global and user is not admin, throw error
    if (existingWorkout.isGlobal && existingWorkout.userId !== userId) {
      throw new Error("Unauthorized to delete this workout");
    }

    // If workout is not global and doesn't belong to user, throw error
    if (!existingWorkout.isGlobal && existingWorkout.userId !== userId) {
      throw new Error("Unauthorized to delete this workout");
    }

    const workout = await prisma.workout.delete({
      where: {
        id: parseInt(id),
      },
    });

    return workout;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getWeightEntry = async (userId, workoutId, date) => {
  console.log("GET", date);
  console.log("GET workoutId:", workoutId, "type:", typeof workoutId);

  try {
    // Ensure workoutId is an integer
    const workoutIdInt =
      typeof workoutId === "string" ? parseInt(workoutId) : workoutId;

    const entry = await prisma.weightEntry.findFirst({
      where: {
        date: date,
        userId: userId,
        workoutId: workoutIdInt,
      },
    });
    return entry;
  } catch (error) {
    console.log(error);
    throw error; // Re-throw the error for proper handling in the controller
  }
};

exports.addWeightEntry = async (userId, workoutId, weight, date) => {
  console.log("ADD", date);
  console.log("ADD workoutId:", workoutId, "type:", typeof workoutId);

  try {
    // Ensure workoutId is an integer
    const workoutIdInt =
      typeof workoutId === "string" ? parseInt(workoutId) : workoutId;

    const newEntry = await prisma.weightEntry.create({
      data: {
        userId: userId,
        workoutId: workoutIdInt,
        weight: weight,
        date: date,
      },
    });

    console.log("New weight entry created:", newEntry);
    return newEntry;
  } catch (error) {
    console.error("Error creating weight entry:", error.message);
    throw error; // Re-throw the error for proper handling in the controller
  }
};

exports.updateWeightEntry = async (id, userId, workoutId, newWeight) => {
  console.log("UPDATE workoutId:", workoutId, "type:", typeof workoutId);

  try {
    // Ensure workoutId is an integer
    const workoutIdInt =
      typeof workoutId === "string" ? parseInt(workoutId) : workoutId;

    const updatedEntry = await prisma.weightEntry.update({
      where: {
        id,
      },
      data: {
        userId: userId,
        workoutId: workoutIdInt,
        weight: newWeight, // Update the weight
      },
    });

    console.log("Weight updated:", updatedEntry);
    return updatedEntry;
  } catch (error) {
    console.error("Error updating weight:", error.message);
    throw error; // Re-throw the error for proper handling in the controller
  }
};

exports.deleteWeightEntry = async (id) => {
  try {
    const deleted = await prisma.weightEntry.delete({
      where: {
        id: id,
      },
    });

    console.log("Weight deleted");
    return deleted;
  } catch (error) {
    console.error("Error deleted weight:", error.message);
    throw error; // Re-throw the error for proper handling in the controller
  }
};

exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/log-in");
  });
};

exports.createWorkoutTemplate = async ({
  name,
  description,
  userId,
  workoutIds,
}) => {
  try {
    const template = await prisma.workoutTemplate.create({
      data: {
        name,
        description,
        userId,
        workouts: {
          connect: workoutIds.map((id) => ({ id })),
        },
      },
      include: {
        workouts: true,
      },
    });
    return template;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getWorkoutTemplates = async (userId) => {
  try {
    const templates = await prisma.workoutTemplate.findMany({
      where: {
        userId,
      },
      include: {
        workouts: true,
      },
    });
    return templates;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getWorkoutTemplate = async (id, userId) => {
  try {
    const template = await prisma.workoutTemplate.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
      include: {
        workouts: true,
      },
    });
    return template;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateWorkoutTemplate = async (
  id,
  userId,
  { name, description, workoutIds }
) => {
  try {
    // First disconnect existing workouts
    const currentTemplate = await prisma.workoutTemplate.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        workouts: true,
      },
    });

    if (!currentTemplate || currentTemplate.userId !== userId) {
      return null;
    }

    // Then update template and connect new workouts
    const template = await prisma.workoutTemplate.update({
      where: {
        id: parseInt(id),
        userId,
      },
      data: {
        name,
        description,
        workouts: {
          disconnect: currentTemplate.workouts.map((workout) => ({
            id: workout.id,
          })),
          connect: workoutIds.map((id) => ({ id })),
        },
      },
      include: {
        workouts: true,
      },
    });
    return template;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteWorkoutTemplate = async (id, userId) => {
  try {
    const template = await prisma.workoutTemplate.delete({
      where: {
        id: parseInt(id),
        userId,
      },
    });
    return template;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// User Preferences
exports.getUserPreferences = async (userId) => {
  try {
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId },
    });

    // If preferences don't exist yet, create a default entry
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          userId,
          templateOrder: null,
        },
      });
    }

    return preferences;
  } catch (error) {
    console.error("Error getting user preferences:", error);
    throw error;
  }
};

exports.updateTemplateOrder = async (userId, templateOrder) => {
  try {
    // Check if user preferences exist
    const existingPrefs = await prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (existingPrefs) {
      // Update existing preferences
      return await prisma.userPreferences.update({
        where: { userId },
        data: {
          templateOrder: JSON.stringify(templateOrder),
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new preferences
      return await prisma.userPreferences.create({
        data: {
          userId,
          templateOrder: JSON.stringify(templateOrder),
        },
      });
    }
  } catch (error) {
    console.error("Error updating template order:", error);
    throw error;
  }
};
