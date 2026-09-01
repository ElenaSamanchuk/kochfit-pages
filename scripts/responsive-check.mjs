#!/usr/bin/env node
/**
 * Адаптив: горизонтальный перелив на всех основных роутах и ширинах.
 * node scripts/responsive-check.mjs [route1 route2 ...]
 * Падения скриншотит в logs/responsive-fails/.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const base = process.env.AUDIT_BASE ?? "http://localhost:3400";
const widths = [375, 390, 768, 1024, 1200, 1440, 1920];

const defaultRoutes = [
  "/",
  "/community",
  "/e_mtd",
  "/r",
  "/for_pregnant",
  "/journal",
  "/blog/1",
  "/blog/7",
  "/equipment",
  "/result",
  "/person",
  "/faq",
  "/info_referral",
  "/oferta",
  "/privacy",
  "/sale",
  "/taplink",
  "/basket",
  "/suport",
  "/work",
  "/year-results",
  "/tmtd",
  "/teipirovanie1",
  "/st10",
  "/webinars",
  "/care",
  "/delete",
  "/unsubscribe",
  "/yes",
  "/no",
  "/special_recovery3",
  "/standartsub",
];

const routes = process.argv.slice(2).length ? process.argv.slice(2) : defaultRoutes;
fs.mkdirSync("logs/responsive-fails", { recursive: true });

const browser = await chromium.launch();
const fails = [];

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of routes) {
    try {
      await page.goto(base + route, { waitUntil: "load", timeout: 30000 });
      await page.waitForTimeout(400);
      const { sw, iw } = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        iw: window.innerWidth,
      }));
      if (sw > iw) {
        fails.push(`${route} @${width}: scrollWidth ${sw} > ${iw}`);
        const file = `logs/responsive-fails/${route.replace(/\//g, "_") || "home"}-${width}.png`;
        await page.screenshot({ path: file, fullPage: false });
      }
    } catch (e) {
      fails.push(`${route} @${width}: ERROR ${e.message.split("\n")[0]}`);
    }
  }
  await page.close();
  console.log(`width ${width}: done`);
}

console.log(fails.length ? "\nFAILS:\n" + fails.join("\n") : "\nALL OK — перелива нет");
await browser.close();
