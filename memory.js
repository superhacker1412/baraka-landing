/**
 * Barakali Savdo — backend (forms + admin)
 * =========================================
 *
 * Bu bitta fayl. Hech qanday `npm install` shart emas — faqat Node.js (18+).
 * (This is a single file. No `npm install` needed — only Node.js 18+.)
 *
 * U nima qiladi:
 *   - Saytdagi formalardan kelgan arizalarni serverda JSON faylga yozadi
 *   - Admin panel uchun login va arizalar ro'yxatini beradi
 *   - Tayyor `dist/` papkasini ham xizmat qiladi (Nginx bo'lmasa ham ishlaydi)
 *
 * Ishga tushirish (serverda):
 *   node memory.js
 *
 * Sozlamalar (ixtiyoriy, environment orqali):
 *   PORT=8080                       — qaysi portda ishlaydi
 *   HOST=0.0.0.0                    — tinglovchi manzil
 *   DATA_DIR=./data                 — arizalar saqlanadigan papka
 *   DIST_DIR=./dist                 — frontend build papkasi
 *   ADMIN_EMAIL=amir@gmail.com      — admin login
 *   ADMIN_PASSWORD=Koma1Qwerty1     — admin parol
 *   RECAPTCHA_SECRET=...            — (ixtiyoriy) reCAPTCHA server tekshiruvi
 *   RECAPTCHA_MIN_SCORE=0.5         — v3 minimal ball
 *
 * Arizalar quyidagi fayllarga yoziladi:
 *   data/pre-registrations.json     — oldindan ro'yxatdan o'tganlar
 *   data/feedback.json              — taklif va xabarlar
 *   data/submissions.log            — barcha arizalar matn ko'rinishida (zaxira)
 *
 * Doimiy ishlashi uchun (server qayta yuklansa ham) pm2 yoki systemd ishlating:
 *   pm2 start memory.js --name barakali
 */

import http from "node:http";
import https from "node:https";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createReadStream } from "node:fs";
import { readFile, writeFile, appendFile, mkdir, stat } from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "0.0.0.0";
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, "data");
const DIST_DIR = process.env.DIST_DIR
  ? path.resolve(process.env.DIST_DIR)
  : path.join(__dirname, "dist");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "amir@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Koma1Qwerty1";
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET || "";
const RECAPTCHA_MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);

const PRE_REG_FILE = path.join(DATA_DIR, "pre-registrations.json");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json");
const LOG_FILE = path.join(DATA_DIR, "submissions.log");

const BUSINESS_TYPES = [
  "Sotuvchi",
  "Do'kon",
  "Yetkazib beruvchi",
  "Ombor egasi",
  "Kuryer",
  "Xaridor",
  "Boshqa",
];
const TOPICS = [
  "Hamkorlik",
  "Ombor qo'shish",
  "Yetkazib beruvchi bo'lish",
  "Taklif",
  "Muammo",
  "Boshqa",
];

// --- helpers ----------------------------------------------------------------

function genId() {
  return `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

function clip(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function getIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "";
}

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readArray(file) {
  try {
    const raw = await readFile(file, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (err && err.code === "ENOENT") return [];
    console.error(`[memory] read error ${file}:`, err.message);
    return [];
  }
}

// Serialize writes per file so concurrent submissions never clobber each other.
const writeChains = new Map();
function withFileLock(file, task) {
  const prev = writeChains.get(file) || Promise.resolve();
  const next = prev.then(task, task);
  writeChains.set(
    file,
    next.then(
      () => {},
      () => {},
    ),
  );
  return next;
}

async function appendEntry(file, entry) {
  return withFileLock(file, async () => {
    const all = await readArray(file);
    all.unshift(entry);
    await writeFile(file, JSON.stringify(all, null, 2), "utf8");
    return entry;
  });
}

async function appendLog(kind, entry) {
  try {
    const line = `${entry.createdAt}\t${kind}\t${entry.name}\t${entry.phone}\t${
      entry.businessType || entry.topic || ""
    }\t${entry.city || ""}\tip=${entry.ip || ""}\n`;
    await appendFile(LOG_FILE, line, "utf8");
  } catch {
    // logging is best-effort
  }
}

function computeStats(preRegs, feedback) {
  const byBusinessType = {};
  for (const item of preRegs) {
    byBusinessType[item.businessType] = (byBusinessType[item.businessType] ?? 0) + 1;
  }
  const byTopic = {};
  for (const item of feedback) {
    byTopic[item.topic] = (byTopic[item.topic] ?? 0) + 1;
  }
  return {
    preRegistrationCount: preRegs.length,
    feedbackCount: feedback.length,
    totalCount: preRegs.length + feedback.length,
    byBusinessType,
    byTopic,
  };
}

// --- sessions (admin) -------------------------------------------------------

const sessions = new Map(); // token -> expiresAt (ms)
const SESSION_TTL = 1000 * 60 * 60 * 24; // 24h

function createSession() {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + SESSION_TTL);
  return token;
}

function isValidSession(token) {
  if (!token) return false;
  const exp = sessions.get(token);
  if (!exp) return false;
  if (Date.now() > exp) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function bearerToken(req) {
  const h = req.headers["authorization"] || "";
  return h.startsWith("Bearer ") ? h.slice(7).trim() : "";
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

// --- reCAPTCHA (optional) ---------------------------------------------------

function verifyRecaptcha(token) {
  return new Promise((resolve) => {
    if (!RECAPTCHA_SECRET) return resolve({ ok: true, skipped: true });
    if (!token) return resolve({ ok: false });
    const body = new URLSearchParams({
      secret: RECAPTCHA_SECRET,
      response: token,
    }).toString();
    const req = https.request(
      {
        hostname: "www.google.com",
        path: "/recaptcha/api/siteverify",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
        timeout: 8000,
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            const j = JSON.parse(data);
            const scoreOk = j.score === undefined || j.score >= RECAPTCHA_MIN_SCORE;
            resolve({ ok: Boolean(j.success) && scoreOk, detail: j });
          } catch {
            resolve({ ok: false });
          }
        });
      },
    );
    req.on("error", () => resolve({ ok: false }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ ok: false });
    });
    req.write(body);
    req.end();
  });
}

// --- http plumbing ----------------------------------------------------------

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 1_000_000) {
        reject(new Error("payload too large"));
        req.destroy();
        return;
      }
      data += chunk;
    });
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error("invalid json"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, obj, origin) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    Vary: "Origin",
  });
  res.end(body);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
};

async function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath.split("?")[0]);
  if (rel.includes("..")) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  if (rel === "/") rel = "/index.html";

  let filePath = path.join(DIST_DIR, rel);
  let info = await stat(filePath).catch(() => null);

  // SPA fallback: unknown route without extension -> index.html
  if ((!info || info.isDirectory()) && !path.extname(rel)) {
    filePath = path.join(DIST_DIR, "index.html");
    info = await stat(filePath).catch(() => null);
  }

  if (!info || !info.isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  createReadStream(filePath).pipe(res);
}

// --- route handlers ---------------------------------------------------------

async function handlePreRegistration(req, res, origin) {
  const body = await readBody(req);
  const captcha = await verifyRecaptcha(body.captchaToken);
  if (!captcha.ok) return sendJson(res, 400, { error: "captcha" }, origin);

  const name = clip(body.name, 120);
  const phone = clip(body.phone, 40);
  const city = clip(body.city, 120);
  const businessTypeRaw = clip(body.businessType, 40);

  if (!name || !phone || !businessTypeRaw || !city) {
    return sendJson(res, 400, { error: "validation" }, origin);
  }

  const entry = {
    id: genId(),
    name,
    phone,
    email: clip(body.email, 160) || null,
    businessType: BUSINESS_TYPES.includes(businessTypeRaw) ? businessTypeRaw : "Boshqa",
    city,
    note: clip(body.note, 1000) || null,
    ip: getIp(req),
    createdAt: new Date().toISOString(),
  };

  await appendEntry(PRE_REG_FILE, entry);
  await appendLog("pre-registration", entry);
  console.log(`[memory] pre-registration: ${entry.name} (${entry.phone}) — ${entry.city}`);
  return sendJson(res, 200, { ok: true, id: entry.id }, origin);
}

async function handleFeedback(req, res, origin) {
  const body = await readBody(req);
  const captcha = await verifyRecaptcha(body.captchaToken);
  if (!captcha.ok) return sendJson(res, 400, { error: "captcha" }, origin);

  const name = clip(body.name, 120);
  const phone = clip(body.phone, 40);
  const topicRaw = clip(body.topic, 40);
  const message = clip(body.message, 4000);

  if (!name || !phone || !topicRaw || !message) {
    return sendJson(res, 400, { error: "validation" }, origin);
  }

  const entry = {
    id: genId(),
    name,
    phone,
    topic: TOPICS.includes(topicRaw) ? topicRaw : "Boshqa",
    message,
    ip: getIp(req),
    createdAt: new Date().toISOString(),
  };

  await appendEntry(FEEDBACK_FILE, entry);
  await appendLog("feedback", entry);
  console.log(`[memory] feedback: ${entry.name} (${entry.phone}) — ${entry.topic}`);
  return sendJson(res, 200, { ok: true, id: entry.id }, origin);
}

async function handleAdminLogin(req, res, origin) {
  const body = await readBody(req);
  const captcha = await verifyRecaptcha(body.captchaToken);
  if (!captcha.ok) return sendJson(res, 400, { error: "captcha" }, origin);

  const email = clip(body.email, 160);
  const password = String(body.password ?? "");
  if (safeEqual(email, ADMIN_EMAIL) && safeEqual(password, ADMIN_PASSWORD)) {
    return sendJson(res, 200, { token: createSession() }, origin);
  }
  return sendJson(res, 401, { error: "invalid_credentials" }, origin);
}

async function handleAdminData(req, res, origin) {
  if (!isValidSession(bearerToken(req))) {
    return sendJson(res, 401, { error: "unauthorized" }, origin);
  }
  const [preRegistrations, feedback] = await Promise.all([
    readArray(PRE_REG_FILE),
    readArray(FEEDBACK_FILE),
  ]);
  return sendJson(
    res,
    200,
    { preRegistrations, feedback, stats: computeStats(preRegistrations, feedback) },
    origin,
  );
}

// --- server -----------------------------------------------------------------

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  const url = req.url || "/";
  const pathOnly = url.split("?")[0];

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      Vary: "Origin",
    });
    res.end();
    return;
  }

  try {
    if (req.method === "POST" && pathOnly === "/api/pre-registration") {
      return await handlePreRegistration(req, res, origin);
    }
    if (req.method === "POST" && pathOnly === "/api/feedback") {
      return await handleFeedback(req, res, origin);
    }
    if (req.method === "POST" && pathOnly === "/api/admin/login") {
      return await handleAdminLogin(req, res, origin);
    }
    if (req.method === "GET" && pathOnly === "/api/admin/data") {
      return await handleAdminData(req, res, origin);
    }
    if (req.method === "GET" && pathOnly === "/api/health") {
      return sendJson(res, 200, { ok: true }, origin);
    }
    if (pathOnly.startsWith("/api/")) {
      return sendJson(res, 404, { error: "not_found" }, origin);
    }

    if (req.method === "GET" || req.method === "HEAD") {
      return await serveStatic(req, res, url);
    }

    return sendJson(res, 405, { error: "method_not_allowed" }, origin);
  } catch (err) {
    console.error("[memory] error:", err.message);
    if (!res.headersSent) sendJson(res, 400, { error: "bad_request" }, origin);
    else res.end();
  }
});

await ensureDataDir();
server.listen(PORT, HOST, () => {
  console.log(`[memory] Barakali backend ishlayapti — http://${HOST}:${PORT}`);
  console.log(`[memory] Arizalar papkasi: ${DATA_DIR}`);
  console.log(`[memory] Frontend (dist): ${DIST_DIR}`);
  console.log(
    `[memory] reCAPTCHA tekshiruvi: ${RECAPTCHA_SECRET ? "yoqilgan" : "o'chirilgan (RECAPTCHA_SECRET yo'q)"}`,
  );
});
