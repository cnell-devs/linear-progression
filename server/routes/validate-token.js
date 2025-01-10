const { Router } = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const jwtDecode = require("jwt-decode");

const validate = Router();

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
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    // Set custom headers
    res.set("Content-Type", "application/json"); 

    const { user } = req;
    res.send(({ user }));
  }
);

module.exports = { validate };
