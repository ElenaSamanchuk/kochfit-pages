#!/usr/bin/env node
/**
 * Перенос страницы «Результаты участниц» (/result) из архива Тильды
 * (old-site/files/page32645944body.html):
 * 13 участниц — курс, имя, короткая цитата, фото «до/после», полная история.
 * Выход: src/content/migrated/results.json + public/images/results/.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "old-site/files/page32645944body.html");
const OUT = path.join(ROOT, "src/content/migrated/results.json");
const IMG_OUT = path.join(ROOT, "public/images/results");

const CARD_RECS = [
  "rec788367904",
  "rec788367928",
  "rec788367929",
  "rec788367930",
  "rec788367931",
  "rec788371568",
  "rec788367934",
];
// декоративные иконки-стрелки в карточках — не фото участниц
const DECOR = ["2ff5c605", "4163be4f"];

let src = fs.readFileSync(SRC, "utf-8");

function unesc(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
function textOf(html) {
  return unesc(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}
function recSegment(id) {
  const m = src.match(new RegExp(`<div id="${id}"[\\s\\S]*?(?=<div id="rec\\d)`));
  return m ? m[0].replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "") : "";
}
function copyImage(rel) {
  const clean = rel.replace(/^\.?\//, "").split("?")[0];
  const from = path.join(ROOT, "old-site", clean);
  if (!fs.existsSync(from)) {
    console.warn(`!! нет файла ${clean}`);
    return null;
  }
  const base = path.basename(clean);
  const short = base.includes("__") ? base.slice(base.lastIndexOf("__") + 2) : base;
  fs.mkdirSync(IMG_OUT, { recursive: true });
  fs.copyFileSync(from, path.join(IMG_OUT, short));
  return `/images/results/${short}`;
}

// ── карточки: курс, имя, цитата, фото, якорь попапа ──
const participants = [];
for (const rid of CARD_RECS) {
  const seg = recSegment(rid);
  // фото участниц — крупные bg-картинки, кроме декора
  const photos = [];
  for (const m of seg.matchAll(/background-image\s*:\s*url\(['"]?([^'")]+)['"]?\)/g)) {
    const url = m[1];
    if (!/images\//.test(url)) continue;
    if (DECOR.some((d) => url.includes(d))) continue;
    if (!photos.includes(url)) photos.push(url);
  }
  // участницы в порядке DOM: course → (#resultN) → name → quote
  const atoms = [];
  for (const am of seg.matchAll(
    /<(a|div)[^>]*class=['"][^'"]*tn-atom[^'"]*['"][^>]*>([\s\S]*?)<\/\1>/g,
  )) {
    const openTag = am[0].slice(0, am[0].indexOf(">") + 1);
    const href = openTag.match(/href=['"](#result\d+)['"]/)?.[1] ?? null;
    const text = textOf(am[2]);
    atoms.push({ href, text });
  }
  let cur = null;
  let idx = 0;
  for (const a of atoms) {
    if (/^[“"«]?(Красота и здоровье|Восстановление после родов)/.test(a.text)) {
      if (cur) participants.push(cur);
      cur = {
        course: a.text.replace(/[“”"«»]/g, "").trim(),
        photo: photos[idx] ?? null,
        anchor: null,
        name: "",
        quote: "",
      };
      idx += 1;
      continue;
    }
    if (!cur) continue;
    if (a.href) {
      cur.anchor = cur.anchor ?? a.href;
      continue;
    }
    if (!a.text) continue;
    if (!cur.name && a.text.length < 40 && !/[.!?]$/.test(a.text)) {
      cur.name = a.text;
      continue;
    }
    if (a.text.length > cur.quote.length && a.text.length > 40) cur.quote = a.text;
  }
  if (cur) participants.push(cur);
}

// ── попапы: полные истории по якорю ──
const stories = {};
for (const m of src.matchAll(/data-tooltip-hook="(#result\d+)"/g)) {
  const hook = m[1];
  const tail = src.slice(m.index, m.index + 40000);
  const title = tail.match(/t390__title[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
  const descr = tail.match(/t390__descr[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
  // <li> → абзацы-пункты; иначе сплит по <br>
  let paras;
  const lis = [...descr.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((x) => textOf(x[1]));
  if (lis.length) paras = lis;
  else
    paras = descr
      .split(/<br\s*\/?>/i)
      .map(textOf)
      .filter(Boolean);
  stories[hook] = { name: textOf(title), paragraphs: paras };
}

// ── сборка ──
const out = participants.map((p) => {
  const story = stories[p.anchor] ?? { name: "", paragraphs: [] };
  if (story.name && p.name && story.name !== p.name) {
    console.warn(`имя не совпало: карточка «${p.name}» vs попап «${story.name}» (${p.anchor})`);
  }
  const cleanQuote = p.quote.replace(/^[“"«\s]+|[”"»\s]+$/g, "");
  return {
    name: p.name || story.name,
    course: p.course,
    quote: cleanQuote,
    photo: p.photo ? copyImage(p.photo) : null,
    story: story.paragraphs,
  };
});

console.log(`участниц: ${out.length}`);
for (const p of out) {
  console.log(
    `- ${p.name} | ${p.course} | фото: ${p.photo ? "да" : "НЕТ"} | история: ${p.story.length} абз. | цитата: ${p.quote.slice(0, 50)}…`,
  );
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
console.log("results.json записан");
