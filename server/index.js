require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const passport = require("./config/passport.js");
const router = require("./routes/routes.js");

if (process.env.NODE_ENV === "development") {
  // Default to development if NODE_ENV is not set
  process.env.API_URL = process.env.API_URL_DEV;
  process.env.DATABASE_URL = process.env.DATABASE_URL_DEV;
}

const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://linear-progression.vercel.app", // Vercel production URL
];

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

// Use the router for all routes
app.use("/", router);

console.log(`Running in ${process.env.NODE_ENV} mode`);
console.log(`API URL: ${process.env.API_URL}`);
console.log(`DB URL: ${process.env.DATABASE_URL}`);

const PORT = 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

module.exports = app;
