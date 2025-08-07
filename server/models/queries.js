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

exports.getWorkouts = async (split, userId) => {
  try {
    console.log("Getting workouts for userId:", userId);

    // Build the base query - only get workouts for the specific user
    const query = {
      where: {
        userId: userId,
      },
      include: {
        superset: true,
        weights: true,
      },
    };

    console.log("Final query:", JSON.stringify(query, null, 2));
    const workouts = await prisma.workout.findMany(query);

    console.log(`Found ${workouts.length} workouts for user ${userId}`);

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
        alt: workoutData.alt || false,
        ss: workoutData.ss || false,
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

exports.updateWorkout = async (id, workoutData, userId) => {
  try {
    // First check if this workout belongs to the user
    const existingWorkout = await prisma.workout.findUnique({
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
    const workout = await prisma.workout.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...(workoutData.name !== undefined && { name: workoutData.name }),
        ...(workoutData.sets !== undefined && { sets: workoutData.sets }),
        ...(workoutData.reps !== undefined && { reps: workoutData.reps }),
        ...(workoutData.amrap !== undefined && { amrap: workoutData.amrap }),
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

exports.deleteWorkout = async (id, userId) => {
  try {
    // First check if this workout belongs to the user
    const existingWorkout = await prisma.workout.findUnique({
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

exports.getWeightEntry = async (userId, workoutId, date, templateId = null) => {
  console.log("GET", date);
  console.log("GET workoutId:", workoutId, "type:", typeof workoutId);
  console.log("GET templateId:", templateId);

  try {
    // Ensure workoutId is an integer
    const workoutIdInt =
      typeof workoutId === "string" ? parseInt(workoutId) : workoutId;

    // Check if this is a UserWorkout or legacy Workout
    const userWorkout = await prisma.userWorkout.findUnique({
      where: { id: workoutIdInt },
    });

    let whereClause = {
      date: date,
      userId: userId,
    };

    if (userWorkout) {
      // This is a UserWorkout
      whereClause.userWorkoutId = workoutIdInt;
    } else {
      // This is a legacy Workout
      whereClause.workoutId = workoutIdInt;
    }

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

    // Check if this is a UserWorkout or legacy Workout
    const userWorkout = await prisma.userWorkout.findUnique({
      where: { id: workoutIdInt },
    });

    const data = {
      userId: userId,
      weight: weight,
      date: date,
    };

    if (userWorkout) {
      // This is a UserWorkout
      data.userWorkoutId = workoutIdInt;
    } else {
      // Check if this is a legacy Workout
      const legacyWorkout = await prisma.workout.findUnique({
        where: { id: workoutIdInt },
      });

      if (legacyWorkout) {
        // This is a legacy Workout
        data.workoutId = workoutIdInt;
      } else {
        throw new Error(
          `Workout with ID ${workoutIdInt} not found in either UserWorkout or legacy Workout tables`
        );
      }
    }

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

    // Check if this is a UserWorkout or legacy Workout
    const userWorkout = await prisma.userWorkout.findUnique({
      where: { id: workoutIdInt },
    });

    const updateData = {
      userId: userId,
      weight: newWeight, // Update the weight
    };

    if (userWorkout) {
      // This is a UserWorkout
      updateData.userWorkoutId = workoutIdInt;
      updateData.workoutId = null; // Clear legacy workoutId if set
    } else {
      // This is a legacy Workout
      updateData.workoutId = workoutIdInt;
      updateData.userWorkoutId = null; // Clear userWorkoutId if set
    }

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

exports.deleteWeightEntry = async (id) => {
  try {
    // Ensure id is an integer
    const idInt = typeof id === "string" ? parseInt(id) : id;

    const deleted = await prisma.weightEntry.delete({
      where: {
        id: idInt,
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
  workouts, // Changed from workoutIds to workouts array with sets/reps
}) => {
  try {
    const template = await prisma.workoutTemplate.create({
      data: {
        name,
        description,
        userId,
        templateWorkouts: {
          create: await Promise.all(
            workouts.map(async (workout) => {
              // Check if this is a UserWorkout or legacy Workout
              const userWorkout = await prisma.userWorkout.findUnique({
                where: { id: parseInt(workout.id) },
              });

              if (userWorkout) {
                // This is a UserWorkout
                return {
                  userWorkoutId: parseInt(workout.id),
                  sets: workout.sets,
                  reps: workout.reps,
                  amrap: workout.amrap || false,
                };
              } else {
                // This is a legacy Workout
                return {
                  workoutId: parseInt(workout.id),
                  sets: workout.sets,
                  reps: workout.reps,
                  amrap: workout.amrap || false,
                };
              }
            })
          ),
        },
      },
      include: {
        templateWorkouts: {
          include: {
            workout: true,
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
            workout: true,
            userWorkout: {
              include: {
                globalWorkout: true,
              },
            },
          },
        },
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
            workout: {
              include: {
                weights: {
                  where: {
                    templateId: parseInt(id), // Only include weights for this template
                  },
                },
              },
            },
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

    // Validate and prepare workout data
    const validWorkouts = [];
    for (const workout of workouts) {
      const workoutId = parseInt(workout.id);

      // Check if this is a UserWorkout
      const userWorkout = await prisma.userWorkout.findUnique({
        where: { id: workoutId },
      });

      if (userWorkout) {
        // This is a UserWorkout
        validWorkouts.push({
          userWorkoutId: workoutId,
          sets: workout.sets,
          reps: workout.reps,
          amrap: workout.amrap || false,
        });
      } else {
        // Check if this is a legacy Workout
        const legacyWorkout = await prisma.workout.findUnique({
          where: { id: workoutId },
        });

        if (legacyWorkout) {
          // This is a legacy Workout
          validWorkouts.push({
            workoutId: workoutId,
            sets: workout.sets,
            reps: workout.reps,
            amrap: workout.amrap || false,
          });
        } else {
          // Workout doesn't exist, skip it or throw an error
          console.warn(`Workout with id ${workoutId} not found, skipping`);
        }
      }
    }

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
            workout: true,
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
