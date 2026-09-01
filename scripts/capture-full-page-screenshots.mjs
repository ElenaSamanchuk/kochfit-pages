/**
 * One-off: full-page desktop (1440) + mobile (375) screenshots of main landings.
 * Scrolls the page to trigger lazy images/reveal animations before capture.
 * Usage: node scripts/capture-full-page-screenshots.mjs
 */
import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? "http://127.0.0.1:3400";
const OUT_DIR = path.join(ROOT, "docs/screenshots/redesign-2025");

const PAGES = [
  { slug: "home", path: "/" },
  { slug: "community", path: "/community" },
  { slug: "for_pregnant", path: "/for_pregnant" },
  { slug: "e_mtd", path: "/e_mtd" },
  { slug: "r", path: "/r" },
];

const VIEWPORTS = [
  { suffix: "desktop", width: 1440, height: 900 },
  { suffix: "mobile", width: 375, height: 812 },
];

/** CookieConsent.tsx: role=dialog aria-label="Согласие на cookies", button text "Согласен" */
const COOKIE_DIALOG = '[role="dialog"][aria-label="Согласие на cookies"]';
const COOKIE_ACCEPT =
  '[role="dialog"][aria-label="Согласие на cookies"] button:has-text("Согласен")';

const MOTION_FREEZE_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    scroll-behavior: auto !important;
  }
`;

async function dismissCookieBanner(page) {
  // CookieConsent shows after 400ms; give React time to paint
  await page.waitForTimeout(550);

  const banner = page.locator(COOKIE_DIALOG);
  const appeared = await banner
    .waitFor({ state: "visible", timeout: 4000 })
    .then(() => true)
    .catch(() => false);

  if (appeared) {
    await page.locator(COOKIE_ACCEPT).first().click({ timeout: 8000 });
    await banner.waitFor({ state: "hidden", timeout: 8000 });
  }

  const stillVisible = await banner.isVisible().catch(() => false);
  if (stillVisible) {
    throw new Error("Cookie banner still visible after dismiss attempt");
  }
}

async function dismissVkNotice(page) {
  const vkNotice = page.locator(".vk-notice").filter({ hasText: /не работает Телеграм/i });
  if (await vkNotice.isVisible({ timeout: 1500 }).catch(() => false)) {
    await vkNotice
      .getByRole("button", { name: /закрыть уведомление/i })
      .click()
      .catch(() => {});
    await vkNotice.waitFor({ state: "hidden", timeout: 3000 }).catch(() => {});
  }
}

async function waitForFonts(page) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });
}

async function forceRevealAll(page) {
  await page.evaluate(() => {
    document.documentElement.classList.add("motion-ready");
    document
      .querySelectorAll(
        "[data-reveal], [data-reveal-hero], .hero-motion, main section, main article",
      )
      .forEach((el) => {
        el.classList.add("is-revealed");
        el.style.setProperty("--reveal-delay", "0ms");
      });
  });
}

async function waitForImages(page, timeoutMs = 20_000) {
  await page.evaluate(async (timeout) => {
    const imgs = Array.from(document.querySelectorAll("img"));
    await Promise.all(
      imgs.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete && img.naturalHeight > 0) {
              resolve(undefined);
              return;
            }
            const done = () => resolve(undefined);
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
            setTimeout(done, timeout);
          }),
      ),
    );
  }, timeoutMs);
}

async function scrollPageToLoadContent(page) {
  const stepPx = await page.evaluate(() => Math.max(180, Math.floor(window.innerHeight * 0.45)));
  const scrollPauseMs = 350;

  let y = 0;
  let lastHeight = 0;
  let stablePasses = 0;

  while (stablePasses < 3) {
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);

    while (y <= scrollHeight) {
      await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: "instant" }), y);
      await page.waitForTimeout(scrollPauseMs);
      await forceRevealAll(page);
      await waitForImages(page, 3000);
      y += stepPx;
    }

    await page.evaluate(() =>
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }),
    );
    await page.waitForTimeout(500);
    await forceRevealAll(page);
    await waitForImages(page, 10_000);

    const newHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    if (newHeight <= lastHeight + 2) {
      stablePasses += 1;
    } else {
      stablePasses = 0;
      y = Math.max(0, newHeight - stepPx * 3);
    }
    lastHeight = newHeight;
  }

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(400);
  await forceRevealAll(page);
}

async function preparePageForScreenshot(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("load", { timeout: 90_000 });
  await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});
  await waitForFonts(page);

  await dismissCookieBanner(page);
  await dismissVkNotice(page);

  await scrollPageToLoadContent(page);

  await waitForFonts(page);
  await waitForImages(page, 15_000);
  await forceRevealAll(page);

  await page.addStyleTag({ content: MOTION_FREEZE_CSS });
  await page.waitForTimeout(250);
}

function readPngDimensions(png) {
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const results = [];

  for (const { slug, path: pagePath } of PAGES) {
    for (const { suffix, width, height } of VIEWPORTS) {
      const filename = `${slug}-${suffix}.png`;
      const filepath = path.join(OUT_DIR, filename);
      const scale = suffix === "mobile" ? 2 : 1;

      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: scale,
      });
      const page = await context.newPage();
      await page.emulateMedia({ reducedMotion: "reduce" });
      const url = `${BASE_URL}${pagePath}`;

      console.log(`Capturing ${filename}…`);
      await page.goto(url, { waitUntil: "load", timeout: 120_000 });
      await preparePageForScreenshot(page);

      const cookieVisible = await page.locator(COOKIE_DIALOG).isVisible().catch(() => false);
      if (cookieVisible) {
        throw new Error(`${filename}: cookie banner visible at screenshot time`);
      }

      const metrics = await page.evaluate(() => ({
        scrollHeight: document.documentElement.scrollHeight,
        innerWidth: window.innerWidth,
        imagesLoaded: Array.from(document.querySelectorAll("img")).filter(
          (img) => img.complete && img.naturalHeight > 0,
        ).length,
        imagesTotal: document.querySelectorAll("img").length,
        unrevealed: document.querySelectorAll(
          "html.motion-ready [data-reveal]:not(.is-revealed)",
        ).length,
      }));

      await page.screenshot({ path: filepath, fullPage: true, animations: "disabled" });

      const png = await readFile(filepath);
      const { width: imgWidth, height: imgHeight } = readPngDimensions(png);

      const expectedHeight = metrics.scrollHeight * scale;
      const expectedWidth = metrics.innerWidth * scale;
      const fullPageOk =
        imgHeight >= expectedHeight - 4 && imgWidth === expectedWidth;

      results.push({
        filepath,
        url,
        viewport: `${width}x${height}`,
        deviceScaleFactor: scale,
        scrollHeight: metrics.scrollHeight,
        screenshot: `${imgWidth}x${imgHeight}`,
        imagesLoaded: `${metrics.imagesLoaded}/${metrics.imagesTotal}`,
        unrevealedSections: metrics.unrevealed,
        cookieBannerVisible: false,
        fullPageOk,
      });

      await context.close();
      console.log(
        `${fullPageOk ? "✓" : "✗"} ${filename} — ${imgWidth}x${imgHeight}px (page ${metrics.scrollHeight}px, imgs ${metrics.imagesLoaded}/${metrics.imagesTotal})`,
      );
    }
  }

  await browser.close();

  const manifest = {
    capturedAt: new Date().toISOString(),
    baseURL: BASE_URL,
    strategy:
      "slow-scroll + lazy images + fonts.ready + cookie click dismiss + reduced-motion + animation freeze",
    results,
  };
  await writeFile(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));

  const failed = results.filter((r) => !r.fullPageOk);
  if (failed.length) {
    console.error("\nSome captures may be incomplete:");
    for (const f of failed) console.error(`  ${f.filepath}`);
    process.exit(1);
  }

  console.log(`\nAll ${results.length} screenshots saved to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
