const { Router } = require("express");
const { emailLink } = require("../controller/controller");

const verify = Router();
verify.get("/:id/:token", emailLink);

module.exports = { verify };
