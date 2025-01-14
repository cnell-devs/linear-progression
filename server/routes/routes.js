const { home } = require("./home");
const { logIn } = require("./logIn");
const { signUp } = require("./signUp");
const { logOut } = require("./logOut");
const { workouts } = require("./workouts");
const { validate } = require("./validate-token");
const { weightEntry } = require("./weight-entry");
const { verify } = require("./verify");
const { password } = require("./password");

module.exports = {
  home,
  workouts,
  logIn,
  signUp,
  logOut,
  validate,
  weightEntry,
  verify,
  password,
};
