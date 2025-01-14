const { Router } = require("express");
const { addWeight } = require("../controller/controller");
const { updateWeight, deleteWeight } = require("../controller/controller");

const weightEntry = Router();

weightEntry.get("/", (req, res) => res.send("weight endpoint active"));
weightEntry.post("/", addWeight);

weightEntry.put("/", updateWeight);
weightEntry.delete("/delete/:id", deleteWeight);

module.exports = { weightEntry };
