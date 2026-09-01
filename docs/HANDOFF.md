# Kochfit — передача проекта (handoff)

Дока для продолжения работы (в т.ч. с другого аккаунта Cursor на этом же компьютере).
Обновлено: 04.08.2026.

## Где что лежит

| Что | Путь |
|---|---|
| Проект (Next.js) | `/Users/elena/Projects/kochfit-redesign` |
| Архив старого сайта (Тильда, распакован) | `/Users/elena/Projects/kochfit-redesign/old-site/` (в git не попадает, см. `.gitignore`) |
| Исходный zip архива | `/Users/elena/Downloads/kochfit_a1b4f884f3ddb64d9f25d1ed2f5c582e7b17e153.zip` |
| Карта всех URL старого сайта (420 шт., по категориям) | `docs/old-site-url-map.md` |
| Правило Cursor с паттерном переноса Figma → код | `.cursor/rules/figma-to-code.mdc` |
| История чата (транскрипт агента, JSONL) | `/Users/elena/.cursor/projects/Users-elena-Projects-Bi13/agent-transcripts/9a954f71-b151-4ea5-a093-2201f02b2537/9a954f71-b151-4ea5-a093-2201f02b2537.jsonl` |
| Скрипт скачивания ассетов Figma | `scripts/fetch-figma-assets.mjs` |

## Стек и запуск

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4.
- Запуск: `npm run dev` — **порт 3400** (`http://localhost:3400`), порт 3000 занят другим процессом.
- Проверки: `npx tsc --noEmit`, `npx eslint <файлы>`.
- Шрифты: Evolventa (локальные файлы, `font-display`) + Nunito Sans (Google, базовый) — `src/lib/fonts.ts`.

## Дизайн

- Figma-файл: `E33rLVjz9QeBWkBf1AHDvj` («Редизайн август сентябрь 2025»), канвас `441:7898`.
- Актуальная палитра — секция **«голубой цвет»**. Зелёного нигде быть не должно.
- Токены в `src/app/globals.css`:
  - `--color-ink #4b4d57`, `--color-ink-secondary #676971`, `--color-ink-muted #999ca8`
  - `--color-accent #84b0d2`, `--color-surface #f8f8f8`, `--color-surface-blue #edf4f9`
  - градиенты `--gradient-primary` (голубой) и `--gradient-soft` (светло-голубой)
- Паттерн переноса из Figma описан в `.cursor/rules/figma-to-code.mdc`
  (метаданные → design context посекционно → скачивание ассетов скриптом → компонент → визуальная сверка).

## Что уже сделано (готово и проверено)

Обновлено 04.08.2026 (вечер): миграция публичных/юр/оплат + метрики + Playwright.

5 страниц по новому дизайну Figma + общие блоки:

| Роут | Страница | Figma node | Компоненты |
|---|---|---|---|
| `/` | Главная | `2031:1818` | `src/components/home/*` |
| `/community` | Красота и здоровье | `2031:2178` | `src/components/beauty/*` |
| `/e_mtd` | Мышцы тазового дна и дыхание | `2031:2607` | `src/components/pelvic/*` |
| `/r` | Восстановление после родов | `2042:9154` | `src/components/postpartum/*` |
| `/for_pregnant` | Активная беременность | `2351:10750` | `src/components/pregnancy/*` |
| — | Попап подписки | `2052:3141` | `src/components/site/SubscriptionPopup.tsx` |
| — | Шапка (общая) | — | `src/components/site/HeroHeader.tsx` (проп `lkVariant`) |
| — | Футер (общий, во всех страницах через layout) | `442:11705` | `src/components/site/Footer.tsx` |
| — | «Что вас ждёт на курсе» (переиспользуемая) | — | `src/components/site/ExpectCourseSection.tsx` |

Также готово:

- SEO: метаданные + OpenGraph на всех страницах, `robots.ts`, `sitemap.ts`, favicon со старого сайта, `metadataBase = https://kochfit.ru`.
- Все внешние ссылки централизованы в `src/content/links.ts` (домен kochfit.ru, ЛК на v2.kochfit.ru).
- Контент футера перенесён со старого сайта (курсы, юр. документы, реквизиты ИП, соцсети) в голубой схеме.
- Проверен диапазон 1200–1440px на всех 5 страницах: горизонтального перелива нет (макет — «от 1200 px»).
- Ассеты по страницам: `public/images/{home, beauty-health, pelvic-floor, postpartum, pregnancy, shared, subscription-popup}`.

## Что уже мигрировано с Тильды (голубая схема)

- Юрдоки: `/oferta`, `/privacy`, `/consent`, `/data-consent`, `/part_oferta`, `/del`
- Публичные: `/person`, `/journal`, `/result` (+редиректы result1/2), `/equipment`, `/faq`, `/suport`, `/work`, `/year-results`, `/taplink`
- Оплаты (шаблон `PaymentPageView` + данные в `src/content/payments.ts`): special_*, basket, sale, standartsub, testpay…
- Техника: Яндекс.Метрика `52961668`, FB Pixel, yandex-verification, nn99, Collabza bonus
- Ссылки в `links.ts` — относительные для внутренних страниц; ЛК/оплата checkout → `v2.kochfit.ru`
- Автотесты: `npm run test:e2e` (Playwright, 30 smoke)

## Что ещё осталось

1. **Статьи блога** `/blog/1`…`/blog/104` — динамический роут + контент из архива.
2. **Остальные ~90 payment URL** — нет HTML в архиве; добавить в `payments.ts` по мере появления данных / с v2.
3. **Закрытый раздел (недели/уроки)** — почти наверняка остаётся на `v2.kochfit.ru`, не переносить.
4. **`/delete`, `/unsubscribe`, `/care`** — файлов нет в архиве.
5. **Мобильный адаптив** — после мобильных макетов Figma.
6. **Деплой** — сервер, SSL, DNS.

## Как продолжать перенос страницы с Тильды (рецепт)

1. Найти файл страницы в `docs/old-site-url-map.md` (URL → `pageXXXX.html`).
2. Извлечь контент: текст, структуру секций, картинки (`old-site/images/`, файлы `tild…`).
3. Собрать страницу из компонентов проекта в голубой схеме (шапка `HeroHeader`, футер уже в layout).
4. Метаданные взять из `<title>`/`<meta>` старой страницы (см. голову HTML-файла).
5. Добавить роут в `src/app/<url>/page.tsx`, обновить `sitemap.ts`, проверить на `localhost:3400`.

## Известные нюансы

- Порт 3000 занят — dev-сервер работает на 3400.
- Ошибка гидрации в консоли из-за `data-cursor-ref` — ложная тревога от инструментов браузера Cursor.
- `next lint --dir` не работает; использовать `npx eslint <файлы>`.
- Figma MCP: design context на целую страницу не влезает — запрашивать посекционно (иначе придут «пустые» ответы без ассетов).
- Внутренние ссылки — `<Link>` из `next/link` (ESLint это проверяет), внешние — `<a>`.
