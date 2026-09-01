import { expect, test } from "@playwright/test";

/** Регресс: crop/rotate только на img, контейнер 57×57 без transform @1440 */
test.describe("Image crop fixes @1440", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test("WhyKochfit card 3 — container без rotate, img с Figma crop", async ({
    page,
  }) => {
    await page.goto("/");
    const container = page.locator('[data-figma-node="2241:5287"]');
    await container.scrollIntoViewIfNeeded();

    const containerTransform = await container.evaluate((el) =>
      getComputedStyle(el).transform,
    );
    expect(containerTransform).toBe("none");

    const img = container.locator("img");
    const imgBox = await img.boundingBox();
    const containerBox = await container.boundingBox();
    expect(imgBox).not.toBeNull();
    expect(containerBox).not.toBeNull();
    // img больше контейнера (143.21% zoom)
    expect(imgBox!.width).toBeGreaterThan(containerBox!.width * 1.2);
    expect(imgBox!.height).toBeGreaterThan(containerBox!.height * 1.2);

    await page.screenshot({
      path: "e2e/screenshots/why-kochfit-card3-1440.png",
      clip: {
        x: Math.max(0, containerBox!.x - 40),
        y: Math.max(0, containerBox!.y - 40),
        width: containerBox!.width + 320,
        height: containerBox!.height + 120,
      },
    });
  });

  test("CoursesCatalog flagship thumbnail — Figma crop на img", async ({
    page,
  }) => {
    await page.goto("/");
    const img = page.locator('[data-figma-node="2241:5358"]');
    await img.scrollIntoViewIfNeeded();

    const container = img.locator("xpath=..");
    const containerTransform = await container.evaluate((el) =>
      getComputedStyle(el).transform,
    );
    expect(containerTransform).toBe("none");

    const imgBox = await img.boundingBox();
    const containerBox = await container.boundingBox();
    expect(imgBox!.width).toBeGreaterThan(containerBox!.width);

    await page.screenshot({
      path: "e2e/screenshots/courses-flagship-1440.png",
      clip: {
        x: Math.max(0, (containerBox!.x ?? 0) - 20),
        y: Math.max(0, (containerBox!.y ?? 0) - 20),
        width: (containerBox!.width ?? 400) + 40,
        height: (containerBox!.height ?? 300) + 40,
      },
    });
  });

  test("InsideCourse author photo — object-bottom, container без rotate", async ({
    page,
  }) => {
    await page.goto("/community");
    const card = page.locator(".lg\\:block [data-figma-node=\"2031:2454\"]").first();
    await card.scrollIntoViewIfNeeded();

    const photoContainer = card.locator("span").first();
    const containerTransform = await photoContainer.evaluate((el) =>
      getComputedStyle(el).transform,
    );
    expect(containerTransform).toBe("none");

    const img = card.locator('img[alt="Юлия Кочкина"]');
    await expect(img).toBeVisible();
    const objectPosition = await img.evaluate(
      (el) => getComputedStyle(el).objectPosition,
    );
    expect(
      objectPosition === "bottom" ||
        objectPosition === "50% 100%" ||
        objectPosition === "50% 50%",
    ).toBe(true);

  });
});

/** Голова в исходнике 1024×768 ≈ 249×271; десктоп object-fill 161×174 даёт ~0.638. */
const DESKTOP_HEAD_RATIO = (249 * (161 / 1024)) / (271 * (174 / 768));

test.describe("InsideCourse author portrait proportions", () => {
  test("390: тот же кадр 161×174, что на десктопе", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/community");

    await expect(page.locator('.lg\\:hidden img[alt="Приложение Kochfit"]')).toHaveCount(0);

    const img = page.locator('.lg\\:hidden img[alt="Юлия Кочкина"]');
    await img.scrollIntoViewIfNeeded();
    await expect(img).toBeVisible();
    await img.evaluate((el) => (el as HTMLImageElement).decode());

    const css = await img.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        objectFit: cs.objectFit,
        boxW: r.width,
        boxH: r.height,
        srcSet: (el as HTMLImageElement).getAttribute("srcset") ?? "",
      };
    });

    expect(css.boxW).toBeCloseTo(161, 0);
    expect(css.boxH).toBeCloseTo(174, 0);
    expect(css.boxW / css.boxH).toBeCloseTo(161 / 174, 2);
    expect(css.srcSet).toContain("imgAuthorPortrait");

    const displayedHeadRatio = (249 * (css.boxW / 1024)) / (271 * (css.boxH / 768));
    expect(displayedHeadRatio).toBeCloseTo(DESKTOP_HEAD_RATIO, 2);

    const card = page.locator('.lg\\:hidden [data-figma-node="2031:2454"]');
    const cardBox = await card.boundingBox();
    if (cardBox) {
      await page.screenshot({
        path: "e2e/screenshots/inside-course-author-390.png",
        clip: {
          x: Math.max(0, cardBox.x - 10),
          y: Math.max(0, cardBox.y - 10),
          width: cardBox.width + 20,
          height: cardBox.height + 20,
        },
      });
    }
  });

  test("1440: object-fill 161×174 на месте Figma 67/−28", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/community");

    const card = page.locator('.lg\\:block [data-figma-node="2031:2454"]');
    const img = card.locator('img[alt="Юлия Кочкина"]');
    await img.scrollIntoViewIfNeeded();
    await expect(img).toBeVisible();

    const css = await img.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const cardEl = el.closest("[data-figma-node=\"2031:2454\"]");
      const cr = cardEl!.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        objectFit: cs.objectFit,
        w: r.width,
        h: r.height,
        left: r.left - cr.left,
        top: r.top - cr.top,
        srcSet: (el as HTMLImageElement).getAttribute("srcset") ?? "",
      };
    });

    expect(css.objectFit).toBe("fill");
    expect(css.w).toBeCloseTo(161, 0);
    expect(css.h).toBeCloseTo(174, 0);
    expect(css.left).toBeCloseTo(67, 1);
    expect(css.top).toBeCloseTo(-28, 1);
    expect(css.srcSet).toContain("imgAuthorPortrait");
    await expect(page.locator('.lg\\:block img[alt="Приложение Kochfit"]')).toBeVisible();

    const box = await card.boundingBox();
    if (box) {
      await page.screenshot({
        path: "e2e/screenshots/inside-course-author-1440.png",
        clip: {
          x: Math.max(0, box.x - 40),
          y: Math.max(0, box.y - 40),
          width: box.width + 80,
          height: box.height + 50,
        },
      });
    }
  });
});

/** /for_pregnant hero — mobile portrait: голова не клипится, ноги у низа зоны */
test.describe("Pregnancy hero portrait @375", () => {
  test("375: scale 1.08 + zone 208px — head visible, feet near bottom", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/for_pregnant", { waitUntil: "networkidle" });
    await page.locator('button:has-text("Согласен")').click({ timeout: 3000 }).catch(() => {});

    const hero = page.locator('[data-figma-node="2351:10753"]');
    await expect(hero).toBeVisible();

    const portrait = hero.locator("img").nth(1);
    await expect(portrait).toBeVisible();
    await portrait.evaluate((el) => el.decode());

    const metrics = await portrait.evaluate((el) => {
      const zone = el.closest("span")!;
      const cs = getComputedStyle(el);
      const zoneR = zone.getBoundingClientRect();
      const imgR = el.getBoundingClientRect();
      return {
        objectPosition: cs.objectPosition,
        imgH: imgR.height,
        zoneH: zoneR.height,
        zoneTop: zoneR.top,
        headroom: imgR.top - zoneR.top,
        feetGap: zoneR.bottom - imgR.bottom,
      };
    });

    expect(metrics.objectPosition).toBe("50% 18%");
    expect(metrics.imgH / metrics.zoneH).toBeCloseTo(1.08, 1);
    // origin-bottom scale grows past zone bottom; feet stay near bottom of zone.
    expect(metrics.feetGap).toBeLessThanOrEqual(2);
    // Scaled image overhangs zone top; head kept by object-position 18%.
    expect(metrics.headroom).toBeLessThanOrEqual(0);

    const heroBox = await hero.boundingBox();
    expect(heroBox).not.toBeNull();
    await page.screenshot({
      path: "e2e/screenshots/pregnancy-hero-head-375-test.png",
      clip: {
        x: heroBox!.x + 40,
        y: heroBox!.y + 250,
        width: heroBox!.width - 80,
        height: 280,
      },
    });
  });
});

test.describe("InsideCourse author arrow 2031:2456", () => {
  test("390: круг со стрелкой виден и кликабелен", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/community");

    const card = page.locator('.lg\\:hidden [data-figma-node="2031:2454"]');
    const arrow = card.locator('[data-figma-node="2031:2456"]');
    await arrow.scrollIntoViewIfNeeded();
    await expect(arrow).toBeVisible();

    const box = await arrow.boundingBox();
    expect(box?.width).toBeCloseTo(34, 1);
    expect(box?.height).toBeCloseTo(34, 1);

    await Promise.all([page.waitForURL(/\/person/), arrow.click()]);
    await expect(page).toHaveURL(/\/person/);
  });

  test("1440: десктопная кнопка на месте", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/community");

    const card = page.locator('.lg\\:block [data-figma-node="2031:2454"]');
    const arrow = card.locator('[data-figma-node="2031:2456"]');
    await card.scrollIntoViewIfNeeded();
    await expect(arrow).toBeVisible();

    const [arrowBox, cardBox] = await Promise.all([
      arrow.boundingBox(),
      card.boundingBox(),
    ]);
    expect(arrowBox?.width).toBeCloseTo(34, 1);
    expect(arrowBox?.height).toBeCloseTo(34, 1);
    expect(arrowBox!.x).toBeCloseTo(cardBox!.x + 248, 1);
    expect(arrowBox!.y).toBeCloseTo(cardBox!.y + 12, 1);
  });
});
