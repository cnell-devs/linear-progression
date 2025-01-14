const { body } = require("express-validator");
const emptyErr = "cannot be empty.";

exports.validateSignUp = [
  body("username").trim().notEmpty().withMessage(`Username ${emptyErr}`),
  body("email")
    .trim()
    .isEmail()
    .withMessage(`Invalid email format`)
    .notEmpty()
    .withMessage(`Email ${emptyErr}`),
  body("password").trim().notEmpty().withMessage(`Password ${emptyErr}`),
];

exports.validateEmail = [
  body("email")
    .trim()
    .isEmail()
    .withMessage(`Invalid email format.`)
    .notEmpty()
    .withMessage(`Email ${emptyErr}`),
];
