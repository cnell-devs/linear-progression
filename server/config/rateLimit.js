const rateLimit = require("express-rate-limit");

// Note on serverless: the default store is per-instance memory, so limits are
// enforced per warm lambda rather than globally. That still blunts the cases
// that matter — a single client hammering login, or a runaway loop burning
// invocations — but a determined distributed attacker would need a shared
// store (Redis) to stop properly. Worth revisiting if abuse shows up.

const message = (retryAfterHint) => ({
  error: `Too many requests. ${retryAfterHint}`,
  code: "RATE_LIMITED",
});

// Credential endpoints: brute force is the real risk, and nobody legitimately
// signs in ten times a minute.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only failures count toward the limit
  message: message("Try again in a few minutes."),
});

// Sending mail costs money and is a spam vector.
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: message("Try again later."),
});

// Everything else. Generous enough that normal use never notices: a workout
// sync is debounced, so even heavy logging is a handful of requests a minute.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  // Overridable so integration tests can burst without tripping it.
  limit: Number(process.env.RATE_LIMIT_MAX) || 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: message("Slow down."),
});

module.exports = { authLimiter, emailLimiter, apiLimiter };
