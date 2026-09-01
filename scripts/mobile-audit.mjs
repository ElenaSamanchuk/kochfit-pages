// Мобильный аудит: скрины + автопроверки (overflow, тач-таргеты, мелкий текст, искажённые картинки)
// Использование: node scripts/mobile-audit.mjs <outDir> [width] [height]
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2] || "logs/mobile-audit/before";
const W = Number(process.argv[3] || 375);
const H = Number(process.argv[4] || 812);
const BASE = "http://localhost:3400";

const PAGES = [
  "/",
  "/community",
  "/e_mtd",
  "/r",
  "/for_pregnant",
  "/equipment",
  "/journal",
  "/result",
  "/person",
  "/basket",
  "/info_referral",
  "/st1",
  "/st7",
  "/oferta",
];

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});
await ctx.addInitScript(() => {
  localStorage.setItem("cookieConsent", "accepted");
  document.cookie = "kochfit_vk_notice_closed=1; Path=/; SameSite=Lax";
});
const page = await ctx.newPage();

const report = [];

for (const route of PAGES) {
  const slug = route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
  // Новый Chromium иногда теряет эмуляцию вьюпорта между страницами — переустанавливаем
  await page.setViewportSize({ width: W, height: H });
  try {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  } catch {
    await page.waitForTimeout(2000);
  }
  await page.waitForTimeout(800);
  // Прокрутка до низа, чтобы прогрузились lazy-картинки и reveal-анимации
  try {
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
  } catch {
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(500);

  let audit;
  try {
    audit = await page.evaluate(() => {
    const vw = window.innerWidth;
    const res = {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: vw,
      hasHScroll: document.documentElement.scrollWidth > vw + 1,
      overflowing: [],
      smallTargets: [],
      tinyText: [],
      distortedImgs: [],
    };

    const describe = (el) => {
      const tag = el.tagName.toLowerCase();
      const cls = (typeof el.className === "string" ? el.className : "")
        .split(/\s+/)
        .slice(0, 4)
        .join(".");
      const txt = (el.textContent || "").trim().slice(0, 40);
      return `${tag}${cls ? "." + cls : ""}${txt ? ` «${txt}»` : ""}`;
    };

    // Элементы, вылезающие за вьюпорт
    for (const el of document.querySelectorAll("body *")) {
      if (el.closest(".site-menu")) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const style = getComputedStyle(el);
      if (style.position === "fixed") continue;
      if (style.visibility === "hidden") continue;
      if (r.right > vw + 2 || r.left < -2) {
        // пропускаем детей уже зафиксированного overflow-контейнера со скроллом
        let p = el.parentElement;
        let insideScroller = false;
        while (p) {
          const ps = getComputedStyle(p);
          if (/(auto|scroll)/.test(ps.overflowX)) {
            insideScroller = true;
            break;
          }
          // Локальный клиппер (не page-level main/body): декор обрезан и скролл не создаёт
          if (
            /(hidden|clip)/.test(ps.overflowX) &&
            p.tagName !== "MAIN" &&
            p.tagName !== "BODY" &&
            p.getBoundingClientRect().right <= vw + 2 &&
            p.getBoundingClientRect().left >= -2
          ) {
            insideScroller = true;
            break;
          }
          p = p.parentElement;
        }
        if (!insideScroller && res.overflowing.length < 25) {
          res.overflowing.push(
            `${describe(el)} [left=${Math.round(r.left)}, right=${Math.round(r.right)}, w=${Math.round(r.width)}]`
          );
        }
      }
    }

    // Тач-таргеты < 44px
    for (const el of document.querySelectorAll("a, button, [role=button], input, select, summary")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const st = getComputedStyle(el);
      if (st.visibility === "hidden") continue;
      // Инлайновые ссылки в тексте — не тач-таргеты в UI-смысле
      if (st.display === "inline") continue;
      if ((r.height < 32 || (r.height < 44 && r.width < 44)) && res.smallTargets.length < 30) {
        res.smallTargets.push(`${describe(el)} [${Math.round(r.width)}x${Math.round(r.height)}]`);
      }
    }

    // Текст мельче 12px
    const seen = new Set();
    for (const el of document.querySelectorAll("body *")) {
      if (!el.childNodes.length) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (getComputedStyle(el).visibility === "hidden") continue;
      const hasText = [...el.childNodes].some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 2
      );
      if (!hasText) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 12) {
        const key = describe(el);
        if (!seen.has(key) && res.tinyText.length < 20) {
          seen.add(key);
          res.tinyText.push(`${key} [${fs}px]`);
        }
      }
    }

    // Искажённые картинки (aspect ratio отличается > 12% и не object-fit cover/contain)
    for (const img of document.querySelectorAll("img")) {
      if (!img.naturalWidth || !img.naturalHeight) continue;
      const r = img.getBoundingClientRect();
      if (r.width < 20 || r.height < 20) continue;
      const fit = getComputedStyle(img).objectFit;
      if (fit === "cover" || fit === "contain") continue;
      const natural = img.naturalWidth / img.naturalHeight;
      const rendered = r.width / r.height;
      if (Math.abs(natural - rendered) / natural > 0.12 && res.distortedImgs.length < 15) {
        res.distortedImgs.push(
          `${img.src.split("/").pop().slice(0, 50)} natural=${natural.toFixed(2)} rendered=${rendered.toFixed(2)}`
        );
      }
    }

    return res;
  });
  } catch (err) {
    console.warn(`${route} audit evaluate failed: ${err.message}`);
    audit = {
      scrollWidth: W,
      innerWidth: W,
      hasHScroll: false,
      overflowing: [],
      smallTargets: [],
      tinyText: [],
      distortedImgs: [],
      error: err.message,
    };
  }

  await page.screenshot({ path: path.join(OUT, `${slug}.png`), fullPage: true });
  report.push({ route, ...audit });
  const flag = audit.hasHScroll ? "H-SCROLL!" : "ok";
  console.log(
    `${route.padEnd(16)} ${flag.padEnd(10)} scrollW=${audit.scrollWidth} overflow=${audit.overflowing.length} smallTargets=${audit.smallTargets.length} tinyText=${audit.tinyText.length} distorted=${audit.distortedImgs.length}`
  );
}

fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
console.log("\nReport: " + path.join(OUT, "report.json"));
await browser.close();
