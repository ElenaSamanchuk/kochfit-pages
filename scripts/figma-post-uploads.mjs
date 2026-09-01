#!/usr/bin/env node
/**
 * POST screenshot files to Figma upload_assets submit URLs.
 * Usage: node scripts/figma-post-uploads.mjs <figma-upload-response.json> <batch-files.json> [dir]
 */
import fs from "node:fs";
import path from "node:path";

const responseFile = process.argv[2];
const batchFile = process.argv[3];
const dir = process.argv[4] ?? "docs/screenshots-audit";

const { uploads } = JSON.parse(fs.readFileSync(responseFile, "utf8"));
const { files } = JSON.parse(fs.readFileSync(batchFile, "utf8"));

if (uploads.length !== files.length) {
  console.error(`Mismatch: ${uploads.length} URLs vs ${files.length} files`);
  process.exit(1);
}

const results = [];
for (let i = 0; i < uploads.length; i++) {
  const file = files[i];
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    results.push({ file, ok: false, error: "missing" });
    console.error("MISSING", file);
    continue;
  }
  const buf = fs.readFileSync(filePath);
  const type = file.endsWith(".jpg") ? "image/jpeg" : "image/png";
  try {
    const form = new FormData();
    form.append("file", new Blob([buf], { type }), file);
    const res = await fetch(uploads[i].submitUrl, { method: "POST", body: form });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
    const json = JSON.parse(text);
    results.push({ file, ok: true, ...json });
    console.log("OK", file);
  } catch (err) {
    results.push({ file, ok: false, error: err.message });
    console.error("FAIL", file, err.message);
  }
}

const batchNum = path.basename(batchFile).match(/(\d+)/)?.[1] ?? "0";
const out = path.join(dir, `figma-upload-batch-${batchNum}-results.json`);
fs.writeFileSync(out, JSON.stringify({ results, at: new Date().toISOString() }, null, 2));
console.log(`\n${results.filter((r) => r.ok).length}/${results.length} → ${out}`);
