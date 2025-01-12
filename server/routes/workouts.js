const { Router } = require("express");
const { getWorkouts } = require("../api/workouts");

const workouts = Router();

workouts.get("/", getWorkouts);

module.exports = { workouts };
