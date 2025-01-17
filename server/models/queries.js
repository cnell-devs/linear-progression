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
  console.log("GET", date);

  try {
    const entry = await prisma.weightEntry.findFirst({
      where: {
        userId,
        workoutId,
        date: date,
      },
    });
    return entry;
  } catch (error) {
    console.log(error);
  }
};

exports.addWeightEntry = async (userId, workoutId, weight, date) => {
  console.log("ADD", date);

  try {
    const newEntry = await prisma.weightEntry.create({
      data: {
        userId: userId,
        workoutId: workoutId,
        weight: weight,
        date: date,
      },
    });

    console.log("New weight entry created:", newEntry);
    return newEntry;
  } catch (error) {
    console.error("Error creating weight entry:", error.message);
  }
};

exports.updateWeightEntry = async (id, userId, workoutId, newWeight) => {
  try {
    const updatedEntry = await prisma.weightEntry.update({
      where: {
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
    return updatedEntry;
  } catch (error) {
    console.error("Error updating weight:", error.message);
  }
};

exports.deleteWeightEntry = async (id) => {
  try {
    const deleted = await prisma.weightEntry.delete({
      where: {
        id : id
      },

    });

    console.log("Weight deleted")
    return deleted;
  } catch (error) {
    console.error("Error deleted weight:", error.message);
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
