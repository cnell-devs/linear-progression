require("dotenv").config();

// Values that were previously hardcoded in source. The repo is public, so any
// token signed with the old literals must be treated as compromised — these
// are read from the environment and validated at boot rather than defaulted,
// so a missing or weak secret fails loudly instead of silently accepting
// forged tokens.
const COMPROMISED = new Set(["swole", "verify"]);
const MIN_LENGTH = 32;

const requireSecret = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `${name} is not set. Generate one with:\n` +
        `  node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"\n` +
        `then set it in your environment (and in the Vercel project settings).`
    );
  }
  if (COMPROMISED.has(value)) {
    throw new Error(
      `${name} is set to a value that was previously committed to a public ` +
        `repository. Generate a new one.`
    );
  }
  if (value.length < MIN_LENGTH) {
    throw new Error(
      `${name} must be at least ${MIN_LENGTH} characters (got ${value.length}).`
    );
  }
  return value;
};

// Sessions last a month: this is a phone app people open at the gym, and
// there is no refresh-token flow to lean on. Verification and password-reset
// links are short-lived, matching the one hour the tokens table already uses.
module.exports = {
  JWT_SECRET: requireSecret("JWT_SECRET"),
  JWT_VERIFY_SECRET: requireSecret("JWT_VERIFY_SECRET"),
  SESSION_EXPIRES_IN: "30d",
  LINK_EXPIRES_IN: "1h",
};
