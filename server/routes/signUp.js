const { Router } = require("express");
const { signUpPost } = require("../controller/controller");

const signUp = Router();

signUp.post(
  "/",
  (req, res, next) => {
    console.log("got sign up");
    next();
  },
  signUpPost
);

module.exports = { signUp };
