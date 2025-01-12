const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.logInPost = (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        console.log(err);

        res.send(err);
      }
      // generate a signed json web token with the contents of user object and return it in the response
      const token = jwt.sign(user, "swole");

      return res.json({ user, token });
    });
  })(req, res);
};
