#!/usr/bin/env node
/**
 * Быстрый скриншот: node scripts/shot.mjs <url> <out.png> [width] [height] [fullPage|scrollY]
 */
import { chromium } from "playwright";

const [url, out, w = "1440", h = "900", mode = ""] = process.argv.slice(2);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
});
await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
await page.waitForTimeout(800);
if (mode === "fullPage") {
  await page.screenshot({ path: out, fullPage: true });
} else {
  if (mode && !Number.isNaN(Number(mode))) {
    await page.evaluate((y) => window.scrollTo(0, y), Number(mode));
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: out });
}
await browser.close();
console.log("saved", out);
