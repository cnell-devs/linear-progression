const { Router } = require("express");
const {logout } = require("../api/logout");

const logOut = Router();

logOut.get("/", logout);

module.exports = { logOut };
