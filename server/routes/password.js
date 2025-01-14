const express = require("express");
const {
  passwordLink,
  verifyUrl,
  resetPassword,
} = require("../controller/controller");
const password = express.Router();

password.post("/password-reset", passwordLink);
password.get("/:id/:token", verifyUrl);
password.post("/:id/:token", resetPassword);

module.exports = { password };
