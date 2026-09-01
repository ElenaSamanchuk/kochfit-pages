import { chromium } from "playwright";
import path from "node:path";

const outDir = path.resolve("tmp-assets");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3400/community", { waitUntil: "networkidle" });

const section = page.locator('[data-figma-node="2031:2534"]');
await section.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);

await section.screenshot({
  path: path.join(outDir, "expect-community-1440-after-fix.png"),
});

await browser.close();
console.log("screenshot saved");
