const db = require("../models/queries");

exports.updateWeight = async (req, res) => {
  const { userId } = req.body;
  const { workoutId } = req.body;
  const { weight } = req.body;
  try {
    const workouts = await db.updateWeightEntry(userId, workoutId, weight);

    // console.log(workouts);

    res.send(workouts);
  } catch (error) {
    console.error(error);
    return error;
  }
};

