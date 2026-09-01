#!/usr/bin/env node
/**
 * Перенос уроков/нутриции из LIVE kochfit.ru/<slug> → src/content/lessons/<slug>.ts
 * + public/images/lessons/<slug>/ + src/app/<slug>/page.tsx
 * Архив old-site/ — только запасной HTML, если live недоступен.
 *
 * Запуск: node scripts/migrate-lessons.mjs [--debug] [--only=tmj,food]
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OLD = path.join(ROOT, "old-site");
const IMG_OUT = path.join(ROOT, "public/images/lessons");
const CONTENT_OUT = path.join(ROOT, "src/content/lessons");
const LIVE_DIR = "/tmp/kochfit-live";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const DEBUG = process.argv.includes("--debug");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const ONLY = onlyArg
  ? new Set(onlyArg.slice(7).split(",").map((s) => s.trim()).filter(Boolean))
  : null;
/** Ручная вёрстка /stlk — не перезаписывать парсером. */
const KEEP_HAND = new Set(["stlk"]);

/** slug → Tilda page id + запасной заголовок */
const PAGES = {
  tmtd: { pid: "43125711", title: "Тейпирование" },
  tmj: { pid: "25017522", title: "Язык, лицо и работа с ВНЧС" },
  foottapingtheory: { pid: "23205504", title: "Стопа, теория + тейпирование" },
  teipirovaniehalusvalgus: {
    pid: "22238273",
    title: "Тейпирование халюс вальгус и стопы",
  },
  tld: { pid: "20761641", title: "Тейпирование: лимфодренаж живота" },
  teipirovanie1: { pid: "18422510", title: "Тейпирование шрамов" },
  teipirovanie2: { pid: "18422733", title: "Тейпирование диастаза" },
  teipirovanie3: { pid: "18422959", title: "Тейпирование пупочного кольца" },
  tapingcrest: { pid: "23690082", title: "Тейпирование холки" },
  breathtest: { pid: "23936424", title: "Тестирование дыхание" },
  testoda: { pid: "23936452", title: "Тесты ОДА" },
  diastasis: { pid: "24890894", title: "Диастаз теория" },
  mtd: { pid: "23287193", title: "МТД/Дыхание/Живот теория" },
  ifr: { pid: "23285224", title: "2. МФР" },
  faq: { pid: "22998695", title: "Тейпирование: что нужно знать?" },
  bad_2: { pid: "32545782", title: "Что такое БАДы и зачем они нужны" },
  vitamin_d: { pid: "32204824", title: "Витамин D" },
  omega3: { pid: "32236661", title: "Омега–3" },
  magnesium: { pid: "32241098", title: "Магний" },
  selen: { pid: "32241562", title: "Селен и йод" },
  zincum: { pid: "32242093", title: "Цинк" },
  calcium: { pid: "32242271", title: "Кальций" },
  vitamin_c: { pid: "32242372", title: "Витамин С" },
  ferrum: { pid: "32242506", title: "Железо" },
  lecithin: { pid: "32242758", title: "Лецитин" },
  protein: { pid: "32242865", title: "Протеин" },
  "5htp": { pid: "32243061", title: "5–НТР" },
  food: { pid: "39436744", title: "Питание" },
  recipes: { pid: "39292631", title: "Рецепты" },
  fooddop: { pid: "39497957", title: "Дополнительные материалы - питание" },
  fbasket: { pid: "39495259", title: "Продуктовая корзина" },
  pitweb: { pid: "39500136", title: "Психолог Юлия Жарова" },
  "blog/1": { pid: "5105095", title: "Расчет КБЖУ", contentOnly: true },
  "blog/2": { pid: "5105834", title: "Расчет ИМТ", contentOnly: true },
  "blog/3": { pid: "5107449", title: "БЖУ: функции и нормы.", contentOnly: true },
  "blog/5": { pid: "7699348", title: "Питание и метаболизм", contentOnly: true },
  "blog/7": { pid: "7699345", title: "Как пользоваться Fat Secret", contentOnly: true },
  "blog/8": { pid: "7699396", title: "Сахарозаменители", contentOnly: true },
  "blog/10": { pid: "7699329", title: "Как считать готовую крупу", contentOnly: true },
  ifrtheory: { pid: "23203985", title: "МФР теория" },
  massage: { pid: "28757455", title: "Улучшаем работу ЖКТ через массаж живота" },
  mtdpractice: { pid: "25778439", title: "МТД/Дыхание/Живот практика" },
  tmjjoint: { pid: "25017562", title: "Височно-нижнечелюстной сустав (ВНЧС)" },
};

const CHROME_TYPES = new Set(["131", "270", "450", "702", "890", "420"]);
const DIVIDER_TYPES = new Set(["219"]);

const JUNK_TEXT =
  /cookieConsent|cookie-banner|Наш сайт использует куки|Личный кабинет|^Назад$|^Вернуться$|^ЛК$|^Главная$|^Kochfit\.?$|^Meta признана|^ИНН\s|ИП Шуман|Другие страницы|javascript:history\.back|menuopen|^Зарядк|инвентарь не требуется|^Слинги|^Силовая$|^Algorithm$|^Соматическиетренировки$|^Что будет на курсе/i;

const JUNK_IMG =
  /lib__icons|t-btnflex__icon|leroy|merlin|popup.?screen|__icons__|ScreenShot|image_10\.jpg/i;

const JUNK_CARD =
  /^(Зарядка|Слинги|Силовая|Algorithm|Соматическиетренировки|Инвентарь не требуется|\d+\s*мин|Назад|Вернуться|Открыть|Перейти|Смотреть)$/i;

function unescapeHtml(s) {
  return s
    .replace(/&nbsp;/g, "\u00a0")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lrm;/gi, "");
}

function sanitizeInline(html) {
  let s = html;
  s = s.replace(/<\s*(b|strong)\b[^>]*>/gi, "<strong>");
  s = s.replace(/<\s*\/\s*(b|strong)\s*>/gi, "</strong>");
  s = s.replace(/<\s*(i|em)\b[^>]*>/gi, "<em>");
  s = s.replace(/<\s*\/\s*(i|em)\s*>/gi, "</em>");
  s = s.replace(/<\s*br\s*\/?\s*>/gi, "<br/>");
  s = s.replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi, (_, href) => {
    const clean = rewriteHref(href);
    if (!clean) return "";
    const external = /^(https?:)?\/\//.test(clean) || /^(mailto|tel|tg):/.test(clean);
    return external
      ? `<a href="${clean}" target="_blank" rel="noopener noreferrer">`
      : `<a href="${clean}">`;
  });
  s = s.replace(/<(?!\/?(strong|em|br|a)\b)[^>]+>/gi, " ");
  s = s.replace(/[ \t]+/g, " ");
  s = s.replace(/ ?<br\/> ?/g, "<br/>");
  return s.trim().replace(/^(<br\/>)+|(<br\/>)+$/g, "");
}

function textOf(html) {
  return unescapeHtml(String(html).replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function rewriteHref(href) {
  if (!href) return "";
  let h = href.trim();
  if (/tilda\.(cc|ws)/i.test(h)) return "";
  if (/^javascript:/i.test(h)) return "";
  if (/^#popup/i.test(h) || /^#menu/i.test(h) || h === "#") return "";
  h = h.replace(/^https?:\/\/(www\.)?kochfit\.ru/i, "");
  if (!h.startsWith("/") && !/^(https?:|mailto:|tel:|tg:)/i.test(h)) {
    if (/^[a-z0-9_-]+$/i.test(h)) h = `/${h}`;
  }
  return h;
}

function fieldToBlocks(rawHtml, asHeading) {
  const inline = sanitizeInline(unescapeHtml(rawHtml));
  if (!inline) return [];
  if (asHeading) {
    const text = textOf(rawHtml);
    return text ? [{ t: "h2", text }] : [];
  }
  const paras = inline
    .split(/(?:<br\/>){2,}/)
    .map((p) => p.trim().replace(/^(<br\/>)+|(<br\/>)+$/g, ""))
    .filter(Boolean);
  const blocks = [];
  for (const para of paras) {
    const lines = para.split(/<br\/>/).map((l) => l.trim()).filter(Boolean);
    const isNum = (l) => /^\d+[.)]\s/.test(textOf(l));
    const isBul = (l) => /^[-–—•▪✔✓‼️☀⬆⏩]/u.test(textOf(l));
    const listLines = lines.filter((l) => isNum(l) || isBul(l));
    if (lines.length >= 2 && listLines.length >= Math.max(2, lines.length - 1)) {
      const ordered = lines.filter(isNum).length >= lines.filter(isBul).length;
      const lead = [];
      const items = [];
      for (const l of lines) {
        if (isNum(l)) items.push(l.replace(/^\s*\d+[.)]\s*/, ""));
        else if (isBul(l)) items.push(l.replace(/^\s*[-–—•▪✔✓]\s*/u, ""));
        else if (items.length === 0) lead.push(l);
        else items[items.length - 1] += "<br/>" + l;
      }
      if (lead.length) blocks.push({ t: "p", html: lead.join("<br/>") });
      if (items.length) blocks.push({ t: "list", ordered, items });
    } else {
      const listified = semicolonList(para);
      if (listified) blocks.push(...listified);
      else blocks.push({ t: "p", html: para });
    }
  }
  return blocks;
}

/** «функции: a; b; c» → заголовок + список, как на живой Тильде визуально. */
function semicolonList(para) {
  if (/<a\b/i.test(para)) return null;
  const parts = para
    .split(/;\s+/)
    .map((s) => s.replace(/^(<br\/>)+|(<br\/>)+$/g, "").trim())
    .filter(Boolean);
  if (parts.length < 3) return null;
  const last = parts[parts.length - 1].replace(/\.$/, "");
  const items = [...parts.slice(0, -1), last].map((s) => s.replace(/^[–—•]\s*/, ""));
  if (items.some((s) => textOf(s).length > 280)) return null;
  const out = [];
  const firstPlain = textOf(items[0]);
  const colon = firstPlain.indexOf(":");
  if (colon > 8 && colon < 80 && !/https?:/.test(firstPlain)) {
    const restFirst = items[0].replace(/^[\s\S]*?:\s*/, "");
    out.push({
      t: "p",
      html: `<strong>${firstPlain.slice(0, colon + 1)}</strong>`,
    });
    items[0] = restFirst;
  }
  const cleaned = items.filter((s) => textOf(s).length > 2);
  if (cleaned.length < 3) return null;
  out.push({ t: "list", ordered: false, items: cleaned });
  return out;
}

function splitBody(html) {
  let body = html;
  if (html.includes("<!--header-->")) {
    body = html.split("<!--header-->")[1] ?? html;
  }
  if (body.includes("<!--footer-->")) {
    body = body.split("<!--footer-->")[0] ?? body;
  }
  return body;
}

function recsOf(html) {
  const recs = [];
  const re = /<div id="(rec\d+)"[^>]*data-record-type="(\d+)"/g;
  let m;
  while ((m = re.exec(html))) {
    recs.push({ id: m[1], type: m[2], start: m.index });
  }
  return recs.map((r, i) => ({
    ...r,
    html: html.slice(r.start, i + 1 < recs.length ? recs[i + 1].start : html.length),
  }));
}

function isChromeSeg(seg, type) {
  if (CHROME_TYPES.has(type)) return true;
  if (DIVIDER_TYPES.has(type)) return true;
  if (type === "390") return true; // попап «Что будет на курсе?» — не контент урока
  if (type === "113") return true; // пустой tilda feature
  if (/position\s*:\s*fixed/.test(seg) && /cookie|куки|Личный кабинет/i.test(seg)) {
    return true;
  }
  if (/background-color\s*:\s*#3c3c42/i.test(seg)) return true;
  if (/ИНН\s*246521363326/.test(seg)) return true;
  if (/Наш сайт использует куки/.test(seg) && /cookie-banner/.test(seg)) return true;
  return false;
}

function kinescopeFrom(seg) {
  const ids = [];
  const seen = new Set();
  const add = (id) => {
    if (!id || seen.has(id)) return;
    seen.add(id);
    ids.push(`https://kinescope.io/embed/${id}`);
  };
  for (const m of seg.matchAll(/kinescope\.io\/(?:embed\/)?([A-Za-z0-9]{12,})/g)) {
    add(m[1]);
  }
  for (const m of seg.matchAll(
    /data-videolazy-type="kinescope"[^>]*data-videolazy-id="([A-Za-z0-9]+)"/g,
  )) {
    add(m[1]);
  }
  for (const m of seg.matchAll(
    /data-videolazy-id="([A-Za-z0-9]+)"[^>]*data-videolazy-type="kinescope"/g,
  )) {
    add(m[1]);
  }
  return ids;
}

function youtubeFrom(seg) {
  const ids = [];
  for (const m of seg.matchAll(
    /data-videolazy-type="youtube"[^>]*data-videolazy-id="([^"&?]+)/g,
  )) {
    ids.push(m[1].replace(/\?.*$/, ""));
  }
  for (const m of seg.matchAll(/youtube\.com\/embed\/([^"'?&/]+)/g)) {
    ids.push(m[1]);
  }
  return [...new Set(ids)];
}

function normalizeImgUrl(raw) {
  if (!raw) return "";
  let rel = raw.replace(/^url\(/, "").replace(/['"]/g, "").split("?")[0].trim();
  if (rel.startsWith("//")) rel = "https:" + rel;
  return rel;
}

function imageRefs(seg) {
  const out = [];
  const seen = new Set();
  const push = (raw, width) => {
    const rel = normalizeImgUrl(raw);
    if (!rel) return;
    if (!/\.(jpe?g|png|webp|gif)$/i.test(rel.split("?")[0])) return;
    if (JUNK_IMG.test(rel)) return;
    const isCdn = /tildacdn\.com/i.test(rel);
    const isLocal = /images\//i.test(rel);
    if (!isCdn && !isLocal) return;
    if (width != null && width > 0 && width < 70) return;
    if (seen.has(rel)) return;
    seen.add(rel);
    out.push(rel);
  };
  for (const m of seg.matchAll(
    /(?:data-original|data-img-zoom-url|src)=['"]([^'"]+\.(?:jpe?g|png|webp|gif))['"]/gi,
  )) {
    const w = Number(
      (seg.slice(Math.max(0, m.index - 400), m.index).match(
        /data-field-(?:file)?width-value="(\d+)"/,
      ) || [])[1] || 0,
    );
    push(m[1], w || undefined);
  }
  for (const m of seg.matchAll(/background-image:\s*url\(['"]?([^'")\s]+)/gi)) {
    push(m[1]);
  }
  return out;
}

function copyImage(rel, slug, ctx) {
  const clean = normalizeImgUrl(rel).replace(/^\.?\//, "").split("?")[0];
  if (!clean || JUNK_IMG.test(clean)) return null;
  const ext = path.extname(clean).toLowerCase() || ".jpg";
  const safeExt = ext === ".jpeg" ? ".jpg" : ext;
  const useExt = /\.(jpe?g|png|webp|gif)$/i.test(safeExt) ? safeExt : ".jpg";
  ctx.imgN += 1;
  const name = `${String(ctx.imgN).padStart(2, "0")}${useExt}`;
  const dir = path.join(IMG_OUT, slug);
  fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, name);
  if (DEBUG) return `/images/lessons/${slug}/${name}`;

  if (/^https?:\/\//i.test(clean)) {
    try {
      execFileSync("curl", ["-fsSL", "--max-time", "40", "-A", UA, "-o", target, clean], {
        stdio: "pipe",
      });
      if (fs.existsSync(target) && fs.statSync(target).size > 80) {
        return `/images/lessons/${slug}/${name}`;
      }
    } catch {
      ctx.missing.push(clean);
    }
  }

  const localCandidates = [
    path.join(OLD, clean),
    path.join(OLD, "images", path.basename(clean)),
  ];
  for (const srcPath of localCandidates) {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, target);
      return `/images/lessons/${slug}/${name}`;
    }
  }
  ctx.missing.push(clean);
  ctx.imgN -= 1;
  return null;
}

function fieldsOf(seg) {
  const out = [];
  const re = /<div[^>]*\bfield="([^"]+)"[^>]*>([\s\S]*?)<\/div>/g;
  let m;
  while ((m = re.exec(seg))) {
    out.push({ field: m[1], inner: m[2] });
  }
  return out;
}

function parseElems(seg) {
  const parts = seg.split(/(?=<div class='t396__elem )/);
  const elems = [];
  for (const p of parts) {
    const typ = p.match(/data-elem-type='(\w+)'/);
    if (!typ) continue;
    const top = Number((p.match(/data-field-top-value="(-?\d+)"/) || [])[1] ?? 0);
    const left = Number((p.match(/data-field-left-value="(-?\d+)"/) || [])[1] ?? 0);
    const width = Number(
      (p.match(/data-field-width-value="(\d+)"/) ||
        p.match(/data-field-filewidth-value="(\d+)"/) ||
        [])[1] ?? 0,
    );
    const hrefM = p.match(/href=['"]([^'"]+)['"]/);
    const href = hrefM ? hrefM[1] : "";
    const bgM = p.match(/background-image:\s*url\(['"]?([^'")\s]+)/);
    const imgM = p.match(/tn-atom__img[^>]*src=['"]([^'"]+)/);
    let text = "";
    const am = p.match(/<(?:div|a) class='tn-atom[^']*'[^>]*>([\s\S]*?)<\/(?:div|a)>/);
    if (am) text = textOf(am[1]);
    if (!text) {
      const btn = p.match(/tn-atom__button-text[^>]*>([\s\S]*?)</);
      if (btn) text = textOf(btn[1]);
    }
    elems.push({
      type: typ[1],
      top,
      left,
      width,
      href,
      bg: bgM?.[1] || "",
      img: imgM?.[1] || "",
      text,
    });
  }
  elems.sort((a, b) => a.top - b.top || a.left - b.left);
  return elems;
}

function popupMap(recs) {
  const map = new Map();
  for (const rec of recs) {
    const hook = rec.html.match(/data-tooltip-hook="#(popup:[^"]+)"/);
    const kine = kinescopeFrom(rec.html);
    if (hook && kine[0]) map.set(hook[1], kine[0]);
    const id = rec.html.match(/id="(popup:embedcode\d+)"/);
    if (id && kine[0]) map.set(id[1], kine[0]);
  }
  return map;
}

function emitText(text, title, blocks) {
  if (!text || JUNK_TEXT.test(text)) return;
  if (/^\d+\s*мин$/i.test(text)) return;
  if (/^(открыть|перейти|смотреть)$/i.test(text)) return;
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact) return;
  if (
    title &&
    (compact === title ||
      title.startsWith(compact) ||
      compact.startsWith(title.slice(0, 24)))
  ) {
    return;
  }
  if (compact.length < 90) blocks.push({ t: "h2", text: compact });
  else blocks.push(...fieldToBlocks(compact.replace(/\n/g, "<br/>")));
}

function parseZero(seg, slug, title, popups, ctx, blocks, seenVideo) {
  const artH = Number((seg.match(/data-artboard-height="(\d+)"/) || [])[1] || 0);
  if (artH > 0 && artH <= 70) return; // полоска заголовка «Назад»

  const elems = parseElems(seg).filter((el) => {
    if (el.top < 0) return false;
    if (el.text && JUNK_TEXT.test(el.text)) return false;
    if (el.text && /^\d+\s*мин$/i.test(el.text)) return false;
    return true;
  });

  const colGroups = new Map();
  for (const el of elems) {
    const col = Math.round(el.left / 90);
    if (!colGroups.has(col)) colGroups.set(col, []);
    colGroups.get(col).push(el);
  }

  const columns = [...colGroups.entries()].filter(([, els]) =>
    els.some((e) => e.img || e.bg || (e.href && /#popup:|kochfit\.ru|\//.test(e.href))),
  );
  const longArticle = elems.some((e) => e.text && e.text.length > 180);

  if (columns.length >= 2 && !longArticle) {
    const cardItems = [];
    const pageLinks = [];
    const popupVideos = [];
    for (const [, els] of columns.sort((a, b) => a[0] - b[0])) {
      const texts = els
        .map((e) => e.text)
        .filter(
          (t) =>
            t &&
            !JUNK_TEXT.test(t) &&
            !JUNK_CARD.test(t) &&
            !/^(открыть|перейти|смотреть)$/i.test(t),
        );
      const label = texts.sort((a, b) => b.length - a.length)[0] || "";
      if (label && JUNK_CARD.test(label)) continue;
      const imgEl = els.find((e) => (e.img || e.bg) && (e.width >= 70 || !e.width));
      const srcRel = imgEl?.img || imgEl?.bg || "";
      const popEl = els.find((e) => /#(popup:[a-z0-9_]+)/i.test(e.href));
      const linkEl = els.find((e) => rewriteHref(e.href));
      const href = linkEl ? rewriteHref(linkEl.href) : "";
      if (popEl) {
        const pop = popEl.href.match(/#(popup:[a-z0-9_]+)/i)[1];
        const kine = popups.get(pop);
        if (kine) popupVideos.push({ title: label, kine, srcRel });
      }
      if (href) pageLinks.push(href);
      if (label || srcRel) {
        const p = srcRel ? copyImage(srcRel, slug, ctx) : "";
        cardItems.push({
          href: href || "",
          src: p || "",
          alt: label || title,
          title: label || title,
          label: href ? "Перейти" : popEl ? "Смотреть" : "Открыть",
        });
      }
    }

    const useCards =
      cardItems.filter((c) => c.title && !JUNK_CARD.test(c.title)).length >= 2 &&
      (pageLinks.length >= 1 || slug === "food" || slug === "ifr" || slug === "mtd");

    if (useCards) {
      const items = cardItems.filter((c) => c.title && !JUNK_CARD.test(c.title));
      if (items.length) blocks.push({ t: "cards", items });
      for (const pv of popupVideos) {
        if (pv.title) emitText(pv.title, title, blocks);
        if (pv.kine && !seenVideo.has(pv.kine)) {
          seenVideo.add(pv.kine);
          blocks.push({ t: "kinescope", src: pv.kine });
        }
      }
      for (const src of kinescopeFrom(seg)) {
        if (!seenVideo.has(src)) {
          seenVideo.add(src);
          blocks.push({ t: "kinescope", src });
        }
      }
      return;
    }

    const ordered = columns.sort((a, b) => {
      const ta = Math.min(...a[1].map((e) => e.top));
      const tb = Math.min(...b[1].map((e) => e.top));
      return ta - tb || a[0] - b[0];
    });
    for (const [, els] of ordered) {
      const texts = els
        .map((e) => e.text)
        .filter((t) => t && !JUNK_TEXT.test(t) && !/^(открыть|перейти|смотреть)$/i.test(t));
      const label = texts.sort((a, b) => b.length - a.length)[0] || "";
      const imgEl = els.find((e) => (e.img || e.bg) && (e.width >= 70 || !e.width));
      const srcRel = imgEl?.img || imgEl?.bg || "";
      if (label && label.length < 120) emitText(label, title, blocks);
      else if (label) blocks.push(...fieldToBlocks(label));
      if (srcRel) {
        const p = copyImage(srcRel, slug, ctx);
        if (p) blocks.push({ t: "img", src: p, alt: label || title });
      }
      const popEl = els.find((e) => /#(popup:[a-z0-9_]+)/i.test(e.href));
      if (popEl) {
        const pop = popEl.href.match(/#(popup:[a-z0-9_]+)/i)[1];
        const kine = popups.get(pop);
        if (kine && !seenVideo.has(kine)) {
          seenVideo.add(kine);
          blocks.push({ t: "kinescope", src: kine });
        }
      } else {
        const linkEl = els.find((e) => rewriteHref(e.href));
        const href = linkEl ? rewriteHref(linkEl.href) : "";
        if (href) blocks.push({ t: "cta", href, label: label || "Перейти" });
      }
    }
    for (const src of kinescopeFrom(seg)) {
      if (!seenVideo.has(src)) {
        seenVideo.add(src);
        blocks.push({ t: "kinescope", src });
      }
    }
    return;
  }

  for (const el of elems) {
    if (el.text) emitText(el.text, title, blocks);
    const srcRel = el.img || el.bg;
    if (srcRel && (el.type === "image" || el.type === "shape") && el.width >= 70) {
      const p = copyImage(srcRel, slug, ctx);
      if (p) blocks.push({ t: "img", src: p, alt: el.text || title });
    }
    const pop = (el.href.match(/#(popup:[a-z0-9_]+)/i) || [])[1];
    if (pop && popups.get(pop) && !seenVideo.has(popups.get(pop))) {
      seenVideo.add(popups.get(pop));
      blocks.push({ t: "kinescope", src: popups.get(pop) });
    }
    const href = rewriteHref(el.href);
    if (href && el.type === "button" && el.text && !JUNK_TEXT.test(el.text)) {
      if (!/^(назад|вернуться)$/i.test(el.text)) {
        blocks.push({ t: "cta", href, label: el.text });
      }
    }
  }
  for (const src of kinescopeFrom(seg)) {
    if (!seenVideo.has(src)) {
      seenVideo.add(src);
      blocks.push({ t: "kinescope", src });
    }
  }
}

function parseStandard(rec, slug, title, ctx, blocks, seenVideo, popups) {
  const { type, html: seg } = rec;

  if (type === "868" || type === "331") return; // popups — already mapped
  if (type === "390" || type === "113") return;

  if (type === "4") {
    for (const src of kinescopeFrom(seg)) {
      if (seenVideo.has(src)) continue;
      seenVideo.add(src);
      blocks.push({ t: "kinescope", src });
    }
    for (const id of youtubeFrom(seg)) {
      blocks.push({ t: "video", kind: "youtube", id });
    }
    return;
  }

  if (type === "937") {
    const data = seg.match(/t937__data[^>]*>([\s\S]*?)<\/div>/);
    if (data) {
      const lines = unescapeHtml(data[1])
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const srcs = [];
      for (const line of lines) {
        const m = line.match(/kinescope\.io\/(?:embed\/)?([A-Za-z0-9]{12,})/);
        if (m) {
          const src = `https://kinescope.io/embed/${m[1]}`;
          if (!seenVideo.has(src)) {
            seenVideo.add(src);
            srcs.push(src);
          }
        }
      }
      if (srcs.length === 1) blocks.push({ t: "kinescope", src: srcs[0] });
      else if (srcs.length === 2) {
        blocks.push({ t: "kinescope", src: srcs[0] });
        blocks.push({ t: "kinescope", src: srcs[1] });
      } else if (srcs.length > 2) {
        blocks.push({ t: "kinescopeGallery", srcs });
      }
    }
    return;
  }

  if (type === "944" || type === "191") {
    const hrefM = seg.match(/href=["']([^"']+)["']/);
    const labelM =
      seg.match(/t-btnflex__text[^>]*>([\s\S]*?)</) ||
      seg.match(/t-btn[^>]*>([\s\S]*?)</);
    const rawHref = hrefM ? hrefM[1] : "";
    const href = rewriteHref(rawHref);
    const label = labelM ? textOf(labelM[1]) : "";
    if (
      href &&
      label &&
      !JUNK_TEXT.test(label) &&
      !JUNK_CARD.test(label) &&
      !/tilda\.(cc|ws)/i.test(href)
    ) {
      blocks.push({ t: "cta", href, label });
    }
    return;
  }

  if (type === "585") {
    for (const f of fieldsOf(seg)) {
      if (!f.inner) continue;
      const t = textOf(f.inner);
      if (!t || JUNK_TEXT.test(t)) continue;
      if (f.field === "title" || f.field === "li_title__" || /title/i.test(f.field)) {
        if (t.length < 120) blocks.push({ t: "h2", text: t });
        else blocks.push(...fieldToBlocks(f.inner));
      } else {
        blocks.push(...fieldToBlocks(f.inner));
      }
    }
    const title585 = seg.match(/t585__title[^>]*>([\s\S]*?)<\//);
    if (title585) {
      const t = textOf(title585[1]);
      if (t && t.length < 80 && !blocks.some((b) => b.t === "h2" && b.text === t)) {
        blocks.unshift({ t: "h2", text: t });
      }
    }
    return;
  }

  if (type === "650") {
    const cols = seg.split(/t-card__col /).slice(1);
    const items = [];
    const pendingVideo = [];
    for (const col of cols) {
      const titleM =
        col.match(/t-card__title[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/) ||
        col.match(/t-card__title[^>]*>([\s\S]*?)<\/div>/);
      let href = "";
      let label = "";
      if (titleM && titleM[2] !== undefined) {
        href = titleM[1];
        label = textOf(titleM[2]);
      } else if (titleM) {
        label = textOf(titleM[1]);
        const hm = col.match(/href="([^"]+)"/);
        href = hm ? hm[1] : "";
      }
      if (!label) continue;
      const pop = (href.match(/#(popup:[a-z0-9_]+)/i) || [])[1];
      const imgs = imageRefs(col);
      const src = imgs[0] ? copyImage(imgs[0], slug, ctx) : "";
      if (pop && popups.get(pop)) {
        items.push({
          href: "",
          src: src || "",
          alt: label,
          title: label,
          label: "Смотреть",
        });
        pendingVideo.push({ title: label, src: popups.get(pop) });
        continue;
      }
      const clean = rewriteHref(href);
      items.push({
        href: clean || "",
        src: src || "",
        alt: label,
        title: label,
        label: "Открыть",
      });
    }
    if (items.length) blocks.push({ t: "cards", items });
    for (const v of pendingVideo) {
      if (v.title) emitText(v.title, title, blocks);
      if (v.src && !seenVideo.has(v.src)) {
        seenVideo.add(v.src);
        blocks.push({ t: "kinescope", src: v.src });
      }
    }
    return;
  }

  if (type === "521") {
    const dates = [...seg.matchAll(/field="li_date__[^"]+"[^>]*>([\s\S]*?)<\/div>/g)];
    const texts = [...seg.matchAll(/field="li_text__[^"]+"[^>]*>([\s\S]*?)<\/div>/g)];
    const items = [];
    const n = Math.max(dates.length, texts.length);
    for (let i = 0; i < n; i++) {
      const a = dates[i] ? textOf(dates[i][1]) : "";
      const b = texts[i] ? sanitizeInline(unescapeHtml(texts[i][1])) : "";
      if (a && b) items.push(`<strong>${a}</strong> — ${b}`);
      else if (a || b) items.push(a || b);
    }
    if (items.length) blocks.push({ t: "list", ordered: false, items });
    return;
  }

  if (type === "3" || type === "390" || type === "670") {
    const imgs = imageRefs(seg);
    const capField = fieldsOf(seg).find((f) => f.field === "title" || f.field === "descr");
    const caption = capField ? textOf(capField.inner) : "";
    for (const rel of imgs) {
      const p = copyImage(rel, slug, ctx);
      if (p) {
        blocks.push({
          t: "img",
          src: p,
          alt: caption || title,
          ...(caption && caption.length < 180 ? { caption } : {}),
        });
      }
    }
    if (caption && caption.length >= 40 && type === "3") {
      blocks.push(...fieldToBlocks(capField.inner));
    }
    return;
  }

  if (type === "170" || type === "604" || type === "667") {
    const imgs = [];
    for (const rel of imageRefs(seg)) {
      const p = copyImage(rel, slug, ctx);
      if (p) imgs.push({ src: p, alt: title });
    }
    if (imgs.length === 1) blocks.push({ t: "img", src: imgs[0].src, alt: imgs[0].alt });
    else if (imgs.length > 1) blocks.push({ t: "gallery", images: imgs });
    return;
  }

  if (type === "223") {
    for (const f of fieldsOf(seg)) {
      if (f.field === "text" || f.field === "descr") {
        blocks.push(...fieldToBlocks(f.inner));
      } else if (f.field === "title") {
        const t = textOf(f.inner);
        if (t && t.length < 120) blocks.push({ t: "h2", text: t });
        else if (t) blocks.push(...fieldToBlocks(f.inner));
      }
    }
    for (const rel of imageRefs(seg)) {
      const p = copyImage(rel, slug, ctx);
      if (p) blocks.push({ t: "img", src: p, alt: title });
    }
    return;
  }

  if (type === "795") {
    const f = fieldsOf(seg).find((x) => x.field === "title");
    const t = f ? textOf(f.inner) : "";
    if (t && t !== title && !title.startsWith(t) && t.length < 160) {
      blocks.push({ t: "h2", text: t });
    }
    return;
  }

  // Text-ish blocks including 106, 296, 239, 56, 37, 147, 182, 368, 585
  for (const f of fieldsOf(seg)) {
    const heading = f.field === "uptitle" || f.field === "title";
    const t = textOf(f.inner);
    if (!t || JUNK_TEXT.test(t)) continue;
    if (heading && t.length < 120) {
      if (t === title || title.startsWith(t)) continue;
      blocks.push({ t: "h2", text: t });
    } else {
      blocks.push(...fieldToBlocks(f.inner, false));
    }
  }
  for (const rel of imageRefs(seg)) {
    const p = copyImage(rel, slug, ctx);
    if (p) blocks.push({ t: "img", src: p, alt: title });
  }
  for (const src of kinescopeFrom(seg)) {
    if (seenVideo.has(src)) continue;
    seenVideo.add(src);
    blocks.push({ t: "kinescope", src });
  }
}

function normTitle(s) {
  return s
    .toLowerCase()
    .replace(/[ё]/g, "е")
    .replace(/[^a-zа-я0-9]+/gi, " ")
    .trim();
}

function postProcess(blocks, title) {
  const out = [];
  const seenH2 = new Set();
  const seenKine = new Set();
  const titleN = normTitle(title);
  for (let i = 0; i < blocks.length; i++) {
    let b = blocks[i];
    if (b.t === "p") {
      const t = textOf(b.html);
      if (!t || JUNK_TEXT.test(t)) continue;
      const plain = t.replace(/<[^>]+>/g, "").trim();
      if (
        plain.length < 90 &&
        plain === plain.toUpperCase() &&
        /[А-ЯA-Z]/.test(plain) &&
        !/https?:/.test(plain)
      ) {
        b = { t: "h2", text: plain.replace(/:$/, "") };
      }
    }
    if (b.t === "h2") {
      const t = b.text.trim();
      if (!t || JUNK_TEXT.test(t)) continue;
      if (normTitle(t) === titleN) continue;
      if (seenH2.has(t)) continue;
      seenH2.add(t);
      const next = blocks[i + 1];
      if (next?.t === "p" && textOf(next.html).startsWith(t.slice(0, 40))) continue;
    }
    if (b.t === "cta") {
      if (!b.href || /tilda\.(cc|ws)/i.test(b.href) || /^javascript:/i.test(b.href)) {
        continue;
      }
      if (JUNK_TEXT.test(b.label)) continue;
      if (out.some((x) => x.t === "cta" && x.href === b.href)) continue;
    }
    if (b.t === "cards") {
      b = {
        t: "cards",
        items: b.items
          .filter((it) => it.title && !JUNK_CARD.test(it.title) && !JUNK_TEXT.test(it.title))
          .map((it) => ({
            ...it,
            href: /tilda\.(cc|ws)/i.test(it.href) ? "" : it.href,
          })),
      };
      if (!b.items.length) continue;
    }
    if (b.t === "img" && JUNK_IMG.test(b.src)) continue;
    if (b.t === "kinescope") {
      if (seenKine.has(b.src)) continue;
      seenKine.add(b.src);
    }
    if (b.t === "kinescopeGallery") {
      b = { t: "kinescopeGallery", srcs: b.srcs.filter((s) => {
        if (seenKine.has(s)) return false;
        seenKine.add(s);
        return true;
      }) };
      if (b.srcs.length === 0) continue;
      if (b.srcs.length === 1) b = { t: "kinescope", src: b.srcs[0] };
    }
    out.push(b);
  }
  return out;
}

function liveFileSlug(slug) {
  return slug.replace(/\//g, "-");
}

function lessonContentFile(slug) {
  if (slug.includes("/")) {
    return path.join(CONTENT_OUT, ...slug.split("/")) + ".ts";
  }
  return path.join(CONTENT_OUT, `${slug}.ts`);
}

function lessonImportPath(slug) {
  if (slug.includes("/")) {
    return `@/content/lessons/${slug.split("/").join("/")}`;
  }
  return `@/content/lessons/${slug}`;
}

function exportName(slug) {
  const camel = slug
    .replace(/\//g, "_")
    .replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
  const ident = camel.replace(/[^a-zA-Z0-9]/g, "");
  if (/^[0-9]/.test(ident)) return `lesson${ident}`;
  return `${ident}Lesson`;
}

function pageComponentName(slug) {
  const camel = slug
    .replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");
  const ident = camel.charAt(0).toUpperCase() + camel.slice(1);
  if (/^[0-9]/.test(ident)) return `Page${ident}`;
  return `${ident}Page`;
}

function writeLesson(slug, meta, blocks, pid) {
  const name = exportName(slug);
  const firstP = blocks.find((b) => b.t === "p");
  const description = firstP
    ? textOf(firstP.html).slice(0, 160)
    : meta.title;
  const ts = `import type { ArticleBlock, ProseDoc } from "@/content/tilda-dynamic";

/** Контент с живой Тильды kochfit.ru/${slug} (page${pid}), без хрома шапки/подвала. */
const blocks: ArticleBlock[] = ${JSON.stringify(blocks, null, 2)};

export const ${name} = {
  path: ${JSON.stringify(slug)},
  slug: ${JSON.stringify(slug.split("/").pop() ?? slug)},
  title: ${JSON.stringify(meta.title)},
  description: ${JSON.stringify(description)},
  paragraphs: [],
  blocks,
  lesson: true,
} satisfies ProseDoc;
`;
  const contentFile = lessonContentFile(slug);
  fs.mkdirSync(path.dirname(contentFile), { recursive: true });
  fs.writeFileSync(contentFile, ts);

  if (meta.contentOnly) return { name, slug };

  const importPath = lessonImportPath(slug);
  const comp = pageComponentName(slug);
  const page = `import type { Metadata } from "next";
import { LessonPage } from "@/components/site/LessonPage";
import { ${name} } from "${importPath}";

export const metadata: Metadata = {
  title: ${name}.title,
  description: ${name}.description,
  openGraph: {
    url: "/${slug}",
    title: ${name}.title,
    description: ${name}.description,
  },
};

/** /${slug} — «${meta.title}» (live kochfit.ru/${slug}, Tilda page${pid}) */
export default function ${comp}() {
  return <LessonPage doc={${name}} />;
}
`;
  const dir = path.join(ROOT, "src/app", ...slug.split("/"));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "page.tsx"), page);
  return { name, slug };
}

function writeBlogIndex(blogEntries) {
  if (!blogEntries.length) return;
  const dir = path.join(CONTENT_OUT, "blog");
  fs.mkdirSync(dir, { recursive: true });
  const imports = blogEntries
    .map(({ id, name }) => `import { ${name} } from "./${id}";`)
    .join("\n");
  const entries = blogEntries
    .map(({ id, name }) => `  "${id}": ${name},`)
    .join("\n");
  const ts = `import type { ProseDoc } from "@/content/tilda-dynamic";
${imports}

/** Уроки блога, перенесённые с live kochfit.ru/blog/N */
export const blogLessons: Record<string, ProseDoc> = {
${entries}
};

export function getBlogLesson(id: string): ProseDoc | null {
  return blogLessons[id] ?? null;
}

export function getBlogLessonIds(): string[] {
  return Object.keys(blogLessons);
}
`;
  fs.writeFileSync(path.join(dir, "index.ts"), ts);
}

function loadHtml(slug, pid) {
  const live = path.join(LIVE_DIR, `${liveFileSlug(slug)}.html`);
  if (fs.existsSync(live)) {
    const html = fs.readFileSync(live, "utf-8");
    if (html.length > 5000 && !html.includes("<h1>403</h1>") && !html.includes("403 Forbidden")) {
      return html;
    }
  }
  const body = path.join(OLD, "files", `page${pid}body.html`);
  const full = path.join(OLD, `page${pid}.html`);
  if (fs.existsSync(body)) return fs.readFileSync(body, "utf-8");
  if (fs.existsSync(full)) return fs.readFileSync(full, "utf-8");
  return null;
}

function parsePage(slug, meta) {
  const html = loadHtml(slug, meta.pid);
  if (!html) {
    console.warn(`${slug}: нет HTML page${meta.pid}`);
    return null;
  }
  const body = splitBody(html);
  const recs = recsOf(body);
  const popups = popupMap(recs);
  const ctx = { imgN: 0, missing: [] };
  const blocks = [];
  const seenVideo = new Set();
  let pageTitle = meta.title;

  const titleRec = recs.find((r) => r.type === "795" && !isChromeSeg(r.html, r.type));
  if (titleRec) {
    const f = fieldsOf(titleRec.html).find((x) => x.field === "title");
    if (f) {
      const t = textOf(f.inner);
      if (t) pageTitle = t;
    }
  }

  for (const rec of recs) {
    if (isChromeSeg(rec.html, rec.type)) continue;
    if (rec.type === "396") {
      parseZero(rec.html, slug, pageTitle, popups, ctx, blocks, seenVideo);
      continue;
    }
    parseStandard(rec, slug, pageTitle, ctx, blocks, seenVideo, popups);
  }

  const cleaned = postProcess(blocks, pageTitle);
  return { title: pageTitle, blocks: cleaned, ctx };
}

// ── main ──
fs.mkdirSync(CONTENT_OUT, { recursive: true });
const summary = [];
const blogEntries = [];

for (const [slug, meta] of Object.entries(PAGES)) {
  if (ONLY && !ONLY.has(slug)) continue;
  if (KEEP_HAND.has(slug)) {
    console.log(`${slug}: пропуск (ручная вёрстка)`);
    summary.push({ slug, title: meta.title, kept: true });
    continue;
  }
  const parsed = parsePage(slug, meta);
  if (!parsed) continue;
  const { title, blocks, ctx } = parsed;
  const chars = blocks
    .map((b) =>
      b.t === "p"
        ? textOf(b.html)
        : b.t === "h2"
          ? b.text
          : b.t === "list"
            ? b.items.map(textOf).join(" ")
            : "",
    )
    .join(" ").length;
  const imgs = blocks.reduce(
    (n, b) => n + (b.t === "img" ? 1 : b.t === "gallery" ? b.images.length : 0),
    0,
  );
  const kine = blocks.reduce(
    (n, b) =>
      n + (b.t === "kinescope" ? 1 : b.t === "kinescopeGallery" ? b.srcs.length : 0),
    0,
  );
  console.log(
    `${slug}: ${blocks.length} блоков, ~${chars} зн., ${imgs} картинок, ${kine} kinescope` +
      (ctx.missing.length ? ` (нет файлов: ${ctx.missing.length})` : ""),
  );
  if (DEBUG) {
    for (const b of blocks) {
      const brief =
        b.t === "p"
          ? textOf(b.html).slice(0, 90)
          : b.t === "h2"
            ? `# ${b.text}`
            : b.t === "list"
              ? `list(${b.ordered ? "ol" : "ul"}) ×${b.items.length}: ${textOf(b.items[0] ?? "").slice(0, 60)}`
              : b.t === "img"
                ? `img ${b.src}`
                : b.t === "gallery"
                  ? `gallery ×${b.images.length}`
                  : b.t === "kinescope"
                    ? `kine ${b.src.slice(-20)}`
                    : b.t === "kinescopeGallery"
                      ? `kineGallery ×${b.srcs.length}`
                      : b.t === "cta"
                        ? `cta ${b.href} «${b.label}»`
                        : b.t === "video"
                          ? `yt ${b.id}`
                          : JSON.stringify(b).slice(0, 80);
      console.log(`   [${b.t}] ${brief}`);
    }
  } else {
    const written = writeLesson(slug, { ...meta, title }, blocks, meta.pid);
    if (meta.contentOnly && written) {
      const id = slug.split("/").pop();
      blogEntries.push({ id, name: written.name });
    }
  }
  summary.push({ slug, title, blocks: blocks.length, chars, imgs, kine });
}

if (!DEBUG && blogEntries.length) {
  writeBlogIndex(blogEntries);
  console.log(`blog/index.ts: ${blogEntries.length} уроков`);
}

if (!DEBUG) {
  const proseFile = path.join(ROOT, "src/content/migrated/prose-pages.json");
  if (fs.existsSync(proseFile)) {
    const prose = JSON.parse(fs.readFileSync(proseFile, "utf-8"));
    let removed = 0;
    for (const slug of Object.keys(PAGES)) {
      if (ONLY && !ONLY.has(slug)) continue;
      if (prose[slug]) {
        delete prose[slug];
        removed += 1;
      }
    }
    if (prose.stlk) {
      delete prose.stlk;
      removed += 1;
    }
    if (prose.mpod) {
      delete prose.mpod;
      removed += 1;
    }
    if (prose.tmtd) {
      delete prose.tmtd;
      removed += 1;
    }
    fs.writeFileSync(proseFile, JSON.stringify(prose, null, 1) + "\n");
    console.log(`prose-pages.json: убрано ${removed} ключей (dedicated routes)`);
  }
}

console.log("готово", summary.length, "страниц");
