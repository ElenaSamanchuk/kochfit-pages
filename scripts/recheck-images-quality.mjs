#!/usr/bin/env node
/**
 * Аудит качества видимых img на приоритетных страницах.
 * Метрики: natural vs display×dpr (апскейл), aspect distortion, broken, SVG-as-raster stretch.
 * node scripts/recheck-images-quality.mjs
 * → logs/recheck-adapt/images-quality.json + logs/recheck-adapt/images-shots/
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

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
];
const widths = [375, 1440];
const base = process.env.AUDIT_BASE ?? "http://localhost:3400";
const outDir = "logs/recheck-adapt";
const shotDir = path.join(outDir, "images-shots");
fs.mkdirSync(shotDir, { recursive: true });

const UPSAMPLE_SOFT = 1.15; // soft warn
const UPSAMPLE_HARD = 1.4; // critical soft blur
const ASPECT_TOL = 0.03;

const report = { generatedAt: new Date().toISOString(), pages: [], summary: {} };
const allIssues = [];

const browser = await chromium.launch();

for (const width of widths) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    deviceScaleFactor: width <= 390 ? 2 : 1,
  });
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const route of routes) {
    const slug = route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
    const entry = { route, width, dpr: width <= 390 ? 2 : 1, images: [], issues: [] };
    try {
      await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page
        .locator("button", { hasText: "Согласен" })
        .first()
        .click({ timeout: 1000 })
        .catch(() => {});
      // scroll to load lazy
      await page.evaluate(async () => {
        document.documentElement.style.scrollBehavior = "auto";
        const h = Math.min(document.body.scrollHeight, 12000);
        for (let y = 0; y < h; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 50));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);
      // дождаться декода видимых img (lazy)
      await page.evaluate(async () => {
        const imgs = [...document.querySelectorAll("img")].filter((img) => {
          const r = img.getBoundingClientRect();
          return r.width > 8 && r.height > 8;
        });
        await Promise.all(
          imgs.map(
            (img) =>
              img.complete && img.naturalWidth
                ? Promise.resolve()
                : new Promise((res) => {
                    img.addEventListener("load", () => res(), { once: true });
                    img.addEventListener("error", () => res(), { once: true });
                    setTimeout(res, 2500);
                  }),
          ),
        );
      });

      const imgs = await page.evaluate(
        ({ upsampleSoft, upsampleHard, aspectTol }) => {
          const dpr = window.devicePixelRatio || 1;
          const out = [];
          for (const img of document.querySelectorAll("img")) {
            const r = img.getBoundingClientRect();
            if (r.width < 8 || r.height < 8) continue;
            const s = getComputedStyle(img);
            if (s.display === "none" || s.visibility === "hidden" || +s.opacity === 0) continue;
            const nw = img.naturalWidth || 0;
            const nh = img.naturalHeight || 0;
            const dw = r.width;
            const dh = r.height;
            const needW = dw * dpr;
            const needH = dh * dpr;
            const scaleW = nw > 0 ? needW / nw : Infinity;
            const scaleH = nh > 0 ? needH / nh : Infinity;
            const scale = Math.max(scaleW, scaleH);
            const natAspect = nw && nh ? nw / nh : 0;
            const dispAspect = dw && dh ? dw / dh : 0;
            const aspectDelta =
              natAspect && dispAspect ? Math.abs(natAspect - dispAspect) / natAspect : 0;
            const src = img.currentSrc || img.src || "";
            // только реально незагруженные после complete; lazy без decode — не broken
            const broken = img.complete && nw === 0 && nh === 0 && !!src;
            const isSvg = /\.svg(\?|$)/i.test(src) || src.startsWith("data:image/svg");
            const fitCover = s.objectFit === "cover" || s.objectFit === "none";
            const issues = [];
            if (broken) issues.push("broken");
            // SVG масштабируется без мыла — не считаем upsample
            if (!isSvg && !broken && scale >= upsampleHard)
              issues.push(`upsample_hard×${scale.toFixed(2)}`);
            else if (!isSvg && !broken && scale >= upsampleSoft)
              issues.push(`upsample_soft×${scale.toFixed(2)}`);
            // object-cover кроп — ожидаем aspectΔ; флаг только если не cover
            if (!broken && !isSvg && !fitCover && aspectDelta > aspectTol && nw > 0)
              issues.push(`aspectΔ${(aspectDelta * 100).toFixed(1)}%`);
            if (isSvg && (dw > 96 || dh > 96) && (scaleW > 4 || scaleH > 4) && nw > 0 && nw < 24)
              issues.push("svg_tiny_viewbox_stretched");
            if (!isSvg && nw > 0 && nw <= 48 && Math.max(dw, dh) >= 64)
              issues.push(`tiny_raster_icon ${nw}→${Math.round(dw)}`);
            out.push({
              src: src.slice(0, 180),
              alt: (img.alt || "").slice(0, 60),
              nw,
              nh,
              dw: Math.round(dw * 10) / 10,
              dh: Math.round(dh * 10) / 10,
              needW: Math.round(needW),
              needH: Math.round(needH),
              scale: isSvg ? 1 : Math.round(scale * 100) / 100,
              aspectDelta: Math.round(aspectDelta * 1000) / 1000,
              objectFit: s.objectFit,
              top: Math.round(r.top + window.scrollY),
              issues,
            });
          }
          return out;
        },
        { upsampleSoft: UPSAMPLE_SOFT, upsampleHard: UPSAMPLE_HARD, aspectTol: ASPECT_TOL },
      );

      entry.images = imgs;
      entry.issues = imgs.filter((i) => i.issues.length);
      entry.counts = {
        total: imgs.length,
        withIssues: entry.issues.length,
        broken: entry.issues.filter((i) => i.issues.includes("broken")).length,
        upsampleHard: entry.issues.filter((i) => i.issues.some((x) => x.startsWith("upsample_hard")))
          .length,
        upsampleSoft: entry.issues.filter((i) => i.issues.some((x) => x.startsWith("upsample_soft")))
          .length,
        aspect: entry.issues.filter((i) => i.issues.some((x) => x.startsWith("aspect"))).length,
        tinyIcon: entry.issues.filter((i) => i.issues.some((x) => x.startsWith("tiny_raster")))
          .length,
      };

      // screenshot top viewport for visual reference
      await page.screenshot({
        path: path.join(shotDir, `${width}_${slug}.png`),
        fullPage: false,
      });

      for (const iss of entry.issues) {
        allIssues.push({ route, width, ...iss });
      }
    } catch (e) {
      entry.error = e.message.split("\n")[0];
    }
    report.pages.push(entry);
    const c = entry.counts || {};
    console.log(
      `${width} ${route}: imgs=${c.total ?? 0} issues=${c.withIssues ?? 0}` +
        (c.upsampleHard ? ` hard↑${c.upsampleHard}` : "") +
        (c.broken ? ` broken${c.broken}` : "") +
        (c.aspect ? ` aspect${c.aspect}` : "") +
        (entry.error ? ` ERROR ${entry.error}` : ""),
    );
  }
  await page.close();
}

await browser.close();

// aggregate top offenders by src
const bySrc = new Map();
for (const i of allIssues) {
  const key = i.src.replace(/\?.*$/, "");
  if (!bySrc.has(key)) bySrc.set(key, { src: key, count: 0, maxScale: 0, routes: new Set(), tags: new Set() });
  const row = bySrc.get(key);
  row.count++;
  row.maxScale = Math.max(row.maxScale, i.scale || 0);
  row.routes.add(`${i.route}@${i.width}`);
  i.issues.forEach((t) => row.tags.add(t.split("×")[0].replace(/\d.*/, (m) => m)));
}
const topOffenders = [...bySrc.values()]
  .map((r) => ({
    src: r.src,
    count: r.count,
    maxScale: r.maxScale,
    routes: [...r.routes].slice(0, 8),
    tags: [...r.tags],
  }))
  .sort((a, b) => b.maxScale - a.maxScale || b.count - a.count)
  .slice(0, 40);

report.summary = {
  pages: report.pages.length,
  totalImages: report.pages.reduce((s, p) => s + (p.counts?.total || 0), 0),
  issueImages: allIssues.length,
  broken: allIssues.filter((i) => i.issues.includes("broken")).length,
  upsampleHard: allIssues.filter((i) => i.issues.some((x) => x.startsWith("upsample_hard"))).length,
  upsampleSoft: allIssues.filter((i) => i.issues.some((x) => x.startsWith("upsample_soft"))).length,
  aspect: allIssues.filter((i) => i.issues.some((x) => x.startsWith("aspect"))).length,
  topOffenders,
};

fs.writeFileSync(path.join(outDir, "images-quality.json"), JSON.stringify(report, null, 2));
console.log("\n=== IMAGE QUALITY SUMMARY ===");
console.log(JSON.stringify(report.summary, null, 2));
console.log("→", path.join(outDir, "images-quality.json"));
