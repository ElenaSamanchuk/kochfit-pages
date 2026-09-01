/**
 * Приёмка каруселей: стрелки, drag, точки-индикаторы, marquee.
 * Запуск: node scripts/carousel-acceptance.mjs
 * Скрины: logs/carousel-acceptance/
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:3400";
const OUT = "logs/carousel-acceptance";
mkdirSync(OUT, { recursive: true });

const results = [];
const ok = (name, detail) => results.push({ name, pass: true, detail });
const fail = (name, detail) => results.push({ name, pass: false, detail });
const check = (name, cond, detail) => (cond ? ok(name, detail) : fail(name, detail));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

/** Видимый горизонтальный скроллер внутри секции */
async function visibleScroller(sectionSel) {
  const loc = page.locator(`${sectionSel} [data-drag-scroll]:visible`).first();
  await loc.waitFor({ state: "visible", timeout: 10000 });
  return loc;
}

async function gotoAndReveal(path, sectionSel) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  const section = page.locator(sectionSel).first();
  await section.scrollIntoViewIfNeeded();
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ block: "center", behavior: "instant" });
  }, sectionSel);
  await page.waitForTimeout(800); // reveal-анимации
  return section;
}

const sl = (loc) => loc.evaluate((el) => Math.round(el.scrollLeft));

/** Drag мышью по скроллеру: тянем влево на dist → scrollLeft должен вырасти */
async function dragTest(name, scroller, dist = 300) {
  const before = await sl(scroller);
  const box = await scroller.boundingBox();
  const x = box.x + box.width * 0.6;
  const y = box.y + box.height * 0.5;
  await page.mouse.move(x, y);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(x - (dist * i) / 10, y, { steps: 2 });
  await page.mouse.up();
  await page.waitForTimeout(300);
  const after = await sl(scroller);
  check(name, after > before + 50, `scrollLeft ${before} → ${after} (drag ${dist}px влево)`);
  return { before, after };
}

async function arrowTest(name, scroller, nextBtn, prevBtn) {
  const behavior = await scroller.evaluate((el) => getComputedStyle(el).scrollBehavior);
  const s0 = await sl(scroller);
  await nextBtn.click();
  await page.waitForTimeout(700);
  const s1 = await sl(scroller);
  check(`${name}: стрелка →`, s1 > s0 + 30, `scrollLeft ${s0} → ${s1}, scroll-behavior=${behavior}`);
  await prevBtn.click();
  await page.waitForTimeout(700);
  const s2 = await sl(scroller);
  check(`${name}: стрелка ←`, s2 < s1 - 30, `scrollLeft ${s1} → ${s2}`);
  check(`${name}: плавность`, behavior === "smooth", `scroll-behavior=${behavior}`);
}

/* ═══ 1. Главная: «Почему женщины выбирают Kochfit» ═══ */
{
  const sec = '[data-figma-node="2031:1879"]';
  await gotoAndReveal("/", sec);
  const scroller = await visibleScroller(sec);
  await arrowTest(
    "1 главная",
    scroller,
    page.locator(`${sec} button[aria-label="Прокрутить вперёд"]`),
    page.locator(`${sec} button[aria-label="Прокрутить назад"]`),
  );
  // Точки: активный индекс должен отражать позицию
  const activeIdx = async () =>
    page.evaluate((s) => {
      const dots = document.querySelector(s)?.querySelectorAll("article")[0]?.querySelectorAll("span.size-\\[7px\\]");
      if (!dots) return -1;
      return [...dots].findIndex((d) => !d.className.includes("opacity-25"));
    }, sec);
  await scroller.evaluate((el) => el.scrollTo({ left: 0 }));
  await page.waitForTimeout(400);
  const dotsAt0 = await activeIdx();
  await scroller.evaluate((el) => el.scrollTo({ left: el.scrollWidth }));
  await page.waitForTimeout(500);
  const dotsAtEnd = await activeIdx();
  check("1 главная: точки", dotsAt0 === 0 && dotsAtEnd === 4, `active: старт=${dotsAt0}, конец=${dotsAtEnd}`);
  await scroller.evaluate((el) => el.scrollTo({ left: 0 }));
  await page.waitForTimeout(400);
  // 4-я карточка «подглядывает», но не обрезана посередине текста (@1440)
  {
    const card4 = page.locator(`${sec} article`).nth(3);
    const peek = await card4.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const visible = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
      return { visible: Math.round(visible), width: Math.round(r.width), right: Math.round(r.right), vw };
    });
    check(
      "1 главная: 4-я карточка peek",
      peek.visible >= 180 && peek.right <= peek.vw,
      `visible ${peek.visible}px / ${peek.width}px, right=${peek.right} vw=${peek.vw}`,
    );
  }
  await dragTest("1 главная: drag", scroller);
  await page.locator(sec).screenshot({ path: `${OUT}/1-home-why.png` });
}

/* ═══ 2. «Программа курса» (карточки экспертов): /for_pregnant и /r ═══ */
{
  await gotoAndReveal("/for_pregnant", "#program");
  const scroller = await visibleScroller("#program");
  await dragTest("2 /for_pregnant программа: drag", scroller);
  await page.locator("#program").screenshot({ path: `${OUT}/2-for_pregnant-program.png` });
}
{
  await gotoAndReveal("/r", "#program");
  const scroller = await visibleScroller("#program");
  await dragTest("2 /r программа: drag", scroller);
  await page.locator("#program").screenshot({ path: `${OUT}/2-r-program.png` });
}

/* ═══ 3. «Полезные материалы Kochfit» (/for_pregnant): стрелки + drag ═══ */
{
  const sec = '[data-figma-node="2351:11004"]';
  await gotoAndReveal("/for_pregnant", sec);
  const scroller = page.locator("#useful-materials-scroll");
  await arrowTest(
    "3 материалы",
    scroller,
    page.locator('[data-carousel-next="#useful-materials-scroll"]'),
    page.locator('[data-carousel-prev="#useful-materials-scroll"]'),
  );
  const urlBefore = page.url();
  await dragTest("3 материалы: drag", scroller, 250);
  await page.waitForTimeout(400);
  check("3 материалы: drag не открыл ссылку", page.url() === urlBefore, page.url());
  await page.locator(sec).screenshot({ path: `${OUT}/3-for_pregnant-materials.png` });
}

/* ═══ 4. «Необходимое оборудование» (/for_pregnant) ═══ */
{
  const sec = '[data-figma-node="2351:11432"]';
  await gotoAndReveal("/for_pregnant", sec);
  const scroller = await visibleScroller(sec);
  await dragTest("4 оборудование: drag", scroller);
  await page.locator(sec).screenshot({ path: `${OUT}/4-for_pregnant-equipment.png` });
}

/* ═══ 5. «Что говорят участницы» (/for_pregnant) ═══ */
{
  const sec = '[data-figma-node="2351:11143"]';
  await gotoAndReveal("/for_pregnant", sec);
  const scroller = await visibleScroller(sec);
  await dragTest("5 отзывы: drag", scroller);
  await page.locator(sec).screenshot({ path: `${OUT}/5-for_pregnant-reviews.png` });
}

/* ═══ 6. «Программа вам подойдёт, если» (/r): marquee ═══ */
{
  const sec = '[data-figma-node="2042:9297"]';
  await gotoAndReveal("/r", sec);
  const scroller = page.locator(`${sec} [data-marquee]`);
  await scroller.waitFor({ state: "visible" });
  await page.mouse.move(10, 10); // мышь в сторону — авто-ход не должен пауситься
  await page.waitForTimeout(500);
  const m0 = await sl(scroller);
  await page.waitForTimeout(2000);
  const m1 = await sl(scroller);
  check("6 marquee: авто-прокрутка", m1 - m0 > 30 && m1 - m0 < 120, `за 2с: ${m0} → ${m1} (~30px/с)`);

  // Hover — пауза
  const box = await scroller.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(300);
  const h0 = await sl(scroller);
  await page.waitForTimeout(1500);
  const h1 = await sl(scroller);
  check("6 marquee: пауза при hover", Math.abs(h1 - h0) <= 2, `при hover за 1.5с: ${h0} → ${h1}`);

  // Drag руками
  await dragTest("6 marquee: drag", scroller, 250);

  // Бесшовный цикл: доезжаем почти до периода и смотрим, что был wrap без рывка контента.
  // Мышь — в сторону, иначе marquee честно стоит на hover-паузе.
  await page.mouse.move(10, 10);
  await page.waitForTimeout(200);
  const wrap = await scroller.evaluate(async (el) => {
    const first = el.firstElementChild;
    const copy = el.querySelector(":scope > [data-marquee-copy]");
    const period = copy.offsetLeft - first.offsetLeft;
    el.scrollLeft = period - 30;
    const t0 = performance.now();
    let wrapped = false;
    while (performance.now() - t0 < 5000) {
      await new Promise((r) => requestAnimationFrame(r));
      if (el.scrollLeft < period - 200) {
        wrapped = true;
        break;
      }
    }
    return { period, wrapped, at: Math.round(el.scrollLeft) };
  });
  check("6 marquee: бесшовный цикл", wrap.wrapped, `period=${wrap.period}, после wrap scrollLeft=${wrap.at}`);

  // prefers-reduced-motion: авто-движение выключено
  const page2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page2.emulateMedia({ reducedMotion: "reduce" });
  await page2.goto(BASE + "/r", { waitUntil: "networkidle" });
  await page2.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "center" }), sec);
  await page2.waitForTimeout(1000);
  const rm0 = await page2.locator(`${sec} [data-marquee]`).evaluate((el) => el.scrollLeft);
  await page2.waitForTimeout(2000);
  const rm1 = await page2.locator(`${sec} [data-marquee]`).evaluate((el) => el.scrollLeft);
  check("6 marquee: prefers-reduced-motion", Math.abs(rm1 - rm0) <= 2, `за 2с: ${rm0} → ${rm1}`);
  await page2.close();

  await page.mouse.move(10, 10);
  await page.locator(sec).screenshot({ path: `${OUT}/6-r-suitable-marquee.png` });
}

await browser.close();

let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name} — ${r.detail}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
