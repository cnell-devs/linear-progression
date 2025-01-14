const {
  home,
  logIn,
  signUp,
  logOut,
  workouts,
  validate,
  weightEntry,
  password,
  verify,
  deleteUserRoute,
} = require("./routes/routes.js");

require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const passport = require("./config/passport.js");

if (process.env.NODE_ENV === "development") {
  // Default to development if NODE_ENV is not set
  process.env.API_URL = process.env.API_URL_DEV;
  process.env.DATABASE_URL = process.env.DATABASE_URL_DEV;
}

const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://linear-progression.vercel.app", // Vercel production URL
];

app.options("*", cors());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman) or from allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }, // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Include cookies if needed
  })
);

app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", home);
app.use(
  "/workouts",
  /* passport.authenticate("jwt", { session: false }) ,*/
  workouts
);
app.use("/signup", signUp);
app.use("/login", logIn);
app.use("/logout", logOut);
app.use("/validate-token", validate);
app.use("/weight-entry", weightEntry);
app.use("/recovery", password);
app.use("/verify", verify);
app.use("/delete", deleteUserRoute);

console.log(`Running in ${process.env.NODE_ENV} mode`);
console.log(`API URL: ${process.env.API_URL}`);

const PORT = 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

module.exports = app;
