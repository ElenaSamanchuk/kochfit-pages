#!/usr/bin/env node
/**
 * Скриншот секции/элемента: node scripts/section-shot.mjs <url> <cssSelector> <out.png> [width] [pad]
 * Прокручивает страницу (reveal/lazy), затем снимает bounding box элемента (+pad по краям).
 */
import { chromium } from "playwright";

const [url, selector, out, w = "1440", padArg = "0"] = process.argv.slice(2);
const pad = Number(padArg);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(url, { waitUntil: "load", timeout: 60000 }).catch(() => {});
await page
  .locator("button", { hasText: "Согласен" })
  .first()
  .click({ timeout: 1200 })
  .catch(() => {});
await page.evaluate(async () => {
  document.documentElement.style.scrollBehavior = "auto";
  for (let y = 0; y < document.body.scrollHeight; y += 700) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 50));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(500);

const el = page.locator(selector).first();
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
const box = await el.boundingBox();
if (!box) {
  console.error("element not found:", selector);
  process.exit(1);
}
const vw = Number(w);
const clip = {
  x: Math.max(0, box.x - pad),
  y: Math.max(0, box.y + (await page.evaluate(() => window.scrollY)) - pad),
  width: Math.min(vw, box.width + pad * 2),
  height: box.height + pad * 2,
};
await page.screenshot({ path: out, fullPage: true, clip });
await browser.close();
console.log("saved", out);
