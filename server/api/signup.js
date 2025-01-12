const db = require("../models/queries");
const { validateSignUp } = require("../utils/input-validation");
const pw = require("../utils/pw-encrypt");
const { validationResult } = require("express-validator");
const express = require("express");
const app = express();
const passport = require("./config/passport.js");

app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
exports.signUpPost = [
  validateSignUp,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send(errors.array().map((error) => "msg: " + error.msg));
      return;
    }

    req.body.password = await pw.encryptPW(req.body.password);

    try {
      const result = await db.addUser(req.body);
      res.send(result);
    } catch (error) {
      return error;
    }
  },
];

module.exports = (req, res) => {
  app(req, res);
};