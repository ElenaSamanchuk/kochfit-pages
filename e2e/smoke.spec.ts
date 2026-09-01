import { expect, test } from "@playwright/test";

const figmaPages = [
  { path: "/", title: /Kochfit/i },
  { path: "/community", title: /красота|здоровье|Kochfit/i },
  { path: "/e_mtd", title: /тазов|дыхан|Kochfit/i },
  { path: "/r", title: /родов|Kochfit/i },
  { path: "/for_pregnant", title: /беремен|Kochfit/i },
];

const migratedPages = [
  "/person",
  "/journal",
  "/result",
  "/equipment",
  "/faq",
  "/suport",
  "/work",
  "/year-results",
  "/oferta",
  "/privacy",
  "/consent",
  "/data-consent",
  "/part_oferta",
  "/del",
  "/sale",
  "/basket",
  "/taplink",
  "/special_recovery3",
  "/care",
  "/delete",
  "/unsubscribe",
  "/education",
  "/blog/1",
  "/diastasisstart",
  "/yes",
  "/no",
  "/tmtd",
  "/teipirovanie1",
  "/webinars",
  "/st10",
];

test.describe("Smoke: страницы отвечают 200", () => {
  for (const page of figmaPages) {
    test(`Figma ${page.path}`, async ({ page: p }) => {
      const res = await p.goto(page.path);
      expect(res?.ok()).toBeTruthy();
      await expect(p.locator("body")).toBeVisible();
      await expect(p).toHaveTitle(page.title);
    });
  }

  for (const path of migratedPages) {
    test(`Migrated ${path}`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.ok()).toBeTruthy();
      await expect(page.locator("h1")).toBeVisible();
    });
  }
});

test.describe("Ссылки и SEO", () => {
  test("футер юрдоки — относительные", async ({ page }) => {
    await page.goto("/");
    // mobile + desktop дублируют ссылку в DOM (разные layout-блоки)
    await expect(page.locator('footer a[href="/oferta"]').first()).toBeAttached();
    await expect(page.locator('footer a[href^="https://kochfit.ru/oferta"]')).toHaveCount(0);
  });

  test("меню блог и результаты — относительные", async ({ page }) => {
    await page.goto("/");
    // первый a[href] в DOM — в скрытом бургер-меню, берём видимые
    await expect(page.locator('a[href="/journal"]:visible').first()).toBeVisible();
    await expect(page.locator('a[href="/result"]:visible').first()).toBeVisible();
  });

  test("журнал ссылается на публичные статьи /st*", async ({ page }) => {
    await page.goto("/journal");
    await expect(page.locator('a[href^="/st"]').first()).toBeVisible();
    // все 14 статей, включая st8 «Холка» и st14 «Ответы на вопросы»
    await expect(page.locator('a[href="/st8"]')).toHaveCount(1);
    await expect(page.locator('a[href="/st14"]')).toHaveCount(1);
    const res = await page.goto("/st9");
    expect(res?.ok()).toBeTruthy();
  });

  test("статьи /st* — полный текст, картинки, без баннера «материал курса»", async ({
    page,
  }) => {
    // тексты Тильды содержат неразрывные пробелы — матчим через [\s\u00a0]
    await page.goto("/st9");
    await expect(page.getByText(/материал[\s\u00a0]курса/i)).toHaveCount(0);
    await expect(
      page.getByText(/диастаз[\s\u00a0]сам[\s\u00a0]сходится/i).first(),
    ).toBeVisible();
    await expect(
      page.locator('article img[src*="/images/articles/st9/"]').first(),
    ).toBeVisible();

    await page.goto("/st4");
    await expect(page.getByText(/материал[\s\u00a0]курса/i)).toHaveCount(0);
    await expect(
      page.getByText(/«строительный[\s\u00a0]материал»/i).first(),
    ).toBeVisible();
  });

  test("result — 13 историй с фото и попапом полной истории", async ({
    page,
  }) => {
    await page.goto("/result");
    const cards = page.locator('img[src*="/images/results/"]');
    await expect(cards).toHaveCount(13);
    // атрибуция: цитата про 1700–1800 ккал принадлежит Дарии Д.
    await expect(page.getByText("Дария Д.")).toBeVisible();
    await page
      .getByRole("button", { name: /Читать полную историю/i })
      .first()
      .click();
    // aria-modal исключает cookie-баннер (тоже role=dialog)
    const story = page.locator('[role="dialog"][aria-modal="true"]');
    await expect(story).toBeVisible();
    await expect(
      story.getByText(/работа с персональным тренером/i),
    ).toBeVisible();
    // нет внутреннего скролла в белой карточке — прокрутка только у оверлея
    const panelOverflow = await story.evaluate((el) =>
      getComputedStyle(el).overflowY,
    );
    expect(panelOverflow).not.toBe("auto");
    expect(panelOverflow).not.toBe("scroll");
    const bodyOverflow = await page.evaluate(
      () => getComputedStyle(document.body).overflow,
    );
    expect(bodyOverflow).toBe("hidden");
    await page.keyboard.press("Escape");
    await expect(story).toBeHidden();
  });

  test("person — портрет и галерея дипломов", async ({ page }) => {
    await page.goto("/person");
    await expect(page.locator('img[src*="/images/person/portrait"]')).toBeVisible();
    await expect(
      page.locator('img[src*="/images/person/"]').nth(10),
    ).toBeAttached();
    await expect(page.getByText("Сертификаты об обучении")).toBeVisible();
  });

  test("basket — лендинг и попап оплаты", async ({ page }) => {
    await page.goto("/basket");
    await expect(page.getByText("Что будет на курсе?")).toBeVisible();
    await expect(page.getByText("Продуктовая корзина")).toBeVisible();
    // индексируемая страница — без noindex
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    await page.getByRole("button", { name: "Участвую!" }).first().click();
    const dialog = page.getByRole("dialog", { name: /Оплата: Персональная работа/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("7 000 ₽")).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Участвую!" })).toHaveAttribute(
      "href",
      "https://v2.kochfit.ru/",
    );
    await page.goto("/basket/pay");
    await expect(page).toHaveURL(/\/basket\?pay=1$/);
    await expect(dialog).toBeVisible();
  });

  test("нет зелёных legacy-ссылок на курсы в футере", async ({ page }) => {
    await page.goto("/");
    // mobile + desktop дублируют ссылку в DOM (разные layout-блоки)
    await expect(page.locator('footer a[href="/community"]').first()).toBeAttached();
    await expect(page.locator('footer a[href="https://kochfit.ru/community"]')).toHaveCount(0);
  });

  test("yandex verification в head", async ({ page }) => {
    await page.goto("/");
    const meta = page.locator('meta[name="yandex-verification"]');
    await expect(meta).toHaveAttribute("content", "dacdb5eda486cd7a");
  });

  test("robots и sitemap доступны", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const body = await sitemap.text();
    expect(body).toContain("/person");
    expect(body).toContain("/blog/1");
    expect(body).toContain("/education");
  });

  test("редирект koch_journal → journal", async ({ page }) => {
    await page.goto("/koch_journal");
    await expect(page).toHaveURL(/\/journal$/);
  });

  test("урок breath — контент в коде", async ({ page }) => {
    await page.goto("/breath");
    await expect(page).toHaveURL(/\/breath$/);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText(/личном кабинете/i)).toBeVisible();
  });

  test("многосегментный URL education/nutrition", async ({ page }) => {
    const res = await page.goto("/education/nutrition");
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("404 своя страница", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist-xyz");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /не найдена/i })).toBeVisible();
  });

  test("бургер открывает левое меню как на старом сайте", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /открыть меню/i }).click();
    const drawer = page.getByRole("dialog", { name: /меню/i });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Красота и здоровье" })).toBeVisible();
    await expect(drawer.getByRole("link", { name: "МТД" })).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Реферальная программа" })).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Личный кабинет" })).toBeVisible();
    await drawer.getByRole("link", { name: "Красота и здоровье" }).click();
    await expect(page).toHaveURL(/\/community/);
  });

  test("бургер-меню на внутренней странице — во всю высоту, все пункты (регресс: backdrop-blur шапки обрезал drawer)", async ({
    page,
  }) => {
    await page.goto("/result");
    await page.getByRole("button", { name: /открыть меню/i }).click();
    const drawer = page.getByRole("dialog", { name: /меню/i });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Красота и здоровье" })).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Реферальная программа" })).toBeVisible();
    const height = await drawer.evaluate(
      (el) => el.getBoundingClientRect().height,
    );
    const viewport = page.viewportSize();
    expect(height).toBeGreaterThanOrEqual((viewport?.height ?? 0) - 1);
  });

  test("главная — телефон PlatformSection по центру секции @1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const section = page.locator('[data-figma-node="2262:2608"]');
    await section.scrollIntoViewIfNeeded();
    const delta = await section.evaluate((sec) => {
      const sr = sec.getBoundingClientRect();
      const phone = sec.querySelector('[data-figma-node="2262:2664"]');
      if (!phone) return null;
      const pr = phone.getBoundingClientRect();
      return Math.abs(pr.left + pr.width / 2 - (sr.left + sr.width / 2));
    });
    expect(delta).not.toBeNull();
    expect(delta!).toBeLessThan(5);
  });

  test("главная — WhyKochfit carousel @375: первая карточка и snap по стрелке", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const section = page.locator('[data-figma-node="2031:1879"]');
    await section.scrollIntoViewIfNeeded();

    const scroller = section.locator("[data-drag-scroll]");
    const firstCard = scroller.locator("article").first();

    const firstVisible = await firstCard.evaluate((el) => {
      const strip = el.closest("[data-drag-scroll]") as HTMLElement;
      const stripRect = strip.getBoundingClientRect();
      const cardRect = el.getBoundingClientRect();
      return cardRect.left >= stripRect.left - 1 && cardRect.right <= stripRect.right + 1;
    });
    expect(firstVisible).toBe(true);

    const card1LeftBefore = await firstCard.evaluate((el) => el.getBoundingClientRect().left);

    await section.getByRole("button", { name: "Прокрутить вперёд" }).click();
    await page.waitForTimeout(500);

    const card2LeftAfter = await scroller
      .locator("article")
      .nth(1)
      .evaluate((el) => el.getBoundingClientRect().left);

    expect(Math.abs(card2LeftAfter - card1LeftBefore)).toBeLessThan(3);
  });

  test("for_pregnant — equipment carousel drag scroll @1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/for_pregnant");
    const scroller = page.locator('[data-figma-node="2351:11434"]');
    await scroller.scrollIntoViewIfNeeded();

    const metrics = await scroller.evaluate((el) => ({
      scrollLeft: el.scrollLeft,
      maxScroll: el.scrollWidth - el.clientWidth,
    }));
    expect(metrics.maxScroll).toBeGreaterThan(0);

    const box = await scroller.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + 220, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x - 220, box!.y + box!.height / 2, { steps: 16 });
    await page.mouse.up();

    const afterDrag = await scroller.evaluate((el) => el.scrollLeft);
    expect(afterDrag).toBeGreaterThan(0);

    const lastCardFullyVisible = await scroller.locator("article").last().evaluate((el) => {
      const strip = el.closest("[data-drag-scroll]") as HTMLElement;
      const stripRect = strip.getBoundingClientRect();
      const cardRect = el.getBoundingClientRect();
      return cardRect.right <= stripRect.right + 2;
    });
    expect(lastCardFullyVisible).toBe(true);
  });

  test("equipment — кнопка «Ссылки, рекомендации» видима с градиентом (регресс: невалидный bg-[var(--gradient-primary)])", async ({
    page,
  }) => {
    await page.goto("/equipment");
    const btn = page
      .getByRole("button", { name: /ссылки, рекомендации/i })
      .first();
    await expect(btn).toBeVisible();
    const bgImage = await btn.evaluate(
      (el) => getComputedStyle(el).backgroundImage,
    );
    expect(bgImage).toContain("linear-gradient");
    await btn.click();
    await expect(
      page.locator('[role="dialog"][aria-modal="true"]'),
    ).toBeVisible();
  });

  test("cookie banner появляется", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("dialog", { name: /cookies/i })).toBeVisible({
      timeout: 5000,
    });
  });

  test("ВК-плашка на главной: ссылка, fade-out и cookie", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/");
    const bar = page.locator(".vk-notice").filter({
      hasText: /не работает Телеграм/i,
    });
    await expect(bar).toBeVisible();
    await expect(
      bar.locator('a[href="https://vk.com/kochfit"]').first(),
    ).toHaveAttribute("target", "_blank");

    await Promise.all([
      bar.waitFor({ state: "hidden", timeout: 2000 }),
      bar.getByRole("button", { name: /закрыть уведомление/i }).click(),
    ]);

    const cookies = await context.cookies();
    const closed = cookies.find((c) => c.name === "kochfit_vk_notice_closed");
    expect(closed?.value).toBe("1");
    expect(closed?.expires ?? 0).toBeGreaterThan(
      Date.now() / 1000 + 60 * 60 * 24 * 300,
    );

    await page.reload();
    await expect(
      page.locator(".vk-notice").filter({ hasText: /не работает Телеграм/i }),
    ).toHaveCount(0);
  });

  test("урок с видео содержит Kinescope-плеер", async ({ page }) => {
    await page.goto("/teipirovanie1");
    await expect(page.locator('iframe[src*="kinescope.io/embed"]').first()).toBeVisible();
  });
});

test.describe("Консоль и адаптив", () => {
  for (const { path } of figmaPages) {
    test(`нет консольных ошибок: ${path}`, async ({ page }) => {
      // Холодная компиляция маршрута в dev под параллельной нагрузкой может
      // превышать дефолтные 30s — networkidle ждём дольше
      test.setTimeout(90_000);
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() !== "error") return;
        const text = msg.text();
        // Известные внешние/ложные: гидрация от data-cursor-ref, блокировщики метрик
        if (/data-cursor-ref|hydrat/i.test(text)) return;
        if (/mc\.yandex|facebook|nn99|collabza|net::ERR/i.test(text)) return;
        errors.push(text);
      });
      await page.goto(path, { waitUntil: "networkidle" });
      expect(errors, errors.join("\n")).toHaveLength(0);
    });
  }

  for (const { path } of figmaPages) {
    test(`нет горизонтального скролла 375px: ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await page.goto(path, { waitUntil: "load" });
      await page.waitForTimeout(400);
      const { sw, iw } = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        iw: window.innerWidth,
      }));
      expect(sw, `scrollWidth ${sw} > innerWidth ${iw}`).toBeLessThanOrEqual(iw);
    });
  }
});

test.describe("Mobile hero @375", () => {
  const courseHeroPaths = [
    { path: "/community", node: "2031:2181", botFirst: true },
    { path: "/r", node: "2042:9157", botFirst: false },
  ] as const;

  for (const { path, node, botFirst } of courseHeroPaths) {
    test(`hero влезает в экран: ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(path, { waitUntil: "load" });
      await page.waitForTimeout(400);

      const hero = page.locator(`[data-figma-node="${node}"]`);
      await expect(hero).toBeVisible();

      const metrics = await hero.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return {
          height: rect.height,
          bottom: rect.bottom,
          viewport: window.innerHeight,
        };
      });

      expect(metrics.height).toBeGreaterThanOrEqual(metrics.viewport * 0.95);
      expect(metrics.bottom).toBeLessThanOrEqual(metrics.viewport + 2);

      const cards = hero.locator(".flex-col-reverse > *, .flex-col-reverse > div");
      await expect(cards.first()).toBeVisible();

      if (botFirst) {
        await expect(hero.getByText("Бот предзаписи").first()).toBeVisible();
        const botCard = hero.locator('[data-figma-node="2031:2231"]');
        await expect(botCard).toBeVisible();
      }
    });
  }
});
