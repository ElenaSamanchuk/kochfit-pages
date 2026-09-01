#!/usr/bin/env node
/**
 * Ускоренный адаптив-аудит: сначала 375+1440 (критичные), потом остальные ширины.
 * node scripts/recheck-adapt.mjs before|after
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";

const phase = process.argv[2] === "after" ? "after" : "before";
const routes = [
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
  "/st10",
  "/oferta",
  "/privacy",
];
// priority first
const widths = [375, 1440, 390, 768, 1024, 1200];
const out = `logs/recheck-adapt/${phase}`;
const base = process.env.AUDIT_BASE ?? "http://localhost:3400";
fs.mkdirSync(out, { recursive: true });

const slugOf = (route) => (route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, ""));

const report = [];
const browser = await chromium.launch();

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const route of routes) {
    const slug = slugOf(route);
    const entry = { route, width, slug, phase };
    try {
      await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page
        .locator("button", { hasText: "Согласен" })
        .first()
        .click({ timeout: 800 })
        .catch(() => {});
      await page.evaluate(async () => {
        document.documentElement.style.scrollBehavior = "auto";
        for (let y = 0; y < Math.min(document.body.scrollHeight, 6000); y += 900) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 30));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(200);

      const metrics = await page.evaluate((checkTouch) => {
        const cw = document.documentElement.clientWidth;
        const sw = document.documentElement.scrollWidth;
        const res = {
          scrollWidth: sw,
          clientWidth: cw,
          hscroll: sw > cw + 1,
          offenders: [],
          smallTargets: [],
          clippedText: [],
          hasFooter: !!document.querySelector("footer"),
          hasHeader: !!document.querySelector("header, nav"),
        };
        const visible = (el) => {
          const s = getComputedStyle(el);
          if (s.display === "none" || s.visibility === "hidden" || +s.opacity === 0) return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        };
        if (res.hscroll) {
          for (const el of document.querySelectorAll("body *")) {
            if (res.offenders.length >= 6) break;
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            if (r.right > cw + 2 || r.left < -2) {
              if (
                [...el.children].some((c) => {
                  const cr = c.getBoundingClientRect();
                  return cr.right >= r.right - 1 || cr.left <= r.left + 1;
                })
              )
                continue;
              const cls = typeof el.className === "string" ? el.className.slice(0, 80) : "";
              res.offenders.push(
                `${el.tagName.toLowerCase()}${cls ? "." + cls.trim().split(/\s+/).slice(0, 3).join(".") : ""} L${Math.round(r.left)} R${Math.round(r.right)}`,
              );
            }
          }
        }
        if (checkTouch) {
          for (const el of document.querySelectorAll("a, button")) {
            if (res.smallTargets.length >= 10) break;
            if (!visible(el)) continue;
            const r = el.getBoundingClientRect();
            if (r.width < 44 && r.height < 44) {
              const label =
                (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40) ||
                "(без текста)";
              if (label.length > 35 && r.height < 20) continue;
              res.smallTargets.push(
                `<${el.tagName.toLowerCase()}> "${label}" ${Math.round(r.width)}x${Math.round(r.height)}`,
              );
            }
          }
        }
        for (const el of document.querySelectorAll("h1, h2, p, a, button")) {
          if (res.clippedText.length >= 4) break;
          if (!visible(el)) continue;
          if (el.scrollWidth > el.clientWidth + 3 && el.clientWidth > 50) {
            const t = (el.textContent || "").trim().slice(0, 36);
            if (t.length > 3)
              res.clippedText.push(`${el.tagName.toLowerCase()} "${t}"`);
          }
        }
        return res;
      }, width <= 390);

      Object.assign(entry, metrics);
      await page.screenshot({ path: `${out}/${width}_${slug}.png`, fullPage: false });

      if (width === 375 && (route === "/" || route === "/community" || route === "/person")) {
        try {
          await page
            .locator('button[aria-label*="меню" i], button[aria-label*="Открыть" i]')
            .first()
            .click({ timeout: 2000 });
          await page.waitForTimeout(400);
          await page.screenshot({ path: `${out}/375_${slug}_menu.png` });
          entry.menuOk = true;
          await page.keyboard.press("Escape");
        } catch (e) {
          entry.menuError = e.message.split("\n")[0];
        }
      }
    } catch (e) {
      entry.error = e.message.split("\n")[0];
    }
    report.push(entry);
    const flags = [
      entry.error ? "ERR" : null,
      entry.hscroll ? `HSCROLL ${entry.scrollWidth}>${entry.clientWidth}` : null,
      entry.smallTargets?.length ? `${entry.smallTargets.length}small` : null,
      entry.clippedText?.length ? `${entry.clippedText.length}clip` : null,
      entry.hasFooter === false ? "NOFOOT" : null,
      entry.menuError ? "MENU" : null,
    ].filter(Boolean);
    console.log(`${width} ${route}: ${flags.length ? flags.join(" | ") : "OK"}`);
  }
  await page.close();
}

await browser.close();
fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
const h = report.filter((r) => r.hscroll);
const sm = report.filter((r) => (r.smallTargets || []).length);
console.log("\n=== SUMMARY ===");
console.log("hscroll", h.length, h.map((r) => `${r.route}@${r.width}`).join(", "));
console.log("smallTargets pages", sm.length);
console.log("→", `${out}/report.json`);
