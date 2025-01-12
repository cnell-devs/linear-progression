const { Router } = require("express");
const jwtDecode = require("jwt-decode");

const {validateToken} = require('../api/validate')

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
validateToken
);

module.exports = { validate };
