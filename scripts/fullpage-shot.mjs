#!/usr/bin/env node
/**
 * Fullpage-скриншот с прокруткой (reveal/lazy): node scripts/fullpage-shot.mjs <route> <out.png> [width]
 */
import { chromium } from "playwright";

const [route = "/", out, w = "1440"] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto("http://localhost:3400" + route, { waitUntil: "load", timeout: 60000 });
await page
  .locator("button", { hasText: "Согласен" })
  .first()
  .click({ timeout: 1200 })
  .catch(() => {});
await page.evaluate(async () => {
  document.documentElement.style.scrollBehavior = "auto";
  for (let y = 0; y < document.body.scrollHeight; y += 700) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(600);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log("saved", out);
