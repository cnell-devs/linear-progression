const { Router } = require("express");

const home = Router();

home.get("/", (req, res) => {
  res.send("Server is running");
});

module.exports = { home };
