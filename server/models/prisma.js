const { PrismaClient } = require("@prisma/client");

// One client for the whole process.
//
// Each PrismaClient owns its own connection pool, defaulting to
// num_cpus * 2 + 1. The query modules used to construct one apiece, so a
// single instance could hold three pools — up to ~63 connections — and every
// concurrent serverless invocation multiplied that against the same database.
//
// connection_limit=1 is the right setting behind a transaction pooler: the
// pooler does the multiplexing, so each short-lived function instance only
// needs a single connection. Applied to the URL here rather than in the
// environment so it cannot be lost when someone edits a dashboard.
const withPoolLimit = (url) => {
  if (!url) return url;
  if (url.includes("connection_limit=")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}connection_limit=1`;
};

const createClient = () =>
  new PrismaClient({
    datasources: { db: { url: withPoolLimit(process.env.DATABASE_URL) } },
  });

// Reuse across hot invocations and across module reloads in watch mode;
// without this, `node --watch` leaks a pool on every restart.
const globalForPrisma = globalThis;
const prisma = globalForPrisma.__prisma || createClient();
if (!globalForPrisma.__prisma) globalForPrisma.__prisma = prisma;

module.exports = prisma;
