const db = require("../models/queries");

exports.addWeight = async (req, res) => {
  const { userId } = req.body;
  const { workoutId } = req.body;
  const { weight } = req.body;

  try {
    const checkDate = await db.getWeightEntry(
      userId,
      workoutId,
      new Date().toLocaleDateString()
    );

    console.log("checkDate", checkDate);

    const workouts = !checkDate
      ? await db.addWeightEntry(userId, workoutId, weight)
      : await db.updateWeightEntry(checkDate.id, userId, workoutId, weight);

    // console.log(workouts);
    res.send(workouts);
  } catch (error) {
    console.error(error);
    return error;
  }
};
