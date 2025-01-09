const { Router } = require("express");
const {logout } = require("../controller/controller");

const logOut = Router();

logOut.get("/", logout);

module.exports = { logOut };
