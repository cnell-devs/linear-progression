const {
  home,
  logIn,
  signUp,
  logOut,
  workouts,
  validate,weightEntry
} = require("./routes/routes");

const express = require("express");
const app = express();
const passport = require("./config/passport.js");

app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", home);
app.use(
  "/workouts",
  /* passport.authenticate("jwt", { session: false }) ,*/
  workouts
);
app.use("/signup", signUp);
app.use("/login", logIn);
app.use("/logout", logOut);
app.use("/validate-token", validate);
app.use("/weight-entry", weightEntry);

const PORT = 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

module.exports = app
