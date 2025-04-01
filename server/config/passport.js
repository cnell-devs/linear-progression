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

// Custom extractor function that logs token extraction attempts
const extractJwt = (req) => {
  const tokenFromHeader = ExtractJWT.fromAuthHeaderAsBearerToken()(req);
  console.log(
    "JWT extraction from header:",
    tokenFromHeader ? "Token found" : "No token in header"
  );

  if (!tokenFromHeader) {
    // Try to extract from x-access-token header as a fallback
    const tokenFromXAccess = req.headers["x-access-token"];
    console.log(
      "JWT extraction from x-access-token:",
      tokenFromXAccess ? "Token found" : "No token in x-access-token"
    );
    return tokenFromXAccess;
  }

  return tokenFromHeader;
};

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: extractJwt,
      secretOrKey: "swole",
      passReqToCallback: true,
    },
    function (req, jwtPayload, cb) {
      console.log(
        "JWT validation attempt for payload:",
        jwtPayload ? "Payload found" : "No payload"
      );
      console.log("JWT headers:", JSON.stringify(req.headers));
      return cb(null, jwtPayload);
    }
  )
);

module.exports = passport;
