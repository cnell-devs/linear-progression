const {
  home,
  logIn,
  signUp,
  logOut,
  workouts,
  validate,
  weightEntry,
} = require("./api/routes.js");


const express = require("express");
const app = express();
const passport = require("./config/passport.js");

app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const getWorkouts = async (req, res) => {
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

app.get(
  "/workouts",
  /* passport.authenticate("jwt", { session: false }) ,*/
  getWorkouts
);
app.use("/signup", signUp);
app.use("/login", logIn);
app.use("/logout", logOut);
app.use("/validate-token", validate);
app.use("/weight-entry", weightEntry);

const PORT = 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

module.exports = app;
