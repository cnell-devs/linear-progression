const { home } = require("./home");
const { logIn } = require("./logIn");
const { signUp } = require("./signUp");
const { logOut } = require("./logout");
const { workouts } = require("./workouts");
const { validate } = require("./validate-token");
const { weightEntry } = require("./weight-entry");

module.exports = {
  home,
  workouts,
  logIn,
  signUp,
  logOut,
  validate,
  weightEntry,
};
