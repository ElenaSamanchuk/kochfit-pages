#!/usr/bin/env node
/**
 * Перенос статей блога /st1–/st14 из архива Тильды (old-site/files/page*body.html)
 * в src/content/migrated/prose-pages.json (поле blocks) + копирование картинок
 * в public/images/articles/<st>/.
 *
 * Запуск: node scripts/migrate-articles.mjs [--debug]
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OLD = path.join(ROOT, "old-site");
const OUT_JSON = path.join(ROOT, "src/content/migrated/prose-pages.json");
const IMG_OUT = path.join(ROOT, "public/images/articles");
const DEBUG = process.argv.includes("--debug");

/** /stN → id старой страницы Тильды (docs/old-site-url-map.md) */
const PAGES = {
  st1: "39299812",
  st2: "39296761",
  st3: "39300223",
  st4: "39300725",
  st5: "39313889",
  st6: "39315774",
  st7: "39319012",
  st8: "39516644",
  st9: "39517326",
  st10: "39518947",
  st11: "39577576",
  st12: "39578305",
  st13: "39584258",
  st14: "39584711",
};

const CHROME_TYPES = new Set(["131", "270", "450", "702", "890"]);

function unescapeHtml(s) {
  return s
    .replace(/&nbsp;/g, "\u00a0")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** Инлайн-HTML → безопасный минимум: strong/em/br/a(href) */
function sanitizeInline(html) {
  let s = html;
  s = s.replace(/<\s*(b|strong)\b[^>]*>/gi, "<strong>");
  s = s.replace(/<\s*\/\s*(b|strong)\s*>/gi, "</strong>");
  s = s.replace(/<\s*(i|em)\b[^>]*>/gi, "<em>");
  s = s.replace(/<\s*\/\s*(i|em)\s*>/gi, "</em>");
  s = s.replace(/<\s*br\s*\/?\s*>/gi, "<br/>");
  s = s.replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi, (_, href) => {
    const external = /^(https?:)?\/\//.test(href) || /^(mailto|tel|tg):/.test(href);
    return external
      ? `<a href="${href}" target="_blank" rel="noopener noreferrer">`
      : `<a href="${href}">`;
  });
  // все прочие теги — убрать
  s = s.replace(/<(?!\/?(strong|em|br|a)\b)[^>]+>/gi, " ");
  s = s.replace(/[ \t]+/g, " ");
  s = s.replace(/ ?<br\/> ?/g, "<br/>");
  return s.trim().replace(/^(<br\/>)+|(<br\/>)+$/g, "");
}

function textOf(html) {
  return unescapeHtml(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** Разбить поле по <br/><br/> на абзацы; серии строк "1. …" → список */
function fieldToBlocks(rawHtml, headingLevel) {
  const inline = sanitizeInline(unescapeHtml(rawHtml));
  if (!inline) return [];
  if (headingLevel) {
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
    const isBul = (l) => /^[-–—•▪✔✓]\s*/.test(textOf(l));
    const listLines = lines.filter((l) => isNum(l) || isBul(l));
    if (lines.length >= 2 && listLines.length >= Math.max(2, lines.length - 1)) {
      const ordered = lines.filter(isNum).length >= lines.filter(isBul).length;
      const lead = [];
      const items = [];
      for (const l of lines) {
        if (isNum(l)) items.push(l.replace(/^\s*\d+[.)]\s*/, ""));
        else if (isBul(l)) items.push(l.replace(/^\s*[-–—•▪✔✓]\s*/, ""));
        else if (items.length === 0) lead.push(l);
        else items[items.length - 1] += "<br/>" + l;
      }
      if (lead.length) blocks.push({ t: "p", html: lead.join("<br/>") });
      if (items.length) blocks.push({ t: "list", ordered, items });
    } else {
      blocks.push({ t: "p", html: para });
    }
  }
  return blocks;
}

/** Скопировать картинку из old-site и вернуть новый public-путь */
function copyImage(rel, st) {
  const clean = rel.replace(/^\.?\//, "").split("?")[0];
  const srcPath = path.join(OLD, clean);
  if (!fs.existsSync(srcPath)) {
    console.warn(`  !! нет файла: ${clean}`);
    return null;
  }
  const base = path.basename(clean);
  // tild1234-...-__name.jpg → name.jpg (читаемое имя), коллизии — с префиксом
  const short = base.includes("__") ? base.slice(base.lastIndexOf("__") + 2) : base;
  const dir = path.join(IMG_OUT, st);
  fs.mkdirSync(dir, { recursive: true });
  let name = short || base;
  let target = path.join(dir, name);
  if (fs.existsSync(target)) {
    const cur = fs.readFileSync(target);
    if (!cur.equals(fs.readFileSync(srcPath))) {
      name = base;
      target = path.join(dir, name);
      if (!fs.existsSync(target)) fs.copyFileSync(srcPath, target);
    }
  } else {
    fs.copyFileSync(srcPath, target);
  }
  return `/images/articles/${st}/${name}`;
}

function parseArticle(st, pid, title) {
  const file = path.join(OLD, "files", `page${pid}body.html`);
  let src = fs.readFileSync(file, "utf-8");

  // записи в порядке документа
  const recs = [];
  const re = /<div id="(rec\d+)"[^>]*data-record-type="(\d+)"[^>]*>/g;
  let m;
  while ((m = re.exec(src))) recs.push({ id: m[1], type: m[2], start: m.index });
  const blocks = [];
  let titleSeen = false;

  for (let i = 0; i < recs.length; i++) {
    const { id, type, start } = recs[i];
    const end = i + 1 < recs.length ? recs[i + 1].start : src.length;
    let seg = src.slice(start, end);
    if (CHROME_TYPES.has(type)) continue;
    if (type === "396") {
      if (/position\s*:\s*fixed/.test(seg)) continue; // шапка / куки-бар
      if (/background-color\s*:\s*#3c3c42/.test(seg)) continue; // футер
    }
    seg = seg.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");

    if (type === "4") {
      // t121 — YouTube-видео
      const v = seg.match(/data-videolazy-type="youtube"[^>]*data-videolazy-id="([^"?&]+)/);
      if (v) blocks.push({ t: "video", kind: "youtube", id: v[1] });
      continue;
    }
    if (type === "604") {
      // слайдер-галерея
      const imgs = [];
      const seen = new Set();
      const ire = /(?:data-original|data-img-zoom-url|src)="([^"]*images\/[^"]+\.(?:jpe?g|png|webp|gif))"/g;
      let im;
      while ((im = ire.exec(seg))) {
        if (seen.has(im[1])) continue;
        seen.add(im[1]);
        const p = copyImage(im[1], st);
        if (p) imgs.push({ src: p, alt: title });
      }
      if (imgs.length) blocks.push({ t: "gallery", images: imgs });
      continue;
    }
    if (type === "3") {
      // t107 — картинка (+ подпись field="title")
      const im = seg.match(/(?:data-original|src)="([^"]*images\/[^"]+\.(?:jpe?g|png|webp|gif))"/);
      const cap = seg.match(/field="title"[^>]*>([\s\S]*?)<\/div>/);
      if (im) {
        const p = copyImage(im[1], st);
        const caption = cap ? textOf(cap[1]) : "";
        if (p) blocks.push({ t: "img", src: p, alt: caption || title, ...(caption ? { caption } : {}) });
      }
      continue;
    }
    if (type === "396") {
      // zero-block: tn-atom тексты + кнопки-ссылки
      const atomRe = /<(a|div)[^>]*class=['"][^'"]*tn-atom[^'"]*['"][^>]*>([\s\S]*?)<\/\1>/g;
      let am;
      while ((am = atomRe.exec(seg))) {
        const tag = am[1];
        const openTag = am[0].slice(0, am[0].indexOf(">") + 1);
        const inner = am[2];
        const text = textOf(inner);
        if (!text) continue;
        if (tag === "a") {
          const href = openTag.match(/href=['"]([^'"]+)['"]/);
          if (href) blocks.push({ t: "cta", href: href[1], label: text });
          continue;
        }
        if (!titleSeen && (text === title || title.startsWith(text) || text.startsWith(title.slice(0, 30)))) {
          titleSeen = true;
          continue; // заголовок страницы рендерим из meta
        }
        if (text.length < 90) blocks.push({ t: "h2", text });
        else blocks.push(...fieldToBlocks(inner));
      }
      continue;
    }
    // текстовые блоки (33=t017, 106=t004/t-text, 171=t157 и т.п.)
    const fieldRe = /<div[^>]*\bfield="(uptitle|title|descr|text)"[^>]*>([\s\S]*?)<\/div>/g;
    let fm;
    while ((fm = fieldRe.exec(seg))) {
      const [, field, inner] = fm;
      const heading = field === "uptitle" || field === "title";
      const text = textOf(inner);
      if (!text) continue;
      if (heading && text.length < 120) blocks.push({ t: "h2", text });
      else blocks.push(...fieldToBlocks(inner));
    }
  }
  return postProcess(blocks);
}

function postProcess(blocks) {
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    // рубрика «Статья» — шум навигации Тильды
    if (b.t === "h2" && /^статья$/i.test(b.text.trim())) continue;
    // заголовок, дословно повторяющийся в начале следующего абзаца
    if (b.t === "h2") {
      const next = blocks[i + 1];
      if (next?.t === "p" && textOf(next.html).startsWith(b.text.slice(0, 40))) continue;
    }
    // внутренние ссылки kochfit.ru → относительные
    if (b.t === "cta" && /^https?:\/\/(www\.)?kochfit\.ru\//.test(b.href)) {
      b.href = b.href.replace(/^https?:\/\/(www\.)?kochfit\.ru/, "");
    }
    out.push(b);
  }
  return out;
}

// ── main ──
const prose = JSON.parse(fs.readFileSync(OUT_JSON, "utf-8"));
let totalChars = 0;
let totalImgs = 0;
for (const [st, pid] of Object.entries(PAGES)) {
  const doc = prose[st];
  if (!doc) {
    console.warn(`нет записи ${st} в prose-pages.json`);
    continue;
  }
  const blocks = parseArticle(st, pid, doc.title);
  const chars = blocks
    .map((b) => (b.t === "p" ? textOf(b.html) : b.t === "h2" ? b.text : b.t === "list" ? b.items.map(textOf).join(" ") : ""))
    .join(" ").length;
  const imgs = blocks.reduce(
    (n, b) => n + (b.t === "img" ? 1 : b.t === "gallery" ? b.images.length : 0),
    0,
  );
  totalChars += chars;
  totalImgs += imgs;
  console.log(`${st}: ${blocks.length} блоков, ~${chars} зн., ${imgs} картинок`);
  if (DEBUG) {
    for (const b of blocks) {
      const brief =
        b.t === "p" ? textOf(b.html).slice(0, 90)
        : b.t === "h2" ? `# ${b.text}`
        : b.t === "list" ? `list(${b.ordered ? "ol" : "ul"}) ×${b.items.length}: ${textOf(b.items[0]).slice(0, 60)}`
        : b.t === "img" ? `img ${b.src}${b.caption ? ` (${b.caption.slice(0, 40)})` : ""}`
        : b.t === "gallery" ? `gallery ×${b.images.length}`
        : b.t === "video" ? `video youtube ${b.id}`
        : b.t === "cta" ? `cta ${b.href} «${b.label}»`
        : JSON.stringify(b).slice(0, 80);
      console.log(`   [${b.t}] ${brief}`);
    }
  }
  if (!DEBUG) {
    delete doc.lesson;
    delete doc.stub;
    doc.blocks = blocks;
    // description — первый содержательный абзац
    const firstP = blocks.find((b) => b.t === "p");
    if (firstP) doc.description = textOf(firstP.html).slice(0, 160);
    doc.paragraphs = [];
  }
}
console.log(`итого: ~${totalChars} зн., ${totalImgs} картинок`);
if (!DEBUG) {
  fs.writeFileSync(OUT_JSON, JSON.stringify(prose, null, 1) + "\n");
  console.log("prose-pages.json обновлён");
}
