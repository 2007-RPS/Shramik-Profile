import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(globalThis.process?.env?.PORT || 8080);
const NODE_ENV = String(globalThis.process?.env?.NODE_ENV || "development").toLowerCase();
const FRONTEND_ORIGIN = String(globalThis.process?.env?.FRONTEND_ORIGIN || "*");
const CONTACT_RATE_LIMIT_WINDOW_MS = Math.max(
  1000,
  Number(globalThis.process?.env?.CONTACT_RATE_LIMIT_WINDOW_MS || 60000),
);
const CONTACT_RATE_LIMIT_MAX = Math.max(
  1,
  Number(globalThis.process?.env?.CONTACT_RATE_LIMIT_MAX || 20),
);

const workersFile = path.join(__dirname, "data", "workers.json");
const contactLogFile = path.join(__dirname, "data", "contact-submissions.json");
const feedbackLogFile = path.join(__dirname, "data", "feedback-submissions.json");

const allowedOrigins = parseAllowedOrigins(FRONTEND_ORIGIN);

initializeStorage();

app.disable("x-powered-by");
app.set("trust proxy", 1);

function readJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

function initializeStorage() {
  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(workersFile)) {
    writeJson(workersFile, []);
  }
  if (!fs.existsSync(contactLogFile)) {
    writeJson(contactLogFile, []);
  }
  if (!fs.existsSync(feedbackLogFile)) {
    writeJson(feedbackLogFile, []);
  }
}

function parseAllowedOrigins(rawValue) {
  if (!rawValue || rawValue.trim() === "") return ["*"];
  return rawValue
    .split(",")
    .map(function (item) {
      return item.trim();
    })
    .filter(Boolean);
}

function isAllowedOrigin(origin) {
  if (allowedOrigins.includes("*")) return true;
  return allowedOrigins.includes(origin);
}

function createRateLimiter(config) {
  const bucket = new Map();
  const windowMs = config.windowMs;
  const max = config.max;

  return function rateLimiter(req, res, next) {
    const key = String(req.ip || req.headers["x-forwarded-for"] || "unknown");
    const now = Date.now();
    const current = bucket.get(key);

    if (!current || now > current.resetAt) {
      bucket.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (current.count >= max) {
      res.status(429).json({ message: "too many requests, please retry later" });
      return;
    }

    current.count += 1;
    next();
  };
}

function sanitizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

app.use(function (_req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("blocked by cors"));
  },
}));
app.use(express.json({ limit: "1mb" }));

app.get("/", function (_req, res) {
  res.json({
    service: "shramik-backend",
    status: "ok",
    health: "/api/health",
  });
});

app.get("/api/health", function (_req, res) {
  res.json({
    status: "ok",
    service: "shramik-backend",
    env: NODE_ENV,
    uptimeSeconds: Math.floor(globalThis.process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/workers", function (req, res) {
  const workers = readJson(workersFile, []);
  const query = String(req.query.q || "").trim().toLowerCase();
  const city = String(req.query.city || "").trim().toLowerCase();
  const role = String(req.query.role || "").trim().toLowerCase();
  const limit = Math.max(1, Math.min(100, Number(req.query.limit || 20)));

  const filtered = workers.filter(function (worker) {
    const textPass =
      !query ||
      String(worker.name || "").toLowerCase().includes(query) ||
      String(worker.role || "").toLowerCase().includes(query) ||
      String(worker.city || "").toLowerCase().includes(query) ||
      (Array.isArray(worker.skills) && worker.skills.some(function (skill) { return String(skill).toLowerCase().includes(query); }));

    const cityPass = !city || String(worker.city || "").toLowerCase() === city;
    const rolePass = !role || String(worker.role || "").toLowerCase() === role;

    return textPass && cityPass && rolePass;
  });

  res.json({
    count: filtered.length,
    items: filtered.slice(0, limit),
  });
});

app.get("/api/workers/:id", function (req, res) {
  const workers = readJson(workersFile, []);
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "invalid worker id" });
    return;
  }
  const worker = workers.find(function (entry) { return Number(entry.id) === id; });

  if (!worker) {
    res.status(404).json({ message: "worker not found" });
    return;
  }

  res.json(worker);
});

const contactRateLimiter = createRateLimiter({
  windowMs: CONTACT_RATE_LIMIT_WINDOW_MS,
  max: CONTACT_RATE_LIMIT_MAX,
});

app.post("/api/contact", contactRateLimiter, function (req, res) {
  const name = sanitizeText(req.body?.name);
  const phone = sanitizeText(req.body?.phone);
  const message = sanitizeText(req.body?.message);
  const phoneDigits = phone.replace(/\D/g, "");

  if (!name || !phone || !message) {
    res.status(400).json({ message: "name, phone, and message are required" });
    return;
  }

  if (name.length < 2 || name.length > 80) {
    res.status(400).json({ message: "name must be between 2 and 80 characters" });
    return;
  }

  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    res.status(400).json({ message: "phone must be between 10 and 15 digits" });
    return;
  }

  if (message.length < 5 || message.length > 1000) {
    res.status(400).json({ message: "message must be between 5 and 1000 characters" });
    return;
  }

  const submissions = readJson(contactLogFile, []);
  const next = {
    id: Date.now(),
    name,
    phone: phoneDigits,
    message,
    createdAt: new Date().toISOString(),
  };

  submissions.unshift(next);
  writeJson(contactLogFile, submissions.slice(0, 500));

  res.status(201).json({
    message: "saved",
    submissionId: next.id,
  });
});

app.post("/api/feedback", contactRateLimiter, function (req, res) {
  const name = sanitizeText(req.body?.name || "Anonymous");
  const message = sanitizeText(req.body?.message);
  const page = sanitizeText(req.body?.page || "unknown");
  const userType = sanitizeText(req.body?.userType || "guest");
  const rating = Number(req.body?.rating || 0);

  if (!message) {
    res.status(400).json({ message: "message is required" });
    return;
  }

  if (message.length < 5 || message.length > 1000) {
    res.status(400).json({ message: "message must be between 5 and 1000 characters" });
    return;
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    res.status(400).json({ message: "rating must be between 1 and 5" });
    return;
  }

  const submissions = readJson(feedbackLogFile, []);
  const next = {
    id: Date.now(),
    name: name.slice(0, 80),
    message,
    rating,
    page: page.slice(0, 80),
    userType: userType.slice(0, 40),
    createdAt: new Date().toISOString(),
  };

  submissions.unshift(next);
  writeJson(feedbackLogFile, submissions.slice(0, 1000));

  res.status(201).json({
    message: "saved",
    submissionId: next.id,
  });
});

app.use(function (_req, res) {
  res.status(404).json({ message: "route not found" });
});

app.use(function (err, _req, res) {
  if (err && err.message === "blocked by cors") {
    res.status(403).json({ message: "origin not allowed" });
    return;
  }
  if (NODE_ENV !== "test") {
    console.error("unhandled error", err);
  }
  res.status(500).json({ message: "internal server error" });
});

const server = app.listen(PORT, function () {
  console.log(`shramik backend listening on http://localhost:${PORT}`);
});

function shutdown(signal) {
  console.log(`received ${signal}, shutting down`);
  server.close(function () {
    globalThis.process.exit(0);
  });
  setTimeout(function () {
    globalThis.process.exit(1);
  }, 10000).unref();
}

globalThis.process.on("SIGINT", function () { shutdown("SIGINT"); });
globalThis.process.on("SIGTERM", function () { shutdown("SIGTERM"); });

