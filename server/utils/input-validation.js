const { body } = require("express-validator");
const emptyErr = "cannot be empty.";

exports.validateSignUp = [
  body("username").trim().notEmpty().withMessage(`Username ${emptyErr}`),
  body("password").trim().notEmpty().withMessage(`Password ${emptyErr}`),
];
