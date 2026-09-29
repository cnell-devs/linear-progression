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

// Looks up a verification / password-reset token.
//
// The previous version filtered on `tokenid.id` — but `tokenid` is the token
// *string* from the URL, so `.id` was undefined, Prisma dropped the clause,
// and the lookup matched on userId alone. Knowing a user's id was therefore
// enough to pass the reset check. Expiry was never applied either.
exports.getToken = async (userId, tokenValue = null) => {
  try {
    return await prisma.token.findFirst({
      where: {
        userId,
        ...(tokenValue ? { token: tokenValue } : {}),
        expiresAt: { gt: new Date() },
      },
    });
  } catch (error) {
    console.error("Error fetching token:", error.message);
    throw error;
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

exports.getWorkouts = async (split, userId) => {
  try {
    console.log("Getting workouts for userId:", userId);

    // Build the base query - only get workouts for the specific user
    const query = {
      where: {
        userId: userId,
      },
      include: {
        globalWorkout: true,
        superset: true,
        weights: true,
      },
    };

    console.log("Final query:", JSON.stringify(query, null, 2));
    const workouts = await prisma.userWorkout.findMany(query);

    console.log(`Found ${workouts.length} workouts for user ${userId}`);

    return workouts;
  } catch (error) {
    console.error("Error in getWorkouts:", error);
    throw error;
  }
};

exports.getWorkoutById = async (id) => {
  try {
    const workout = await prisma.userWorkout.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        globalWorkout: true,
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
    // First, check if a global workout with this name exists
    let globalWorkout = null;
    if (workoutData.name) {
      globalWorkout = await prisma.globalWorkout.findUnique({
        where: { name: workoutData.name },
      });
    }

    const workout = await prisma.userWorkout.create({
      data: {
        userId: workoutData.userId,
        ...(globalWorkout
          ? { globalWorkoutId: globalWorkout.id }
          : {
              customName: workoutData.name,
              userCreated: true,
            }),
        alt: workoutData.alt || false,
        ss: workoutData.ss || false,
        // Handle relationships if provided
        ...(workoutData.supersettedId && {
          supersetted: { connect: { id: workoutData.supersettedId } },
        }),
        ...(workoutData.alternateId && {
          alternate: { connect: { id: workoutData.alternateId } },
        }),
      },
      include: {
        globalWorkout: true,
        superset: true,
      },
    });

    return workout;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateWorkout = async (id, workoutData, userId) => {
  try {
    // First check if this workout belongs to the user
    const existingWorkout = await prisma.userWorkout.findUnique({
      where: { id: parseInt(id) },
    });

    // If workout doesn't exist, throw error
    if (!existingWorkout) {
      throw new Error("Workout not found");
    }

    // If workout doesn't belong to user, throw error
    if (existingWorkout.userId !== userId) {
      throw new Error("Unauthorized to update this workout");
    }

    // Update the workout
    const workout = await prisma.userWorkout.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...(workoutData.name !== undefined && { customName: workoutData.name }),
        ...(workoutData.alt !== undefined && { alt: workoutData.alt }),
        ...(workoutData.ss !== undefined && { ss: workoutData.ss }),
      },
      include: {
        globalWorkout: true,
        superset: true,
        weights: true,
      },
    });

    return workout;

    return workout;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteWorkout = async (id, userId) => {
  try {
    // First check if this workout belongs to the user
    const existingWorkout = await prisma.userWorkout.findUnique({
      where: { id: parseInt(id) },
    });

    // If workout doesn't exist, throw error
    if (!existingWorkout) {
      throw new Error("Workout not found");
    }

    // If workout doesn't belong to user, throw error
    if (existingWorkout.userId !== userId) {
      throw new Error("Unauthorized to delete this workout");
    }

    const workout = await prisma.userWorkout.delete({
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

exports.getWeightEntry = async (userId, workoutId, date, templateId = null) => {
  console.log("GET", date);
  console.log("GET workoutId:", workoutId, "type:", typeof workoutId);
  console.log("GET templateId:", templateId);

  try {
    // Ensure workoutId is an integer
    const workoutIdInt =
      typeof workoutId === "string" ? parseInt(workoutId) : workoutId;

    let whereClause = {
      date: date,
      userId: userId,
      userWorkoutId: workoutIdInt, // Only support userWorkoutId now
    };

    // Add templateId filter if provided
    if (templateId !== null) {
      whereClause.templateId = templateId;
    } else {
      // If templateId is null, look for entries without a templateId
      whereClause.templateId = null;
    }

    const entry = await prisma.weightEntry.findFirst({
      where: whereClause,
    });
    return entry;
  } catch (error) {
    console.log(error);
    throw error; // Re-throw the error for proper handling in the controller
  }
};

exports.addWeightEntry = async (
  userId,
  workoutId,
  weight,
  date,
  templateId = null
) => {
  console.log("ADD", date);
  console.log("ADD workoutId:", workoutId, "type:", typeof workoutId);
  console.log("ADD templateId:", templateId);

  try {
    // Ensure workoutId is an integer
    const workoutIdInt =
      typeof workoutId === "string" ? parseInt(workoutId) : workoutId;

    const data = {
      userId: userId,
      weight: weight,
      date: date,
      userWorkoutId: workoutIdInt, // Only support userWorkoutId now
    };

    // Add templateId if provided
    if (templateId) {
      data.templateId = templateId;
    }

    const newEntry = await prisma.weightEntry.create({
      data,
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

    const updateData = {
      userId: userId,
      weight: newWeight, // Update the weight
      userWorkoutId: workoutIdInt, // Only support userWorkoutId now
    };

    const updatedEntry = await prisma.weightEntry.update({
      where: {
        id,
      },
      data: updateData,
    });

    console.log("Weight updated:", updatedEntry);
    return updatedEntry;
  } catch (error) {
    console.error("Error updating weight:", error.message);
    throw error; // Re-throw the error for proper handling in the controller
  }
};

exports.deleteWeightEntry = async (id, userId) => {
  try {
    // Ensure id is an integer
    const idInt = typeof id === "string" ? parseInt(id) : id;

    // Scoped by userId so one user can never delete another's entry. Returns
    // null when the entry is missing OR not theirs, which the controller
    // reports as a 404 either way.
    const { count } = await prisma.weightEntry.deleteMany({
      where: {
        id: idInt,
        userId: userId,
      },
    });

    if (count === 0) return null;

    console.log("Weight deleted");
    return { id: idInt };
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

// Keeps only the entries whose workout id is a real UserWorkout belonging to
// this user, and drops duplicates (template_workout is unique on
// [templateId, userWorkoutId], so a repeat would fail the whole write).
// Throws when nothing valid remains, rather than silently saving an empty
// template.
exports.filterOwnedWorkouts = async (workouts = [], userId) => {
  const ids = [
    ...new Set(
      workouts
        .map((w) => parseInt(w.id))
        .filter((id) => Number.isInteger(id))
    ),
  ];

  const owned = await prisma.userWorkout.findMany({
    where: { id: { in: ids }, userId },
    select: { id: true },
  });
  const ownedIds = new Set(owned.map((w) => w.id));

  const seen = new Set();
  const result = [];
  for (const workout of workouts) {
    const id = parseInt(workout.id);
    if (!ownedIds.has(id) || seen.has(id)) continue;
    seen.add(id);
    result.push({ ...workout, id });
  }

  if (result.length === 0) {
    throw new Error("No valid exercises for this template");
  }
  return result;
};

exports.createWorkoutTemplate = async ({
  name,
  description,
  userId,
  workouts, // Changed from workoutIds to workouts array with sets/reps
}) => {
  try {
    // Only the caller's own exercises may go into their template — the id
    // arrives from the client and was previously trusted outright.
    const owned = await exports.filterOwnedWorkouts(workouts, userId);

    const template = await prisma.workoutTemplate.create({
      data: {
        name,
        description,
        userId,
        templateWorkouts: {
          create: owned.map((workout) => ({
            userWorkoutId: parseInt(workout.id),
            sets: workout.sets,
            reps: workout.reps,
            amrap: workout.amrap || false,
          })),
        },
      },
      include: {
        templateWorkouts: {
          include: {
            userWorkout: {
              include: {
                globalWorkout: true,
              },
            },
          },
        },
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
        templateWorkouts: {
          include: {
            userWorkout: {
              include: {
                globalWorkout: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
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
        templateWorkouts: {
          include: {
            userWorkout: {
              include: {
                globalWorkout: true,
                weights: {
                  where: {
                    templateId: parseInt(id), // Only include weights for this template
                  },
                },
              },
            },
          },
        },
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
  { name, description, workouts }
) => {
  try {
    // First, check if template exists and belongs to user
    const currentTemplate = await prisma.workoutTemplate.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        templateWorkouts: true,
      },
    });

    if (!currentTemplate || currentTemplate.userId !== userId) {
      return null;
    }

    // Only the caller's own exercises. The previous lookup matched on id
    // alone, so one user could attach another user's exercise to a template.
    const validWorkouts = (
      await exports.filterOwnedWorkouts(workouts, userId)
    ).map((workout) => ({
      userWorkoutId: workout.id,
      sets: workout.sets,
      reps: workout.reps,
      amrap: workout.amrap || false,
    }));

    // Update template and replace templateWorkouts
    const template = await prisma.workoutTemplate.update({
      where: {
        id: parseInt(id),
        userId,
      },
      data: {
        name,
        description,
        templateWorkouts: {
          deleteMany: {}, // Remove all existing templateWorkouts
          create: validWorkouts,
        },
      },
      include: {
        templateWorkouts: {
          include: {
            userWorkout: {
              include: {
                globalWorkout: true,
              },
            },
          },
        },
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
