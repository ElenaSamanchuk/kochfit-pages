#!/usr/bin/env node
/**
 * Скриншоты страниц/секций для аудита сверки с Figma.
 * Использование:
 *   node scripts/audit-shots.mjs <route> <outDir> [width]
 * Пример:
 *   node scripts/audit-shots.mjs /community logs/figma-audit/community 1440
 * Снимает: полный вьюпорт-проход + каждую секцию [data-figma-node] отдельно.
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const route = process.argv[2] ?? "/";
const outDir = process.argv[3] ?? "logs/figma-audit/tmp";
const width = Number(process.argv[4] ?? 1440);
const base = process.env.AUDIT_BASE ?? "http://localhost:3400";

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height: 900 },
  deviceScaleFactor: 1,
});
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(base + route, { waitUntil: "networkidle" });

// Согласие на куки, чтобы баннер не перекрывал секции
await page
  .locator("button", { hasText: "Согласен" })
  .first()
  .click({ timeout: 2000 })
  .catch(() => {});

// Прокрутка до конца, чтобы сработали reveal-анимации и lazy-картинки
await page.evaluate(async () => {
  document.documentElement.style.scrollBehavior = "auto";
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(700);

const sections = await page.$$eval("[data-figma-node]", (els) =>
  els
    .map((el, i) => ({
      i,
      node: el.getAttribute("data-figma-node"),
      h: el.getBoundingClientRect().height,
    }))
    .filter((s) => s.h > 10),
);

const handles = await page.$$("[data-figma-node]");
for (const s of sections) {
  const file = path.join(outDir, `sec-${s.node.replace(":", "-")}.png`);
  try {
    await handles[s.i].scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await handles[s.i].screenshot({ path: file });
    console.log("ok", s.node, Math.round(s.h));
  } catch (e) {
    console.log("FAIL", s.node, e.message.split("\n")[0]);
  }
}

// Общий вид: три вьюпорт-скриншота (верх/середина/низ)
const totalH = await page.evaluate(() => document.body.scrollHeight);
for (const [name, y] of [
  ["top", 0],
  ["mid", Math.max(0, Math.round(totalH / 2 - 450))],
  ["bottom", Math.max(0, totalH - 900)],
]) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, `view-${name}.png`) });
}

// Проверка горизонтального перелива
const overflow = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
}));
console.log("overflow-check", JSON.stringify(overflow));

await browser.close();
