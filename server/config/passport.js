const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const db = require("../models/queries");
const pw = require("../utils/pw-encrypt");
const { JWT_SECRET } = require("./secrets");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUser(username);
      console.log("Local auth attempt for user:", username);

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

// Bearer header, falling back to x-access-token. Nothing is logged here: the
// value is a working credential.
const extractJwt = (req) =>
  ExtractJWT.fromAuthHeaderAsBearerToken()(req) ||
  req.headers["x-access-token"];

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: extractJwt,
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, cb) => {
      try {
        // Resolve the user from the database rather than trusting the token's
        // contents. Previously the payload was returned as-is, so a token with
        // an arbitrary id — or admin: true — was simply believed, and tokens
        // for deleted users kept working.
        const user = await db.getUserById(jwtPayload.id);
        if (!user || !user.id) return cb(null, false);

        const { password, ...safeUser } = user;
        return cb(null, safeUser);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

module.exports = passport;
