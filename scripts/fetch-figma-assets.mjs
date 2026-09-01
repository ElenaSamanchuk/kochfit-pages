#!/usr/bin/env node
/**
 * Скачивает ассеты из ответа Figma MCP (get_design_context).
 * Использование: node scripts/fetch-figma-assets.mjs <response.txt> <public/images/dir>
 * Парсит строки вида: const name = "https://www.figma.com/api/mcp/asset/....png";
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [, , responseFile, outDir] = process.argv;
if (!responseFile || !outDir) {
  console.error("usage: fetch-figma-assets.mjs <response.txt> <outDir>");
  process.exit(1);
}

const text = await readFile(responseFile, "utf8");
const re = /const\s+(\w+)\s*=\s*"(https:\/\/www\.figma\.com\/api\/mcp\/asset\/[^"]+)"/g;
const seen = new Map();
for (const m of text.matchAll(re)) {
  const [, name, url] = m;
  if (!seen.has(url)) seen.set(url, name);
}

await mkdir(outDir, { recursive: true });
let ok = 0;
for (const [url, name] of seen) {
  const ext = path.extname(new URL(url).pathname) || ".png";
  const file = path.join(outDir, `${name}${ext}`);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAIL ${name} ${res.status} ${url}`);
    continue;
  }
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  ok++;
  console.log(`ok ${path.basename(file)}`);
}
console.log(`done: ${ok}/${seen.size}`);
