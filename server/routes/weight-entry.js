const { Router } = require("express");
const { updateWeight, addWeight } = require("../controller/controller");

const weightEntry = Router();

weightEntry.get("/", (req, res) => res.send("weight endpoint active"));
weightEntry.post("/", addWeight);

weightEntry.put("/", updateWeight);

module.exports = { weightEntry };
