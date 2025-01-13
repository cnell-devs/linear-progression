const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const db = require("../models/queries");
const pw = require("../utils/pw-encrypt");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUser(username);
console.log(user);

      if (!user) {
        return done(null, false, { message: "Invalid username" });
      }
      const isMatch = await pw.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user, { message: "Logged in successfully" });
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "swole",
    },
    function (jwtPayload, cb) {
      return cb(null, jwtPayload);
    }
  )
);

module.exports = passport;
