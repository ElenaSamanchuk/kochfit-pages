# Equipment & URL audit (август 2026)

Сравнение нового архива Тильды (`kochfit_fde4c0c01e03bbf3fb86e51cb70c0e994721bbba.zip`) с Next.js-проектом `kochfit-redesign`.

## Инвентарь `/equipment`

| | Старый архив | Новый архив | Next.js |
|---|-------------|-------------|---------|
| URL | `/equipment` | `/equipment` | `/equipment` |
| Tilda HTML | `page39292488.html` | `page158387209.html` | — |
| Контент | Статическая страница | iframe → `kochfit-oborudovanie` | **Native React** `EquipmentCatalog` |
| Старый slug | — | `/equipment-old` → `page39292488` | нет (не в htaccess нового архива) |

**Реализация:** данные и изображения из [`kochfit-oborudovanie`](https://github.com/ElenaSamanchuk/kochfit-oborudovanie) (`npm run extract:equipment`), UI в `src/components/equipment/EquipmentCatalog.tsx`, голубая схема Figma (`--gradient-primary`, `surface-blue`, `accent`). Без iframe.

**Редиректы:**

- `/invent-new` → `/equipment` (`src/app/invent-new/page.tsx`)
- `/trainingequipment` → `/equipment` (уже было)

## Изменения URL в htaccess (531 правило)

Единственное изменение маршрута маркeting-страниц:

- `/equipment`: `page39292488.html` → `page158387209.html`
- Добавлен `/equipment-old` на старый HTML
- `/invent-new` убран из htaccess (контент = тот же `page158387209`)

## Намеренные Figma-страницы (не из Тильды)

Не сравниваются с архивом — дизайн из Figma, голубая палитра:

| URL | Компонент |
|-----|-----------|
| `/` | Home |
| `/community` | Community |
| `/e_mtd` | MTD landing |
| `/r` | Referral |
| `/for_pregnant` | Pregnant landing |

## Покрытие URL (marketing + контент)

| Статус | Кол-во | Примеры |
|--------|--------|---------|
| Статическая страница в `src/app/` | ~14 | `/equipment`, `/faq`, `/oferta`, … |
| Catch-all prose | ~299 | уроки, landing из JSON |
| Catch-all payments | ~129 | `special_*`, тарифы |
| Blog | 36 постов | `/blog/[id]` |
| Редирект StaticRedirect | 6+ | `/invent-new`, `/koch_journal`, `/trainingequipment`, … |
| Widget-only Tilda | 2 | `/menu`, `/footer` — в SKIP, не рендерятся |
| Тестовые slug | 7 | `test`, `yes`, `no`, `1`, … — SKIP |

**Redirects на v2:** `redirects.json` пуст — все URL с HTML в архиве перенесены в код.

## Замечания

1. **`route-index.json`:** `equipment` обновлён на `page158387209.html`.
2. **`/care`:** stub-страница в коде; в архиве может отличаться контент — проверить при обновлении `old-site/`.
3. **Деплой:** `npm run build:server` + `KOCHFIT_SSH_KEY=… npm run deploy:server` → `http://212.233.93.151/kochfit/`.

## Команды

```bash
npm run extract:equipment   # обновить data/images из ../kochfit-oborudovanie
npm run migrate:tilda         # после распаковки old-site/
npm run build:server
```
