const passport = require("passport");
const express = require("express");
const app = express();
const passport = require("./config/passport.js");

app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
exports.validateToken = [
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Set custom headers
    res.set("Content-Type", "application/json");

    const { user } = req;
    res.send({ user });
  },
];

module.exports = (req, res) => {
  app(req, res);
};