#!/usr/bin/env node
/**
 * Функциональный чек-лист: куки-баннер, метрики, бот-виджет, ЛК-ссылки, блог.
 * node scripts/functional-check.mjs
 */
import { chromium } from "playwright";

const base = process.env.AUDIT_BASE ?? "http://localhost:3400";
const results = [];
const ok = (name, pass, detail = "") =>
  results.push(`${pass ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

const requests = [];
page.on("request", (r) => requests.push(r.url()));

await page.goto(base + "/", { waitUntil: "networkidle" });

// 1. Куки-баннер: показ
const banner = page.locator("text=Наш сайт использует куки").first();
ok("куки-баннер показан", await banner.isVisible().catch(() => false));

// 2. Согласие → баннер скрыт, запись в storage
await page.locator("button", { hasText: "Согласен" }).first().click({ timeout: 3000 }).catch(() => {});
await page.waitForTimeout(500);
ok("куки-баннер скрыт после согласия", !(await banner.isVisible().catch(() => false)));
const stored = await page.evaluate(() => JSON.stringify({ ls: { ...localStorage }, ck: document.cookie }));
ok("согласие записано", /cookie|consent/i.test(stored), stored.slice(0, 200));

// 3. Повторный визит: баннера нет
await page.goto(base + "/", { waitUntil: "networkidle" });
ok("куки-баннер не показан повторно", !(await banner.isVisible().catch(() => false)));

// 4. Метрики: network-запросы (в рамках визитов текущего прогона)
await page.waitForTimeout(3000);
const navsSoFar = 2; // "/" открывалась дважды к этому моменту
ok("Я.Метрика tag.js", requests.some((u) => u.includes("mc.yandex.ru/metrika/tag.js")));
ok("Я.Метрика hit (watch)", requests.some((u) => /mc\.yandex\.(ru|com)\/(watch|webvisor)/.test(u)));
ok("FB Pixel fbevents", requests.some((u) => u.includes("fbevents.js")));
ok(
  "FB Pixel init (config/tr)",
  requests.some((u) => u.includes("facebook.com/tr") || u.includes("connect.facebook.net/signals/config")),
);
ok("nn99 widget.js", requests.some((u) => u.includes("nn99.ru/widget.js")));
ok("Collabza bonus.js", requests.some((u) => u.includes("collabza/bonus.js")));

// 5. Дубли метрик: не больше одного tag.js на каждую навигацию
const tagJsCount = requests.filter((u) => u.includes("metrika/tag.js")).length;
ok("нет дублей Метрики", tagJsCount <= navsSoFar, `tag.js x${tagJsCount} при ${navsSoFar} навигациях`);

// 6. Бот-виджет: появился ли launcher
await page.waitForTimeout(4000);
const widget = await page
  .locator('[data-widget-id], [class*="nn99"], [id*="nn99"], iframe[src*="nn99"]')
  .count();
ok("бот-виджет в DOM", widget > 0, `элементов: ${widget}`);

// 7. ЛК-ссылки → v2.kochfit.ru
const lkLinks = await page.$$eval('a[href*="v2.kochfit.ru"]', (as) => as.map((a) => a.href));
ok("ЛК-ссылки на v2.kochfit.ru", lkLinks.length > 0, `${lkLinks.length} шт.`);

// 8. Блог: листинг и статья
const resp = await page.goto(base + "/journal", { waitUntil: "networkidle" });
ok("/journal 200", resp.status() === 200);
const blogResp = await page.goto(base + "/blog/1", { waitUntil: "networkidle" });
ok("/blog/1 200", blogResp.status() === 200);
const h1 = await page.locator("h1").first().textContent();
ok("статья имеет h1", !!h1?.trim(), h1?.trim().slice(0, 60));
const extImgs = await page.$$eval("img", (imgs) =>
  imgs
    .map((i) => i.src)
    .filter(
      (s) =>
        /^https?:/.test(s) &&
        !s.includes("localhost") &&
        // чат-виджет nn99 и пиксели метрик — внешние сервисы, не контент
        !s.includes("nn99.ru") &&
        !s.includes("mc.yandex") &&
        !s.includes("facebook.com/tr"),
    ),
);
ok("картинки статьи локальные", extImgs.length === 0, extImgs.slice(0, 3).join(", "));

// 9. 404
const nf = await page.goto(base + "/definitely-not-a-page", { waitUntil: "load" });
ok("404 на несуществующем URL", nf.status() === 404, `status ${nf.status()}`);

console.log(results.join("\n"));
await browser.close();
