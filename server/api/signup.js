const db = require("../models/queries");
const { validateSignUp } = require("../utils/input-validation");
const pw = require("../utils/pw-encrypt");
const { validationResult } = require("express-validator");

exports.signUpPost = [
  validateSignUp,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send(errors.array().map((error) => "msg: " + error.msg));
      return;
    }

    req.body.password = await pw.encryptPW(req.body.password);

    try {
      const result = await db.addUser(req.body);
      res.send(result);
    } catch (error) {
      return error;
    }
  },
];