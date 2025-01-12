const { Router } = require("express");
const { logInPost } = require("../api/login");

const logIn = Router();

logIn.get("/", (req, res) => res.send({ message: "reached" }));

logIn.post("/", logInPost);

module.exports = { logIn };
