import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1200, height: 800 },
  { width: 1440, height: 900 },
] as const;

type BannerMetrics = {
  bannerHeight: number;
  ctaHeight: number;
  ctaClipped: boolean;
  bgOffsetTop: number;
};

const SUBSCRIBE_HREFS = [
  "https://v2.kochfit.ru/payments/tariff_4AOXwN/checkout?subscription=1",
  "https://v2.kochfit.ru/payments/tariff_gPopA7/checkout?subscription=1",
] as const;

async function openTariffs(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.goto("/community", { waitUntil: "load" });
  const section = page.locator("#tariffs");
  await section.scrollIntoViewIfNeeded();
  return section;
}

async function measureBanner(cta: ReturnType<Page["locator"]>): Promise<BannerMetrics> {
  return cta.evaluate((el) => {
    const btn = el.getBoundingClientRect();
    let banner: HTMLElement | null = el.parentElement;
    while (banner && getComputedStyle(banner).overflow !== "hidden") {
      banner = banner.parentElement;
    }
    if (!banner) {
      throw new Error("subscription banner not found");
    }
    const box = banner.getBoundingClientRect();
    const bg = banner.querySelector("img");
    const bgBox = bg?.getBoundingClientRect();
    const slack = 1;
    return {
      bannerHeight: box.height,
      ctaHeight: btn.height,
      ctaClipped:
        btn.bottom > box.bottom + slack ||
        btn.top < box.top - slack ||
        btn.height < 8,
      bgOffsetTop: bgBox ? bgBox.top - box.top : NaN,
    };
  });
}

test.describe("Тарифы /community — подписка и тап-зоны", () => {
  for (const { width, height } of viewports) {
    test(`кнопка «Оформить подписку» не срезана @${width}`, async ({ page }) => {
      test.setTimeout(60_000);
      const section = await openTariffs(page, width, height);
      const ctas = section.getByRole("link", { name: "Оформить подписку" });
      await expect(ctas).toHaveCount(2);
      await expect(ctas.nth(0)).toHaveAttribute("href", SUBSCRIBE_HREFS[0]);
      await expect(ctas.nth(1)).toHaveAttribute("href", SUBSCRIBE_HREFS[1]);

      for (let i = 0; i < 2; i += 1) {
        const metrics = await measureBanner(ctas.nth(i));
        expect(metrics.ctaClipped, `banner ${i} clipped @${width}`).toBe(false);
        expect(metrics.ctaHeight).toBeGreaterThanOrEqual(width < 640 ? 44 : 37);
        if (width < 640) {
          expect(metrics.bannerHeight).toBeGreaterThan(82);
        } else {
          expect(metrics.bannerHeight).toBeCloseTo(82, 0);
        }
        // Фон прибит к top: -16px — не едет при росте баннера
        expect(metrics.bgOffsetTop).toBeCloseTo(-16, 0);
      }
    });

    test(`плашки в шапке тарифа компактны @${width}`, async ({ page }) => {
      test.setTimeout(60_000);
      const section = await openTariffs(page, width, height);
      const coral = section.getByText("Количество мест ограничено", { exact: true });
      const grey = section.getByText("Самостоятельное прохождение по видео", { exact: true });
      await expect(coral).toBeVisible();
      await expect(grey).toBeVisible();

      const [coralBox, greyBox, premiumCard] = await Promise.all([
        coral.boundingBox(),
        grey.boundingBox(),
        section.locator("article").nth(1).boundingBox(),
      ]);
      if (!coralBox || !greyBox || !premiumCard) {
        throw new Error("tariff header badges not measured");
      }

      if (width < 640) {
        expect(coralBox.height, "coral badge height @mobile").toBeLessThan(26);
        expect(greyBox.height, "grey badge height @mobile").toBeLessThan(26);
        expect(coralBox.width, "coral badge w-fit @mobile").toBeLessThan(premiumCard.width * 0.72);
      } else {
        expect(coralBox.height, "coral badge height @desktop").toBeCloseTo(28, 0);
        expect(greyBox.height, "grey badge height @desktop").toBeCloseTo(28, 0);
      }
    });

    test(`бейджи скидки/периода на баннере подписки @${width}`, async ({ page }) => {
      test.setTimeout(60_000);
      const section = await openTariffs(page, width, height);
      const priceRows = section.locator("[data-sub-price]");
      await expect(priceRows).toHaveCount(2);

      for (let i = 0; i < 2; i += 1) {
        const metrics = await priceRows.nth(i).evaluate((el) => {
          let banner: HTMLElement | null = el.parentElement;
          while (banner && getComputedStyle(banner).overflow !== "hidden") {
            banner = banner.parentElement;
          }
          if (!banner) {
            throw new Error("subscription banner not found");
          }
          const box = banner.getBoundingClientRect();
          const visible = (s: Element) =>
            s instanceof HTMLElement && s.getClientRects().length > 0;
          const priceRow = banner.querySelector("[data-sub-price]");
          const benefitRow = banner.querySelector("[data-sub-benefit]");
          if (!priceRow || !benefitRow) {
            throw new Error("subscription price/benefit rows not found");
          }
          const discount = Array.from(benefitRow.querySelectorAll("span")).find(
            (s) => s.textContent?.trim() === "-25%" && visible(s),
          ) ?? Array.from(priceRow.querySelectorAll("span")).find(
            (s) => s.textContent?.trim() === "-25%" && visible(s),
          );
          if (!discount) {
            throw new Error("-25% badge not found");
          }
          const caption = Array.from(benefitRow.querySelectorAll("span")).find(
            (s) => s.textContent?.trim() === "Выгоднее с подпиской" && visible(s),
          );
          if (!caption) {
            throw new Error("Выгоднее с подпиской not found");
          }
          const d = discount.getBoundingClientRect();
          const c = caption.getBoundingClientRect();
          const pr = priceRow.getBoundingClientRect();
          const period = Array.from(banner.querySelectorAll("span")).find(
            (s) => s.textContent?.trim() === "1 месяц" && visible(s),
          );
          const p = period?.getBoundingClientRect();
          const mid = (r: DOMRect) => (r.top + r.bottom) / 2;
          return {
            insetTop: Math.round(d.top - box.top),
            insetRight: Math.round(box.right - d.right),
            priceAboveCaption: pr.bottom <= c.top + 1,
            sameRowAsCaption: Math.abs(mid(d) - mid(c)) <= 10,
            discountAfterCaption: d.left >= c.right - 1,
            gap: Math.round(d.left - c.right),
            hasPeriod: Boolean(period),
            periodSameRowAsCaption: p ? Math.abs(mid(p) - mid(c)) <= 10 : null,
            periodSameRowAsPrice: p ? Math.abs(mid(p) - mid(pr)) <= 10 : null,
            periodAfterPrice: p
              ? p.left >=
                (Array.from(priceRow.querySelectorAll("span")).find(
                  (s) => s.textContent?.includes("₽") && visible(s),
                )?.getBoundingClientRect().right ?? pr.left) - 1
              : null,
          };
        });

        if (width < 640) {
          expect(metrics.priceAboveCaption, `banner ${i} price above caption @${width}`).toBe(
            true,
          );
          expect(metrics.sameRowAsCaption, `banner ${i} -25% same row as caption @${width}`).toBe(
            true,
          );
          expect(
            metrics.discountAfterCaption,
            `banner ${i} -25% after «Выгоднее с подпиской» @${width}`,
          ).toBe(true);
          expect(metrics.gap, `banner ${i} gap after caption @${width}`).toBeGreaterThanOrEqual(4);
          expect(metrics.gap, `banner ${i} gap after caption @${width}`).toBeLessThanOrEqual(16);
          if (i === 1) {
            expect(metrics.hasPeriod, "premium has 1 месяц badge").toBe(true);
            expect(
              metrics.periodSameRowAsCaption,
              "1 месяц not in benefit row",
            ).toBe(false);
            expect(
              metrics.periodSameRowAsPrice,
              "1 месяц same row as price @mobile",
            ).toBe(true);
            expect(
              metrics.periodAfterPrice,
              "1 месяц after price @mobile",
            ).toBe(true);
          } else {
            expect(metrics.hasPeriod, "standard has no 1 месяц badge").toBe(false);
          }
        } else {
          // sm+: бейджи в строке с ценой, не в углу карточки
          expect(metrics.insetTop, `banner ${i} not corner @${width}`).toBeGreaterThan(16);
          expect(metrics.insetRight, `banner ${i} not right-aligned @${width}`).toBeGreaterThan(40);
        }
      }
    });

    test(`высоты кнопок @${width}`, async ({ page }) => {
      test.setTimeout(60_000);
      const section = await openTariffs(page, width, height);

      const how = section.getByRole("button", { name: /Как работает подписка/ }).first();
      const buy = section.getByRole("link", { name: "Купить" }).first();

      const [howH, buyH] = await Promise.all([
        how.evaluate((el) => el.getBoundingClientRect().height),
        buy.evaluate((el) => el.getBoundingClientRect().height),
      ]);

      if (width < 640) {
        expect(howH).toBeLessThan(40);
        expect(howH).toBeCloseTo(29, 0);
        expect(buyH).toBeGreaterThanOrEqual(44);
      } else {
        expect(howH).toBeCloseTo(29, 0);
        expect(buyH).toBeGreaterThanOrEqual(37);
        expect(buyH).toBeLessThan(42);
      }
    });
  }

  test("попап «Как работает подписка» — мокап телефона виден @390", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.addInitScript(() => {
      localStorage.setItem("cookieConsent", "accepted");
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/community", { waitUntil: "load" });
    await page.waitForLoadState("networkidle");
    const section = page.locator("#tariffs");
    await section.scrollIntoViewIfNeeded();
    const how = section.getByRole("button", { name: /Как работает подписка/ }).first();
    await expect(how).toBeVisible();
    await how.click();

    const dialog = page.getByRole("dialog", { name: "Как работает подписка" });
    await expect(dialog).toBeVisible({ timeout: 15_000 });

    const hero = dialog.locator("[data-subscription-hero]");
    await expect(hero).toBeVisible();
    const heroBox = await hero.boundingBox();
    expect(heroBox, "шапка с мокапом").not.toBeNull();
    expect(heroBox!.height).toBeGreaterThan(120);

    const photo = hero.locator('img[src*="imgIPhone16Pro"]');
    await expect(photo).toBeVisible();
    const photoBox = await photo.evaluate(async (el) => {
      const image = el as HTMLImageElement;
      if (!image.complete || image.naturalWidth === 0) {
        await image.decode().catch(() => undefined);
      }
      const r = image.getBoundingClientRect();
      const parent = image.closest("[data-subscription-hero]")!.getBoundingClientRect();
      const visibleH = Math.min(r.bottom, parent.bottom) - Math.max(r.top, parent.top);
      const visibleW = Math.min(r.right, parent.right) - Math.max(r.left, parent.left);
      return { visibleH, visibleW, naturalW: image.naturalWidth };
    });
    expect(photoBox.visibleH, "фото обрезано в ноль").toBeGreaterThan(80);
    expect(photoBox.visibleW).toBeGreaterThan(80);
    expect(photoBox.naturalW).toBeGreaterThan(0);

    await expect(dialog.getByRole("button", { name: "Закрыть" }).first()).toBeVisible();
    await expect(dialog.getByText("1 шаг").first()).toBeVisible();
    await expect(dialog.getByText("4 шаг").first()).toBeVisible();

    await dialog.screenshot({
      path: "e2e/screenshots/subscription-popup-390.png",
    });
  });

  test("попап «Как работает подписка» — мокап на десктопе @1440", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.addInitScript(() => {
      localStorage.setItem("cookieConsent", "accepted");
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/community", { waitUntil: "load" });
    await page.waitForLoadState("networkidle");
    const section = page.locator("#tariffs");
    await section.scrollIntoViewIfNeeded();
    const how = section.getByRole("button", { name: /Как работает подписка/ }).first();
    await expect(how).toBeVisible();
    await how.click();

    const dialog = page.getByRole("dialog", { name: "Как работает подписка" });
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog.locator("[data-subscription-hero]")).toHaveCount(1);
    await expect(dialog.locator("[data-subscription-hero]")).toBeHidden();

    const visual = dialog.locator("[data-subscription-visual]").last();
    await expect(visual).toBeVisible();
    const photo = visual.locator("img").nth(1);
    await expect(photo).toBeVisible();
    const box = await photo.boundingBox();
    expect(box, "iPhone на десктопе").not.toBeNull();
    expect(box!.height).toBeGreaterThan(200);

    await dialog.screenshot({
      path: "e2e/screenshots/subscription-popup-1440.png",
    });
  });
});
