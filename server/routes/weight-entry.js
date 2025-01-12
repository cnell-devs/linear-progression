const { Router } = require("express");
const { addWeight } = require("../api/addWeight");
const { updateWeight } = require("../api/updateWeight");

const weightEntry = Router();

weightEntry.get("/", (req, res) => res.send("weight endpoint active"));
weightEntry.post("/", addWeight);

weightEntry.put("/", updateWeight);

module.exports = { weightEntry };
