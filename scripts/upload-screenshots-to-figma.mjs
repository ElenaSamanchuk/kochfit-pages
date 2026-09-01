#!/usr/bin/env node
/**
 * POST screenshot PNGs to Figma upload_assets submit URLs.
 * Usage: node scripts/upload-screenshots-to-figma.mjs <uploads.json> <screenshotsDir>
 *
 * uploads.json format (from upload_assets MCP response):
 * { "uploads": [{ "submitUrl": "...", "file": "home-desktop.png" }, ...] }
 */
import fs from "node:fs";
import path from "node:path";

const uploadsFile = process.argv[2];
const dir = process.argv[3] ?? "docs/screenshots-audit";

if (!uploadsFile) {
  console.error("Usage: node scripts/upload-screenshots-to-figma.mjs <uploads.json> [dir]");
  process.exit(1);
}

const { uploads } = JSON.parse(fs.readFileSync(uploadsFile, "utf8"));
const results = [];

for (const u of uploads) {
  const filePath = path.join(dir, u.file);
  if (!fs.existsSync(filePath)) {
    results.push({ file: u.file, ok: false, error: "missing" });
    continue;
  }
  const buf = fs.readFileSync(filePath);
  try {
    const form = new FormData();
    form.append("file", new Blob([buf], { type: "image/png" }), u.file);
    const res = await fetch(u.submitUrl, { method: "POST", body: form });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${text.slice(0, 200)}`);
    }
    const json = await res.json().catch(() => ({}));
    results.push({ file: u.file, ok: true, ...json });
    console.log("OK", u.file);
  } catch (err) {
    results.push({ file: u.file, ok: false, error: err.message });
    console.error("FAIL", u.file, err.message);
  }
}

const out = path.join(dir, "figma-upload-results.json");
fs.writeFileSync(out, JSON.stringify({ results, at: new Date().toISOString() }, null, 2));
console.log(`\n${results.filter((r) => r.ok).length}/${results.length} uploaded → ${out}`);
