import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3400/community", { waitUntil: "networkidle" });

const section = page.locator('[data-figma-node="2031:2534"]');
await section.scrollIntoViewIfNeeded();

const cards = section.locator("article");
const count = await cards.count();
for (let i = 0; i < count; i++) {
  const card = cards.nth(i);
  const cardBox = await card.boundingBox();
  const dots = card.locator("span.flex.items-start").first();
  const dotsBox = await dots.boundingBox();
  const gapRight = cardBox.x + cardBox.width - (dotsBox.x + dotsBox.width);
  console.log(
    JSON.stringify({
      step: i + 1,
      cardW: Math.round(cardBox.width),
      dotsRightGap: Math.round(gapRight * 10) / 10,
      expected: 16,
    }),
  );
}

await page.screenshot({
  path: "tmp-assets/expect-before-fix.png",
  fullPage: false,
});
await browser.close();
