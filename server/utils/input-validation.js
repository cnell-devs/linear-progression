const { body } = require("express-validator");
const emptyErr = "cannot be empty.";

exports.validateSignUp = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Username ${emptyErr}`)
    .custom((value) => {
      if (value.includes("@")) {
        throw new Error("The username cannot contain the '@' symbol.");
      }
      return true; // Indicates the validation passed
    })
    .withMessage("Invalid character '@' in the username."),
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
