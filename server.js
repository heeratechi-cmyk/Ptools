var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports, module) {
    var fs = __require("fs");
    var path2 = __require("path");
    var os = __require("os");
    var crypto = __require("crypto");
    var TIPS = [
      "\u25C8 encrypted .env [www.dotenvx.com]",
      "\u25C8 secrets for agents [www.dotenvx.com]",
      "\u2301 auth for agents [www.vestauth.com]",
      "\u2318 custom filepath { path: '/custom/path/.env' }",
      "\u2318 enable debugging { debug: true }",
      "\u2318 override existing { override: true }",
      "\u2318 suppress logs { quiet: true }",
      "\u2318 multiple files { path: ['.env.local', '.env'] }"
    ];
    function _getRandomTip() {
      return TIPS[Math.floor(Math.random() * TIPS.length)];
    }
    function parseBoolean(value) {
      if (typeof value === "string") {
        return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
      }
      return Boolean(value);
    }
    function supportsAnsi() {
      return process.stdout.isTTY;
    }
    function dim(text) {
      return supportsAnsi() ? `\x1B[2m${text}\x1B[0m` : text;
    }
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.error(`\u26A0 ${message}`);
    }
    function _debug(message) {
      console.log(`\u2506 ${message}`);
    }
    function _log(message) {
      console.log(`\u25C7 ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path2.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
      const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (debug || !quiet) {
        _log("loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path2.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
      let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("no encoding is specified (UTF-8 is used by default)");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`failed to load ${path3} ${e.message}`);
          }
          lastError = e;
        }
      }
      const populated = DotenvModule.populate(processEnv, parsedAll, options);
      debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
      quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
      if (debug || !quiet) {
        const keysCount = Object.keys(populated).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path2.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injected env (${keysCount}) from ${shortPaths.join(",")} ${dim(`// tip: ${_getRandomTip()}`)}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`you set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      const populated = {};
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
            populated[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
          populated[key] = parsed[key];
        }
      }
      return populated;
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module.exports.configDotenv = DotenvModule.configDotenv;
    module.exports._configVault = DotenvModule._configVault;
    module.exports._parseVault = DotenvModule._parseVault;
    module.exports.config = DotenvModule.config;
    module.exports.decrypt = DotenvModule.decrypt;
    module.exports.parse = DotenvModule.parse;
    module.exports.populate = DotenvModule.populate;
    module.exports = DotenvModule;
  }
});

// server.ts
var import_dotenv = __toESM(require_main(), 1);
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import_dotenv.default.config();
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var isProd = process.env.NODE_ENV === "production";
async function createServer() {
  const app = express();
  app.use(express.json());
  app.post("/api/contact", async (req, res) => {
    try {
      const { firstName, lastName, email, message } = req.body;
      if (!email || !message) {
        return res.status(400).json({ error: "Email and message are required." });
      }
      const targetEmail = process.env.CONTACT_EMAIL || "abdullah2317890@gmail.com";
      const formspreeId = process.env.VITE_FORMSPREE_ID || process.env.FORMSPREE_ID;
      const senderName = `${firstName || ""} ${lastName || ""}`.trim() || "Website Visitor";
      const submission = {
        name: senderName,
        email,
        message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      console.log(`[Contact] New submission from ${senderName} (${email}):`, message);
      try {
        const fs = await import("fs");
        const logsDir = path.join(__dirname, "data");
        if (!fs.existsSync(logsDir)) {
          fs.mkdirSync(logsDir, { recursive: true });
        }
        const logFile = path.join(logsDir, "contact_messages.json");
        let currentLogs = [];
        if (fs.existsSync(logFile)) {
          try {
            currentLogs = JSON.parse(fs.readFileSync(logFile, "utf-8"));
          } catch {
            currentLogs = [];
          }
        }
        currentLogs.unshift(submission);
        fs.writeFileSync(logFile, JSON.stringify(currentLogs.slice(0, 200), null, 2));
      } catch (logErr) {
        console.warn("Could not save submission to disk:", logErr);
      }
      let delivered = false;
      try {
        const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Origin": "https://pixeltools.app",
            "Referer": "https://pixeltools.app/contact"
          },
          body: JSON.stringify({
            name: senderName,
            email,
            message,
            _subject: `New PixelTools Message from ${senderName}`,
            _captcha: "false",
            _template: "table"
          })
        });
        const submitData = await formSubmitRes.json().catch(() => ({}));
        console.log(`FormSubmit response status: ${formSubmitRes.status}`, submitData);
        if (formSubmitRes.ok) {
          delivered = true;
        }
      } catch (submitErr) {
        console.error("FormSubmit delivery error:", submitErr);
      }
      if (formspreeId && formspreeId !== "mbjndzoy") {
        try {
          const formspreeRes = await fetch(`https://formspree.io/f/${formspreeId}`, {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: senderName,
              email,
              message
            })
          });
          if (formspreeRes.ok) {
            delivered = true;
            console.log(`Forwarded to Formspree (${formspreeId})`);
          }
        } catch (formspreeErr) {
          console.warn("Formspree forwarding warning:", formspreeErr);
        }
      }
      return res.json({
        ok: true,
        message: "Message sent successfully"
      });
    } catch (err) {
      console.error("Contact endpoint error:", err);
      return res.status(500).json({ error: "Server error processing contact form" });
    }
  });
  app.set("trust proxy", 1);
  const sitemapPages = [
    { path: "/", priority: "1.0", changefreq: "daily" },
    { path: "/pdf-tools", priority: "0.8", changefreq: "weekly" },
    { path: "/image-tools", priority: "0.8", changefreq: "weekly" },
    { path: "/text-tools", priority: "0.8", changefreq: "weekly" },
    { path: "/developer-tools", priority: "0.8", changefreq: "weekly" },
    { path: "/calculator-tools", priority: "0.8", changefreq: "weekly" },
    { path: "/tools/text-to-pdf", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/image-to-pdf", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/merge-pdf", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/split-pdf", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/compress-pdf", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/pdf-watermark", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/pdf-page-counter", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/image-compressor", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/image-resizer", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/jpg-to-png", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/png-to-jpg", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/webp-converter", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/image-cropper", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/word-counter", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/case-converter", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/json-formatter", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/base64-encoder", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/url-encoder", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/html-formatter", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/css-minifier", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/js-minifier", priority: "0.9", changefreq: "monthly" },
    { path: "/tools/percentage-calculator", priority: "0.9", changefreq: "monthly" },
    { path: "/about", priority: "0.6", changefreq: "monthly" },
    { path: "/contact", priority: "0.6", changefreq: "monthly" },
    { path: "/privacy", priority: "0.4", changefreq: "monthly" },
    { path: "/terms", priority: "0.4", changefreq: "monthly" },
    { path: "/disclaimer", priority: "0.4", changefreq: "monthly" }
  ];
  function buildSitemapXml(baseUrl) {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages.map((p) => `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>`;
  }
  function resolveRequestBaseUrl(req, forcedDomain) {
    if (forcedDomain) {
      return `https://${forcedDomain}`;
    }
    const forwardedProto = req.headers["x-forwarded-proto"]?.split(",")[0].trim();
    const rawHost = req.headers["x-forwarded-host"]?.split(",")[0].trim() || req.get("host") || "pixeltools-tau.vercel.app";
    const hostWithoutPort = rawHost.split(":")[0];
    const isLocal = hostWithoutPort === "localhost" || hostWithoutPort === "127.0.0.1";
    const effectiveHost = isLocal ? "pixeltools-tau.vercel.app" : hostWithoutPort;
    const protocol = forwardedProto || (effectiveHost.includes("vercel.app") || effectiveHost.includes("pixeltools") ? "https" : req.protocol || "https");
    return `${protocol}://${effectiveHost}`;
  }
  app.get(["/sitemap.xml", "/sitemap_index.xml"], (req, res) => {
    const baseUrl = resolveRequestBaseUrl(req);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(buildSitemapXml(baseUrl));
  });
  app.get("/sitemap-non-www.xml", (req, res) => {
    const baseUrl = resolveRequestBaseUrl(req);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(buildSitemapXml(baseUrl));
  });
  app.get("/sitemap-www.xml", (req, res) => {
    const baseUrl = resolveRequestBaseUrl(req);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(buildSitemapXml(baseUrl));
  });
  app.get("/robots.txt", (req, res) => {
    const baseUrl = resolveRequestBaseUrl(req);
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(robotsTxt);
  });
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }
  const port = process.env.PORT || 3e3;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
createServer();
