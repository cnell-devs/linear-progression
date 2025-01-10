const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addUser = async (user) => {
  try {
    const prismaUser = await prisma.users.create({
      data: {
        username: user.username,
        password: user.password,
      },
    });
  } catch (error) {
    return error;
  }
  return prismaUser;
};

exports.getUser = async (username) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        username: username,
      },
    });

    return user;
  } catch (error) {
    return error;
  }
};

exports.getWorkouts = async (split) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: {
        type: split,
      },
      include: {
        superset: true,
        weights: true,
      },
    });

    return workouts;
  } catch (error) {
    console.error(error);

    return error;
  }
};

exports.getWeightEntry = async (userId, workoutId, date) => {
  try {
    const entry = await prisma.weightEntry.findFirst({
      where: {
        userId,
        workoutId,
        date: new Date(),
      },
    });
    return entry;
  } catch (error) {
    console.log(error);
  }
};

exports.addWeightEntry = async (userId, workoutId, weight) => {
  try {
    const newEntry = await prisma.weightEntry.create({
      data: {
        userId: userId, // The ID of the user
        workoutId: workoutId, // The ID of the workout
        weight: weight, // The weight value to create
        date: new Date(), // Optionally set the date (default: now)
      },
    });

    console.log("New weight entry created:", newEntry);
    return newEntry
  } catch (error) {
    console.error("Error creating weight entry:", error.message);
  }
};

exports.updateWeightEntry = async (id, userId, workoutId, newWeight) => {
  try {
    const updatedEntry = await prisma.weightEntry.update({
      where:
      {
          id,
          userId,
          workoutId,
        },

      data: {
        weight: newWeight, // Update the weight
        // date: new Date(), // Optionally update the timestamp
      },
    });

    console.log("Weight updated:", updatedEntry);
    return updatedEntry
  } catch (error) {
    console.error("Error updating weight:", error.message);
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
