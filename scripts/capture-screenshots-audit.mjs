#!/usr/bin/env node
/**
 * Full-page screenshot audit: desktop (1440) + mobile (375) for all client-reachable pages.
 * Usage: node scripts/capture-screenshots-audit.mjs [outDir]
 * Env: AUDIT_BASE (default http://212.233.93.151/kochfit)
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = (process.env.AUDIT_BASE ?? "http://212.233.93.151/kochfit").replace(/\/$/, "");
const OUT = process.argv[2] ?? "docs/screenshots-audit";
const DESKTOP_W = 1440;
const MOBILE_W = 375;

/** Definitive page list: sitemap + nav/footer + journal + blog + smoke + static lesson/LK pages */
const PAGES = [
  // Figma landings + nav
  { path: "/", label: "Главная" },
  { path: "/community", label: "Красота и здоровье" },
  { path: "/e_mtd", label: "МТД" },
  { path: "/r", label: "Восстановление после родов" },
  { path: "/for_pregnant", label: "Активная беременность" },
  { path: "/journal", label: "Полезный блог" },
  { path: "/result", label: "Отзывы и результаты" },
  { path: "/equipment", label: "Оборудование" },
  { path: "/info_referral", label: "Реферальная программа" },
  { path: "/person", label: "О тренере" },
  { path: "/basket", label: "Персональная работа" },
  // Support & misc public
  { path: "/faq", label: "Тейпирование FAQ" },
  { path: "/suport", label: "Служба заботы" },
  { path: "/work", label: "Вакансия куратора" },
  { path: "/year-results", label: "Итоги года" },
  { path: "/sale", label: "Акции" },
  { path: "/taplink", label: "Taplink" },
  { path: "/tmtd", label: "TMTD landing" },
  { path: "/care", label: "Care" },
  { path: "/education", label: "Образование" },
  { path: "/webinars", label: "Вебинары" },
  { path: "/yes", label: "Спасибо за покупку" },
  { path: "/no", label: "Ошибка оплаты" },
  { path: "/delete", label: "Удаление данных" },
  { path: "/unsubscribe", label: "Отписка" },
  // Legal
  { path: "/oferta", label: "Оферта" },
  { path: "/part_oferta", label: "Частичная оферта" },
  { path: "/privacy", label: "Политика конфиденциальности" },
  { path: "/consent", label: "Согласие" },
  { path: "/data-consent", label: "Согласие на данные" },
  { path: "/del", label: "Удалить аккаунт" },
  // Journal articles /st1–/st14
  ...Array.from({ length: 14 }, (_, i) => ({
    path: `/st${i + 1}`,
    label: `Статья st${i + 1}`,
  })),
  // Zen blog feed /blog/N
  ...Array.from({ length: 36 }, (_, i) => ({
    path: `/blog/${i + 1}`,
    label: `Блог ${i + 1}`,
  })),
  // Payment / promo landings (LK + marketing)
  { path: "/diastasisstart", label: "Диастаз старт" },
  { path: "/special_recovery3", label: "Special recovery 3" },
  { path: "/special_recovery5", label: "Special recovery 5" },
  { path: "/special_recovery7", label: "Special recovery 7" },
  { path: "/special_gift_recovery3", label: "Gift recovery 3" },
  { path: "/special_gift_recovery5", label: "Gift recovery 5" },
  { path: "/special_gift_recovery7", label: "Gift recovery 7" },
  { path: "/special_gift_pack1", label: "Gift pack 1" },
  { path: "/special_gift_pack2", label: "Gift pack 2" },
  { path: "/special_gift_pack3", label: "Gift pack 3" },
  { path: "/special_gift_for_pregnant7", label: "Gift for pregnant 7" },
  { path: "/standartsub", label: "Standart sub" },
  // Course lesson / supplement pages (LK-linked static routes)
  { path: "/diastasis", label: "Диастаз" },
  { path: "/mtd", label: "МТД урок" },
  { path: "/mtdpractice", label: "МТД практика" },
  { path: "/ifr", label: "IFR" },
  { path: "/ifrtheory", label: "IFR теория" },
  { path: "/stlk", label: "STLK урок" },
  { path: "/mpod", label: "MPOD" },
  { path: "/food", label: "Питание" },
  { path: "/fooddop", label: "Питание доп" },
  { path: "/recipes", label: "Рецепты" },
  { path: "/massage", label: "Массаж" },
  { path: "/tmj", label: "TMJ" },
  { path: "/tmjjoint", label: "TMJ joint" },
  { path: "/teipirovanie1", label: "Тейпирование 1" },
  { path: "/teipirovanie2", label: "Тейпирование 2" },
  { path: "/teipirovanie3", label: "Тейпирование 3" },
  { path: "/teipirovaniehalusvalgus", label: "Тейпирование hallux" },
  { path: "/foottapingtheory", label: "Foot taping theory" },
  { path: "/tapingcrest", label: "Taping crest" },
  { path: "/tld", label: "TLD" },
  { path: "/5htp", label: "5-HTP" },
  { path: "/bad_2", label: "BAD 2" },
  { path: "/calcium", label: "Кальций" },
  { path: "/ferrum", label: "Железо" },
  { path: "/lecithin", label: "Лецитин" },
  { path: "/magnesium", label: "Магний" },
  { path: "/omega3", label: "Omega-3" },
  { path: "/protein", label: "Протеин" },
  { path: "/selen", label: "Селен" },
  { path: "/vitamin_c", label: "Витамин C" },
  { path: "/vitamin_d", label: "Витамин D" },
  { path: "/zincum", label: "Цинк" },
];

const slugOf = (p) => (p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "_"));

fs.mkdirSync(OUT, { recursive: true });

const manifest = {
  capturedAt: new Date().toISOString(),
  baseUrl: BASE,
  viewports: { desktop: DESKTOP_W, mobile: MOBILE_W },
  pages: [],
  failed: [],
};

const browser = await chromium.launch();

async function captureViewport(width, suffix) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    deviceScaleFactor: width <= 400 ? 2 : 1,
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    localStorage.setItem("cookieConsent", "accepted");
    document.cookie = "kochfit_vk_notice_closed=1; Path=/; SameSite=Lax";
  });

  for (const { path: route, label } of PAGES) {
    const slug = slugOf(route);
    const file = `${slug}-${suffix}.png`;
    const filePath = path.join(OUT, file);
    const url = BASE + route;
    const entry = { path: route, label, viewport: suffix, file, url, status: "ok" };

    try {
      const res = await page.goto(url, { waitUntil: "load", timeout: 90000 });
      if (!res || !res.ok()) {
        throw new Error(`HTTP ${res?.status() ?? "?"}`);
      }
      await page
        .locator("button", { hasText: "Согласен" })
        .first()
        .click({ timeout: 1500 })
        .catch(() => {});
      await page.evaluate(async () => {
        document.documentElement.style.scrollBehavior = "auto";
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 50));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`OK ${suffix} ${route}`);
    } catch (err) {
      entry.status = "failed";
      entry.error = err.message;
      manifest.failed.push(entry);
      console.error(`FAIL ${suffix} ${route}: ${err.message}`);
    }
    manifest.pages.push(entry);
  }
  await page.close();
}

console.log(`Capturing ${PAGES.length} pages × 2 viewports from ${BASE}`);
await captureViewport(DESKTOP_W, "desktop");
await captureViewport(MOBILE_W, "mobile");
await browser.close();

manifest.summary = {
  totalPages: PAGES.length,
  totalScreenshots: PAGES.length * 2,
  succeeded: manifest.pages.filter((p) => p.status === "ok").length,
  failed: manifest.failed.length,
};

fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`\nDone → ${OUT}/ (${manifest.summary.succeeded}/${manifest.summary.totalScreenshots} OK)`);
