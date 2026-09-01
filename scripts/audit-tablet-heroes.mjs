#!/usr/bin/env node
/**
 * One-off tablet hero audit — 768 / 1024 / 1200 px.
 * Usage: node scripts/audit-tablet-heroes.mjs
 */
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "http://127.0.0.1:3400";
const OUT = "e2e/screenshots/tablet-hero-audit";
const WIDTHS = [768, 1024, 1200];
const HEIGHT = 900;

const PAGES = [
  { route: "/", node: "2031:1821", name: "home" },
  { route: "/community", node: "2031:2181", name: "community" },
  { route: "/e_mtd", node: "2031:2610", name: "pelvic" },
  { route: "/r", node: "2042:9157", name: "postpartum" },
  { route: "/for_pregnant", node: "2351:10753", name: "pregnancy" },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const report = [];

for (const pageDef of PAGES) {
  for (const width of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width, height: HEIGHT },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${BASE}${pageDef.route}`, { waitUntil: "load" });
    await page.waitForTimeout(500);

    const metrics = await page.evaluate((nodeId) => {
      const hero = document.querySelector(`[data-figma-node="${nodeId}"]`);
      if (!hero) return { error: "hero not found" };

      const heroRect = hero.getBoundingClientRect();
      const docScrollW = document.documentElement.scrollWidth;
      const clientW = document.documentElement.clientWidth;
      const hasHScroll = docScrollW > clientW + 1;

      const imgs = [...hero.querySelectorAll("img")].map((img, i) => {
        const r = img.getBoundingClientRect();
        const heroR = hero.getBoundingClientRect();
        return {
          i,
          w: Math.round(r.width),
          h: Math.round(r.height),
          top: Math.round(r.top - heroR.top),
          left: Math.round(r.left - heroR.left),
          clippedTop: r.top < heroR.top - 1,
          clippedBottom: r.bottom > heroR.bottom + 1,
          clippedLeft: r.left < heroR.left - 1,
          clippedRight: r.right > heroR.right + 1,
        };
      });

      const cardsRow = hero.querySelector(".flex-col-reverse, [class*='flex-col-reverse']");
      let cards = null;
      if (cardsRow) {
        const cr = cardsRow.getBoundingClientRect();
        cards = {
          top: Math.round(cr.top - heroRect.top),
          bottom: Math.round(cr.bottom - heroRect.top),
          height: Math.round(cr.height),
          overflowsHero: cr.bottom > heroRect.bottom + 2,
        };
      }

      const h1 = hero.querySelector("h1");
      let title = null;
      if (h1) {
        const tr = h1.getBoundingClientRect();
        title = {
          lines: h1.scrollHeight / parseFloat(getComputedStyle(h1).lineHeight),
          clipped: tr.bottom > heroRect.bottom,
          width: Math.round(tr.width),
        };
      }

      const ctas = [...hero.querySelectorAll("a, button")].filter((el) => {
        const t = el.textContent || "";
        return (
          t.includes("Посмотреть программу") ||
          t.includes("Бот предзаписи") ||
          t.includes("бесплатн")
        );
      }).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          text: (el.textContent || "").trim().slice(0, 40),
          visible: r.width > 0 && r.height > 0,
          bottom: Math.round(r.bottom - heroRect.top),
          overflows: r.bottom > heroRect.bottom + 2,
        };
      });

      return {
        heroH: Math.round(heroRect.height),
        heroW: Math.round(heroRect.width),
        hasHScroll,
        scrollW: docScrollW,
        clientW,
        imgs,
        cards,
        title,
        ctas,
      };
    }, pageDef.node);

    const shot = path.join(OUT, `${pageDef.name}-${width}.png`);
    const hero = page.locator(`[data-figma-node="${pageDef.node}"]`);
    await hero.screenshot({ path: shot });

    report.push({
      page: pageDef.name,
      route: pageDef.route,
      width,
      metrics,
      screenshot: shot,
    });

    await context.close();
  }
}

await browser.close();
await writeFile(path.join(OUT, "metrics.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
