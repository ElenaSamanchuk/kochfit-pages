import { expect, test } from "@playwright/test";
import sharp from "sharp";

/** Left-edge strip must not be flat gray/white card bg (regression @375). */
function isFlatGrayOrWhite(r: number, g: number, b: number): boolean {
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  const avg = (r + g + b) / 3;
  // white card bg ~255; source gray ~100–180 with low spread
  return (avg > 230 && spread < 25) || (avg > 95 && avg < 195 && spread < 18);
}

test.describe("for_pregnant equipment covers @375", () => {
  test("all 4 cards — no gray/white strip on cover left", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/for_pregnant", { waitUntil: "domcontentloaded" });
    const scroller = page.locator("#course-equipment-scroller");
    await scroller.scrollIntoViewIfNeeded();

    const articles = scroller.locator("article");
    await expect(articles).toHaveCount(4);

    for (let i = 0; i < 4; i++) {
      const card = articles.nth(i);
      await card.scrollIntoViewIfNeeded();

      const cover = card.locator("span.relative.m-\\[4px\\]");
      await expect(cover).toBeVisible();
      await cover.locator("img").evaluate((el) => (el as HTMLImageElement).decode());

      const textOverlay = cover.locator("span.absolute.top-\\[12px\\]").first();
      const textW = await textOverlay.evaluate((el) => el.getBoundingClientRect().width);
      expect(textW).toBeCloseTo(188, 0);

      const titleFont = await textOverlay
        .locator("span.text-\\[14px\\]")
        .evaluate((el) => getComputedStyle(el).fontSize);
      expect(titleFont).toBe("14px");

      const coverBox = await cover.boundingBox();
      expect(coverBox).not.toBeNull();

      const png = await page.screenshot({
        type: "png",
        clip: {
          x: coverBox!.x,
          y: coverBox!.y,
          width: coverBox!.width,
          height: coverBox!.height,
        },
      });

      const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
      const stripW = Math.min(12, info.width);
      let flatCount = 0;
      const samples: string[] = [];
      for (let y = 28; y < info.height; y += Math.max(1, Math.floor((info.height - 28) / 5))) {
        let r = 0;
        let g = 0;
        let b = 0;
        for (let x = 0; x < stripW; x++) {
          const idx = (y * info.width + x) * info.channels;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
        }
        r = Math.round(r / stripW);
        g = Math.round(g / stripW);
        b = Math.round(b / stripW);
        samples.push(`${r},${g},${b}`);
        if (isFlatGrayOrWhite(r, g, b)) flatCount++;
      }

      expect(
        flatCount,
        `card ${i + 1}: left strip looks flat (${samples.join("; ")})`,
      ).toBeLessThan(samples.length);

      await page.screenshot({
        path: `e2e/screenshots/equipment-cover-${i + 1}-375.png`,
        clip: {
          x: Math.max(0, coverBox!.x - 4),
          y: Math.max(0, coverBox!.y - 4),
          width: coverBox!.width + 8,
          height: coverBox!.height + 8,
        },
      });
    }
  });
});
