const { Router } = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { logInPost } = require("../controller/controller");

const logIn = Router();

logIn.get("/", (req, res) => res.send({ message: "reached" }));

logIn.post("/", logInPost);

module.exports = { logIn };
