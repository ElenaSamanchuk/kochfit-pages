#!/usr/bin/env node
/**
 * Максимальный перенос Тильды → src/content/migrated/
 * Всё, что есть в old-site/*.html, становится blog | payment | prose.
 * redirect → v2 только если HTML в архиве нет.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OLD = path.join(ROOT, "old-site");
const OUT = path.join(ROOT, "src/content/migrated");

function decodeHtml(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lrm;/gi, "")
    .trim();
}

function stripTags(html) {
  return decodeHtml(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

/** Kinescope-видео (защищённый видеохостинг — нативной замены iframe нет) */
function extractVideos(html) {
  const ids = new Set();
  for (const m of html.matchAll(
    /https:\/\/kinescope\.io\/(?:embed\/)?([A-Za-z0-9]{16,})/g,
  )) {
    ids.add(m[1]);
  }
  // Ленивые видео Тильды: data-videolazy-type="kinescope" + data-videolazy-id
  for (const m of html.matchAll(
    /data-videolazy-type="kinescope"[^>]*data-videolazy-id="([A-Za-z0-9]+)"/g,
  )) {
    ids.add(m[1]);
  }
  for (const m of html.matchAll(
    /data-videolazy-id="([A-Za-z0-9]+)"[^>]*data-videolazy-type="kinescope"/g,
  )) {
    ids.add(m[1]);
  }
  return [...ids].map((id) => `https://kinescope.io/embed/${id}`);
}

function extractMeta(html) {
  const title = decodeHtml(html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "");
  const description = decodeHtml(
    html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "",
  );
  const ogImage =
    html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] ?? "";
  return { title, description, ogImage };
}

function extractParagraphs(html) {
  const body =
    html.split("<!--header-->")[1]?.split("<!--footer-->")[0] ?? html;
  const chunks = [];

  const pushChunk = (inner) => {
    const t = inner.trim();
    if (t.length < 25) return;
    if (/cookieConsent|cookie-banner|Наш сайт использует куки/i.test(t)) return;
    chunks.push(t);
  };

  for (const m of body.matchAll(
    /class="t-text[^"]*"[\s\S]*?<div[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g,
  )) {
    pushChunk(m[1]);
  }
  for (const m of body.matchAll(
    /field='tn_text_[^']*'>([\s\S]*?)<\/div>/g,
  )) {
    pushChunk(m[1]);
  }
  for (const m of body.matchAll(
    /class='tn-atom'[^>]*>([\s\S]*?)<\/div>/g,
  )) {
    const t = stripTags(m[1]);
    if (t.length > 25 && !/^(Menu Item|Logo|Главная|Kochfit)/i.test(t)) {
      chunks.push(m[1]);
    }
  }

  const raw = [...new Set(chunks)].join("\n");
  if (!raw) return [];

  const isJunk = (p) =>
    /Наш сайт использует куки|политикой в отношении обработки персональных данных|^Согласен\b/i.test(
      p,
    );

  const parts = raw
    .split(/<br\s*\/?>/gi)
    .map((p) => stripTags(p))
    .filter((p) => p.length > 8 && !isJunk(p));

  return parts.length
    ? parts
    : [stripTags(raw)].filter((p) => p.length > 8 && !isJunk(p));
}

function parseHtaccess() {
  const ht = fs.readFileSync(path.join(OLD, "htaccess"), "utf8");
  const routes = [];

  for (const m of ht.matchAll(
    /RewriteRule \^([^\s$]+)\$ page(\d+)\.html/gi,
  )) {
    let pattern = m[1].replace(/\\(.)/g, "$1").replace(/\/$/, "");
    if (pattern.includes("(") || pattern.includes("+")) continue;
    routes.push({
      pattern,
      file: `page${m[2]}.html`,
      exists: fs.existsSync(path.join(OLD, pattern.includes("..") ? "" : OLD, `page${m[2]}.html`)),
    });
  }

  return routes.map((r) => ({
    ...r,
    exists: fs.existsSync(path.join(OLD, r.file)),
  }));
}

const PAYMENT_SLUG_RE =
  /^(special_|premium|standart|recovery|pregnant|prolong_|sale|basket|fbasket|testpay|test7|test-dolyame|diastasisstart|actberemenost|litestart|mtdpay|pay3m|pred|tariff|activation|extendcourse|canceled|standartsub|specialr|specialofferpr|9900|88|8097126|312423|prem_kur|premium_kur|standart_gift|special_gift|special_pack|special_course|special_predkur|special_prem|special_standart|special_for_pregnant|special_mtd|special_recovery|pregnantpresent|startpregnant|premiumstart|recoverystart|saleall|salepr|mtdsale|ny_gift|\d+$)/;

const SKIP_SLUGS = new Set([
  "menu",
  "footer",
  "invent-new",
  "blog",
  "goback404",
  "test",
  "no",
  "yes",
  "admins",
  "f2",
  "ob",
  "offline",
  "profile-lk",
  "history-ballance",
  "test_bot",
  "testform",
  "testoplat",
  "testovtestastste",
  "testwidget",
  "unavailable",
  "1",
]);

/** Контент курсов / уроков — показываем в коде + баннер про ЛК */
const LESSON_PATH_RE =
  /^(week|st\d|st[^a-z]|season|morning|training_day|firstday|secondday|\dday|breath|mtd|diastasis|food|recipes|webinar|pitanie|zaryadk|taping|teipirovanie|ifr|bad|omega|magnesium|calcium|ferrum|lecithin|protein|selen|vitamin|zincum|5htp|slings|somatic|core|power|nutrition|pit_|web_|fooddop|dop_demo|pit_demo|web_demo|7test|personal|training|algorithm|algoritm|aoda|gline|tmj|valgus|massage|mobilization|neurodviz|oculomotor|shoulder|widest|thechest|page_01|eqp_|lk_|dop$|education)/;

function isPaymentPath(pathKey) {
  const root = pathKey.split("/")[0];
  if (SKIP_SLUGS.has(root)) return false;
  return PAYMENT_SLUG_RE.test(root);
}

function isLessonPath(pathKey) {
  const root = pathKey.split("/")[0];
  return LESSON_PATH_RE.test(root) || LESSON_PATH_RE.test(pathKey);
}

function extractAlias(html) {
  return (
    html.match(/data-tilda-page-alias="([^"]+)"/)?.[1]?.replace(/\/$/, "") ??
    null
  );
}

function addProse(prosePages, pathKey, meta, paragraphs, lesson, videos = []) {
  if (!meta.title || meta.title.length < 2) return;
  const body =
    paragraphs.length > 0
      ? paragraphs.slice(0, 120)
      : meta.description
        ? [meta.description]
        : [`Страница «${meta.title}» проекта Kochfit.`];
  if (prosePages[pathKey]) return;
  prosePages[pathKey] = {
    path: pathKey,
    slug: pathKey.replace(/\//g, "_"),
    title: meta.title,
    description: meta.description || meta.title,
    paragraphs: body,
    lesson: lesson ?? isLessonPath(pathKey),
    ...(videos.length ? { videos } : {}),
  };
}

function addPayment(paymentSlugs, pathKey, meta, html) {
  const price = extractPrice(html);
  if (paymentSlugs[pathKey]) return;
  paymentSlugs[pathKey] = {
    slug: pathKey.replace(/\//g, "_"),
    path: pathKey,
    title: meta.title || pathKey,
    productName: meta.title || pathKey,
    price,
    priceLabel: price ? `${price.toLocaleString("ru-RU")} ₽` : "По запросу",
    ctaLabel: "Купить",
    checkoutUrl: "https://v2.kochfit.ru/",
  };
}

function extractPrice(html) {
  const prices = [
    ...html.matchAll(/(\d[\d\s]{2,6})\s*(?:₽|руб)/gi),
  ].map((m) => Number(m[1].replace(/\s/g, "")));
  return prices.find((p) => p >= 99 && p <= 999_999) ?? 0;
}

function parseUrlMapTitles() {
  const mdPath = path.join(ROOT, "docs/old-site-url-map.md");
  if (!fs.existsSync(mdPath)) return {};
  const md = fs.readFileSync(mdPath, "utf8");
  const titles = {};
  for (const m of md.matchAll(/\| (\/[^\|]+) \| [^|]+ \| ([^|]+) \|/g)) {
    const urlPath = m[1].trim().replace(/^\//, "").replace(/\/$/, "");
    const title = m[2].trim();
    if (!title || /нет в архиве/i.test(title)) continue;
    titles[urlPath] = title;
  }
  return titles;
}

function humanizePath(pathKey) {
  const last = pathKey.split("/").pop() ?? pathKey;
  return last
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getStaticAppSlugs() {
  const appRoot = path.join(ROOT, "src/app");
  const slugs = new Set();
  for (const ent of fs.readdirSync(appRoot, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    if (ent.name.startsWith("[")) continue;
    slugs.add(ent.name);
  }
  return slugs;
}

function main() {
  if (!fs.existsSync(OLD)) {
    console.error("old-site/ not found");
    process.exit(1);
  }

  fs.mkdirSync(OUT, { recursive: true });

  const routes = parseHtaccess();
  const staticSlugs = getStaticAppSlugs();

  const blogPosts = {};
  const prosePages = {};
  const paymentSlugs = {};
  const redirects = {};
  const routeIndex = {};

  for (const route of routes) {
    routeIndex[route.pattern] = route;
    if (!route.exists) {
      redirects[route.pattern] = `https://v2.kochfit.ru/${route.pattern}`;
    }
  }

  for (const route of routes) {
    if (!route.exists) continue;

    const pathKey = route.pattern;
    const html = fs.readFileSync(path.join(OLD, route.file), "utf8");
    const meta = extractMeta(html);
    const paragraphs = extractParagraphs(html);
    const videos = extractVideos(html);
    const root = pathKey.split("/")[0];

    if (pathKey.startsWith("blog/")) {
      const id = pathKey.slice(5);
      if (!/^\d+$/.test(id)) continue;
      if (!meta.title) continue;
      if (blogPosts[id]) continue;
      const body =
        paragraphs.length > 0
          ? paragraphs
          : [meta.description || `Урок «${meta.title}» курса Kochfit.`];
      blogPosts[id] = {
        id: Number(id),
        title: meta.title,
        description: meta.description,
        paragraphs: body,
        ogImage: meta.ogImage || undefined,
        ...(videos.length ? { videos } : {}),
      };
      continue;
    }

    if (SKIP_SLUGS.has(root)) continue;

    // Уже есть статическая страница в src/app/<slug>/page.tsx
    if (!pathKey.includes("/") && staticSlugs.has(root)) continue;

    if (isPaymentPath(pathKey)) {
      addPayment(paymentSlugs, pathKey, meta, html);
      continue;
    }

    addProse(prosePages, pathKey, meta, paragraphs, isLessonPath(pathKey), videos);
  }

  // Второй проход: все HTML-файлы по data-tilda-page-alias
  for (const file of fs.readdirSync(OLD)) {
    if (!file.endsWith(".html") || file === "404.html") continue;
    const html = fs.readFileSync(path.join(OLD, file), "utf8");
    const alias = extractAlias(html);
    if (!alias || alias.includes("..")) continue;
    const pathKey = alias.replace(/\/$/, "");
    if (pathKey.startsWith("blog/")) continue;
    if (prosePages[pathKey] || paymentSlugs[pathKey] || blogPosts[pathKey.slice(5)])
      continue;
    if (SKIP_SLUGS.has(pathKey.split("/")[0])) continue;
    if (!pathKey.includes("/") && staticSlugs.has(pathKey.split("/")[0])) continue;

    const meta = extractMeta(html);
    const paragraphs = extractParagraphs(html);
    const videos = extractVideos(html);

    if (isPaymentPath(pathKey)) {
      addPayment(paymentSlugs, pathKey, meta, html);
      continue;
    }
    addProse(prosePages, pathKey, meta, paragraphs, isLessonPath(pathKey), videos);
  }

  // Stub-страницы для URL без HTML (вместо redirect на v2)
  const urlTitles = parseUrlMapTitles();
  for (const pathKey of Object.keys({ ...redirects })) {
    if (prosePages[pathKey] || paymentSlugs[pathKey]) {
      delete redirects[pathKey];
      continue;
    }
    const root = pathKey.split("/")[0];
    if (SKIP_SLUGS.has(root)) {
      delete redirects[pathKey];
      continue;
    }
    if (!pathKey.includes("/") && staticSlugs.has(root)) {
      delete redirects[pathKey];
      continue;
    }
    if (pathKey.startsWith("blog/")) continue;

    const title = urlTitles[pathKey] ?? humanizePath(pathKey);
    const isPay = isPaymentPath(pathKey);
    const isLesson = isLessonPath(pathKey);

    if (isPay) {
      paymentSlugs[pathKey] = {
        slug: pathKey.replace(/\//g, "_"),
        path: pathKey,
        title,
        productName: title,
        price: 0,
        priceLabel: "По запросу",
        ctaLabel: "Перейти к оплате",
        checkoutUrl: "https://v2.kochfit.ru/",
        note: "Страница оплаты перенесена из архива Тильды",
      };
    } else {
      prosePages[pathKey] = {
        path: pathKey,
        slug: pathKey.replace(/\//g, "_"),
        title,
        description: title,
        paragraphs: [
          isLesson
            ? "Материал курса Kochfit. Полный доступ — в личном кабинете на платформе v2.kochfit.ru."
            : "Страница перенесена с сайта kochfit.ru. Если нужна помощь — напишите на info@kochfit.ru.",
        ],
        lesson: isLesson,
        stub: true,
      };
    }
    delete redirects[pathKey];
  }

  fs.writeFileSync(
    path.join(OUT, "blog-posts.json"),
    JSON.stringify(blogPosts, null, 2),
  );
  fs.writeFileSync(
    path.join(OUT, "prose-pages.json"),
    JSON.stringify(prosePages, null, 2),
  );
  fs.writeFileSync(
    path.join(OUT, "payment-slugs.json"),
    JSON.stringify(paymentSlugs, null, 2),
  );
  fs.writeFileSync(
    path.join(OUT, "redirects.json"),
    JSON.stringify(redirects, null, 2),
  );
  fs.writeFileSync(
    path.join(OUT, "route-index.json"),
    JSON.stringify(routeIndex, null, 2),
  );

  console.log(
    JSON.stringify(
      {
        blog: Object.keys(blogPosts).length,
        prose: Object.keys(prosePages).length,
        payments: Object.keys(paymentSlugs).length,
        redirectsNoHtml: Object.keys(redirects).length,
      },
      null,
      2,
    ),
  );
}

main();
