const { Router } = require("express");
const { getWorkouts } = require("../controller/controller");

const workouts = Router();

workouts.get("/", getWorkouts);

module.exports = { workouts };
