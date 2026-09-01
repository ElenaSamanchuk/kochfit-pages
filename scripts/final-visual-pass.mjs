#!/usr/bin/env node
/**
 * Финальный визуальный прогон: fullpage-скрины 1440/375 + проверка
 * горизонтального скролла на 375 + открытие drawer-меню.
 * Использование: node scripts/final-visual-pass.mjs [outDir]
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";

const routes = ["/equipment", "/result", "/person", "/basket", "/journal", "/st1", "/st7", "/st13"];
const out = process.argv[2] ?? "logs/final-visual";
const base = process.env.AUDIT_BASE ?? "http://localhost:3400";
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();

for (const width of [1440, 375]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of routes) {
    const slug = route.replace(/\//g, "_") || "home";
    await page.goto(base + route, { waitUntil: "load", timeout: 60000 });
    await page
      .locator("button", { hasText: "Согласен" })
      .first()
      .click({ timeout: 1500 })
      .catch(() => {});
    // прокрутка для lazy/reveal
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = "auto";
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      footerGap: (() => {
        const f = document.querySelector("footer");
        if (!f) return null;
        const prev = f.previousElementSibling;
        return prev ? Math.round(f.getBoundingClientRect().top + window.scrollY - (prev.getBoundingClientRect().bottom + window.scrollY)) : null;
      })(),
    }));
    const hscroll = metrics.scrollWidth > metrics.clientWidth ? ` !!HSCROLL ${metrics.scrollWidth}>${metrics.clientWidth}` : "";
    console.log(`${width} ${route}: footerGap=${metrics.footerGap}px${hscroll}`);
    await page.screenshot({ path: `${out}/${width}${slug}.png`, fullPage: true });
  }
  // drawer-меню на первой странице набора
  await page.goto(base + "/result", { waitUntil: "load", timeout: 60000 });
  const burger = page.locator('button[aria-label*="меню" i], button[aria-label*="Открыть" i]').first();
  try {
    await burger.click({ timeout: 3000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${out}/${width}_menu-result.png` });
    console.log(`${width} drawer: открыт на /result`);
  } catch (e) {
    console.log(`${width} drawer: НЕ ОТКРЫЛСЯ — ${e.message.split("\n")[0]}`);
  }
  await page.close();
}
await browser.close();
console.log("done →", out);
