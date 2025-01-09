const { Router } = require("express");

const home = Router();

home.get("/", (req, res) => {
  res.send("GET recieved at home endpoint");
});

module.exports = { home };
