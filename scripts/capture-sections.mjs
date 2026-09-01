#!/usr/bin/env node
/**
 * Скриншоты всех секций страницы с data-figma-node:
 * node scripts/capture-sections.mjs <route> <outDir> [width]
 * Файлы: <outDir>/site-<node id с _>.png
 */
import { chromium } from "playwright";
import fs from "node:fs";

const [route = "/", outDir = "logs/final2/pixel", w = "1440"] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });

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

const nodes = await page.evaluate(() =>
  [...document.querySelectorAll("[data-figma-node]")].map((el) => ({
    id: el.getAttribute("data-figma-node"),
    tag: el.tagName,
  })),
);
// только крупные секции (section/footer), без вложенных мелких
const seen = new Set();
for (const { id, tag } of nodes) {
  if (seen.has(id)) continue;
  seen.add(id);
  if (!["SECTION", "FOOTER"].includes(tag)) continue;
  const el = page.locator(`[data-figma-node="${id}"]`).first();
  try {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    await el.screenshot({ path: `${outDir}/site-${id.replace(":", "_")}.png` });
    console.log("saved", id);
  } catch (e) {
    console.log("skip", id, e.message.split("\n")[0]);
  }
}
await browser.close();
