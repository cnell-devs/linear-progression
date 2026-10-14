require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const passport = require("./config/passport.js");
const router = require("./routes/routes.js");
const { apiLimiter } = require("./config/rateLimit.js");

if (process.env.NODE_ENV === "development") {
  // Default to development if NODE_ENV is not set
  process.env.API_URL = process.env.API_URL_DEV;
  process.env.DATABASE_URL = process.env.DATABASE_URL_DEV;
}

// Extra origins can be supplied as a comma-separated ALLOWED_ORIGINS env var.
// That matters for renaming the deployment: the hostname here is the live
// frontend, so swapping it for a new name before that name exists would block
// every real request. Adding the new origin by env lets both work during the
// switch, with no code change and no outage window.
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://onerep-fit.vercel.app", // Vercel production URL
  ...(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
];

// In development only, accept any localhost port so the dev server can move
// without editing this list. Gated on an explicit "development" rather than
// "not production" so an unset NODE_ENV on a deployed host fails closed.
const isDevelopment = process.env.NODE_ENV === "development";
const isLocalhost = (origin) =>
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman) or from allowed origins
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (isDevelopment && isLocalhost(origin))
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    // PATCH is required by the session/set endpoints.
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // Include cookies if needed
  })
);

// Vercel terminates TLS upstream, so the client IP is in X-Forwarded-For.
// Without this every request appears to come from the same address and the
// rate limiter would throttle all users collectively.
app.set("trust proxy", 1);
app.use(apiLimiter);

app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use the router for all routes
app.use("/", router);

console.log(`Running in ${process.env.NODE_ENV} mode`);
console.log(`API URL: ${process.env.API_URL}`);
console.log(`DB URL: ${process.env.DATABASE_URL}`);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

module.exports = app;
