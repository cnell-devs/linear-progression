
const { Router } = require("express");
const { deleteUser } = require("../controller/controller");

const deleteUserRoute = Router();
deleteUserRoute.delete("/:id", deleteUser);

module.exports = { deleteUserRoute };
