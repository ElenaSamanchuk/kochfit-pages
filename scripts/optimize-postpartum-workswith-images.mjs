#!/usr/bin/env node
/**
 * «С чем работает курс» thumbs, Figma 2042:9225 / 9239 / 9248.
 * Native webp (без resize), один srcset-кандидат, sizes = ширина файла —
 * как мостик InsideCourse: 1440@dpr2 не может взять 80px/31КБ thumb.
 *
 *   node scripts/optimize-postpartum-workswith-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..", "public", "images");

/** @type {Array<{ src: string, out: string, note: string }>} */
const TASKS = [
  {
    src: "postpartum/imgImage.png",
    out: "postpartum/imgImage-956.webp",
    note: "тазовое дно 2042:9225, raw 956w q98",
  },
  {
    src: "postpartum/imgImage1.png",
    out: "postpartum/imgImage1-1200.webp",
    note: "рубцы 2042:9239, raw 1200w q98",
  },
  {
    src: "postpartum/imgImage2.png",
    out: "postpartum/imgImage2-1680.webp",
    note: "спина 2042:9248, raw 1680w q98",
  },
];

for (const task of TASKS) {
  const src = path.join(ROOT, task.src);
  const buf = await sharp(src)
    .webp({ quality: 98, alphaQuality: 100, effort: 6 })
    .toBuffer();
  const out = path.join(ROOT, task.out);
  fs.writeFileSync(out, buf);
  const inMeta = await sharp(src).metadata();
  const outMeta = await sharp(buf).metadata();
  console.log(
    `${task.src} → ${task.out}  ` +
      `${inMeta.width}x${inMeta.height} ${(fs.statSync(src).size / 1024).toFixed(0)}K → ` +
      `${outMeta.width}x${outMeta.height} ${(buf.length / 1024).toFixed(1)}K  | ${task.note}`,
  );
}
