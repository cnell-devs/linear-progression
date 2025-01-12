// const passport = require("passport");
// const jwt = require("jsonwebtoken");
// const express = require("express");
// const app = express();

// app.use(passport.initialize());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// const logInPost = (req, res) => {
//   passport.authenticate("local", { session: false }, (err, user, info) => {
//     if (err || !user) {
//       return res.status(400).json({
//         message: "Something is not right",
//         user: user,
//       });
//     }
//     req.login(user, { session: false }, (err) => {
//       if (err) {
//         console.log(err);

//         res.send(err);
//       }
//       // generate a signed json web token with the contents of user object and return it in the response
//       const token = jwt.sign(user, "swole");

//       return res.json({ user, token });
//     });
//   })(req, res);
// };

// app.post('/', logInPost)
// module.exports = (req, res) => {
//   app(req, res);
// };