const passport = require("passport");

exports.validateToken = [
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Set custom headers
    res.set("Content-Type", "application/json");

    const { user } = req;
    res.send({ user });
  },
];
