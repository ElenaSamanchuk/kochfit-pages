#!/usr/bin/env node
/** node scripts/click-shot.mjs <url> <selector> <out.png> [w] [h] */
import { chromium } from "playwright";
const [url, selector, out, w = "1440", h = "900"] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
await p.waitForTimeout(600);
// закрыть куки, если есть
await p.getByRole("button", { name: /Согласен/i }).click().catch(() => {});
await p.waitForTimeout(300);
await p.locator(selector).first().click({ timeout: 8000 }).catch((e) => console.log("click err", e.message));
await p.waitForTimeout(1200);
await p.screenshot({ path: out });
await b.close();
console.log("saved", out);
