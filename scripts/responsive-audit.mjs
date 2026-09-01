#!/usr/bin/env node
/**
 * Аудит адаптива: fullpage-скрины + проверки (hscroll, тач-таргеты, header/footer, drawer)
 * для 11 страниц × 5 вьюпортов. Ничего не меняет, только читает.
 * Использование: node scripts/responsive-audit.mjs
 * Результат: logs/final2/responsive/*.png + logs/final2/responsive/report.json
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";

const routes = [
  "/",
  "/community",
  "/r",
  "/for_pregnant",
  "/e_mtd",
  "/journal",
  "/result",
  "/person",
  "/basket",
  "/equipment",
  "/info_referral",
];
const widths = [375, 390, 768, 1024, 1200];
const out = "logs/final2/responsive";
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
    const entry = { route, width, slug };
    try {
      await page.goto(base + route, { waitUntil: "load", timeout: 60000 });
      await page
        .locator("button", { hasText: "Согласен" })
        .first()
        .click({ timeout: 1500 })
        .catch(() => {});
      // прокрутка для reveal/lazy
      await page.evaluate(async () => {
        document.documentElement.style.scrollBehavior = "auto";
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(500);

      const metrics = await page.evaluate((checkTouch) => {
        const cw = document.documentElement.clientWidth;
        const sw = document.documentElement.scrollWidth;
        const res = {
          scrollWidth: sw,
          clientWidth: cw,
          hscroll: sw > cw,
          offenders: [],
          smallTargets: [],
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
            if (res.offenders.length >= 5) break;
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            if (r.right > cw + 1 || r.left < -1) {
              // пропускаем родителей, у которых виноват потомок
              if ([...el.children].some((c) => {
                const cr = c.getBoundingClientRect();
                return cr.right >= r.right - 1 || cr.left <= r.left + 1;
              })) continue;
              const cls = typeof el.className === "string" ? el.className.slice(0, 120) : "";
              res.offenders.push(
                `${el.tagName.toLowerCase()}${cls ? "." + cls.trim().split(/\s+/).slice(0, 5).join(".") : ""} [left=${Math.round(r.left)}, right=${Math.round(r.right)}]`
              );
            }
          }
        }
        if (checkTouch) {
          for (const el of document.querySelectorAll("a, button")) {
            if (res.smallTargets.length >= 10) break;
            if (!visible(el)) continue;
            const r = el.getBoundingClientRect();
            if (r.width < 40 && r.height < 40) {
              const label =
                (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 60) || "(без текста)";
              res.smallTargets.push(
                `<${el.tagName.toLowerCase()}> "${label}" ${Math.round(r.width)}x${Math.round(r.height)}`
              );
            }
          }
        }
        return res;
      }, width === 375 || width === 390);

      Object.assign(entry, metrics);
      await page.screenshot({ path: `${out}/${width}_${slug}.png`, fullPage: true });
      entry.screenshot = `${out}/${width}_${slug}.png`;

      // drawer-меню на 375
      if (width === 375) {
        const burger = page
          .locator('button[aria-label*="меню" i], button[aria-label*="Открыть" i]')
          .first();
        try {
          await burger.click({ timeout: 3000 });
          await page.waitForTimeout(700);
          await page.screenshot({ path: `${out}/375_${slug}_menu.png` });
          entry.menuScreenshot = `${out}/375_${slug}_menu.png`;
          entry.menuItems = await page.evaluate(() => {
            // ссылки внутри оверлея (fixed-позиционированный предок) либо role=dialog
            const items = [];
            for (const a of document.querySelectorAll("a")) {
              const r = a.getBoundingClientRect();
              if (r.width === 0 || r.height === 0) continue;
              let node = a.parentElement;
              let inOverlay = false;
              while (node && node !== document.body) {
                const s = getComputedStyle(node);
                if (s.position === "fixed" || node.getAttribute("role") === "dialog") {
                  inOverlay = true;
                  break;
                }
                node = node.parentElement;
              }
              if (inOverlay) {
                const t = (a.getAttribute("aria-label") || a.textContent || "").trim().replace(/\s+/g, " ");
                if (t) items.push(t.slice(0, 60));
              }
            }
            return [...new Set(items)];
          });
          await page.keyboard.press("Escape");
          await page
            .locator('button[aria-label*="закры" i], button[aria-label*="Закрыть" i]')
            .first()
            .click({ timeout: 1000 })
            .catch(() => {});
          await page.waitForTimeout(300);
        } catch (e) {
          entry.menuError = e.message.split("\n")[0];
        }
      }
    } catch (e) {
      entry.error = e.message.split("\n")[0];
    }
    report.push(entry);
    const flags = [
      entry.error ? "ERROR " + entry.error : null,
      entry.hscroll ? `HSCROLL ${entry.scrollWidth}>${entry.clientWidth}` : null,
      entry.smallTargets?.length ? `${entry.smallTargets.length} small targets` : null,
      entry.hasFooter === false ? "NO FOOTER" : null,
      entry.hasHeader === false ? "NO HEADER" : null,
      entry.menuError ? "MENU FAIL" : null,
    ].filter(Boolean);
    console.log(`${width} ${route}: ${flags.length ? flags.join(" | ") : "OK"}`);
  }
  await page.close();
}

await browser.close();
fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
console.log("done →", out + "/report.json");
