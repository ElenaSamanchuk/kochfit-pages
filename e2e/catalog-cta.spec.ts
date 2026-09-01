import { expect, test } from "@playwright/test";

/** Регресс: кнопки каталога — только «Подробнее», цена снаружи (Figma 2261:1785) */
test.describe("Courses catalog CTA", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#courses").scrollIntoViewIfNeeded();
  });

  test("4× «Подробнее» в кнопках, цены не внутри catalog-cta-btn", async ({
    page,
  }) => {
    const buttons = page.locator("#courses a.catalog-cta-btn");
    await expect(buttons).toHaveCount(4);

    for (const button of await buttons.all()) {
      await expect(button).toHaveText("Подробнее");
      await expect(button).not.toContainText("₽");
      await expect(button).not.toContainText("от ");
    }

    const prices = page.locator("#courses .text-body-lg.font-bold.text-ink");
    await expect(prices).toHaveCount(4);
    await expect(prices.first()).toContainText("от 2 490");
  });
});
