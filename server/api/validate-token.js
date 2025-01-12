const { Router } = require("express");
const jwtDecode = require("jwt-decode");
const passport = require('passport')


const validate = Router();

const validateToken = [
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

const getUserIdFromToken = (token = localStorage.getItem("authToken")) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

validate.get(
  "/",
validateToken
);

module.exports = { validate };
