// const db = require("../models/queries");
// const express = require("express");
// const app = express();
// const passport = require("./config/passport.js");

// app.use(passport.initialize());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// const getWorkouts = async (req, res) => {
//   const alternate = req.query.alt === "true";
//   try {
//     const workouts = await db.getWorkouts(req.query.split);

//     // console.log(workouts);

//     res.json(workouts);
//   } catch (error) {
//     console.error(error);
//     return error;
//   }
// };

// app.get("/workouts", getWorkouts);

// module.exports = (req, res) => {
//   app(req, res);
// };
