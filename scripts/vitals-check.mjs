#!/usr/bin/env node
/**
 * Web Vitals (LCP, CLS, TTFB, transfer) через Playwright на прод-сборке.
 * node scripts/vitals-check.mjs [base]
 */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3500";
const routes = ["/", "/community", "/journal"];

const browser = await chromium.launch();

for (const route of routes) {
  // Throttling: имитация среднего 4G через CDP
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 40,
    downloadThroughput: (10 * 1024 * 1024) / 8,
    uploadThroughput: (5 * 1024 * 1024) / 8,
  });

  let bytes = 0;
  page.on("response", async (r) => {
    try {
      const h = r.headers()["content-length"];
      if (h) bytes += Number(h);
    } catch {}
  });

  await page.addInitScript(() => {
    window.__vitals = { lcp: 0, cls: 0 };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__vitals.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries())
        if (!e.hadRecentInput) window.__vitals.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(base + route, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(4000);

  const v = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    return {
      ...window.__vitals,
      ttfb: nav.responseStart,
      domContentLoaded: nav.domContentLoadedEventEnd,
      load: nav.loadEventEnd,
    };
  });

  console.log(
    `${route}: LCP ${(v.lcp / 1000).toFixed(2)}s | CLS ${v.cls.toFixed(3)} | TTFB ${v.ttfb.toFixed(0)}ms | load ${(v.load / 1000).toFixed(2)}s | ~${(bytes / 1024 / 1024).toFixed(1)}MB`,
  );
  await ctx.close();
}

await browser.close();
