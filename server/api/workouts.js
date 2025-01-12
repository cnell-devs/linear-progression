const db = require("../models/queries");

exports.getWorkouts = async (req, res) => {
  const alternate = req.query.alt === "true";
  try {
    const workouts = await db.getWorkouts(req.query.split);

    // console.log(workouts);

    res.send(workouts);
  } catch (error) {
    console.error(error);
    return error;
  }
};
