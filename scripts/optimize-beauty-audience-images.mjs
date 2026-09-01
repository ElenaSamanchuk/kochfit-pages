#!/usr/bin/env node
/**
 * Превью карточек «Кому подойдет курс» (AudienceSection, Figma 2031:2314).
 *
 * Hi-res PNG из Figma — 1700–2500px в квадрате 80×80 CSS. Браузерный
 * object-cover с коэффициентом 4–21× мылит силуэт на белом. Готовим квадратный
 * .webp 240×240 (80 × dpr 3, ~1.5× на dpr 2): cover-кроп в sharp (Lanczos3),
 * лёгкий unsharp, lossless WebP (без 4:2:0 на белом фоне). object-position запечён в файл.
 *
 *   node scripts/optimize-beauty-audience-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..", "public", "images");
const SIZE = 240;

/** @type {Array<{ nodeId: string, rel: string, note: string, posY: number }>} */
const TARGETS = [
  { nodeId: "2031:2325", rel: "beauty-health/imgImage3.png", note: "осанка и мышцы", posY: 50 },
  { nodeId: "2031:2334", rel: "beauty-health/imgImage4.png", note: "чувствовать тело", posY: 50 },
  { nodeId: "2031:2346", rel: "beauty-health/imgImage5.png", note: "без перегруза", posY: 8 },
];

for (const { nodeId, rel, note, posY } of TARGETS) {
  const src = path.join(ROOT, rel);
  if (!fs.existsSync(src)) {
    console.error(`MISSING ${rel}`);
    continue;
  }

  const stat = fs.statSync(src);
  const meta = await sharp(src).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const side = Math.min(width, height);
  const left = Math.round((width - side) / 2);
  const top = Math.round((height - side) * (posY / 100));
  const outRel = rel.replace(/\.(png|jpe?g)$/i, ".webp");
  const out = path.join(ROOT, outRel);

  const buf = await sharp(src)
    .extract({ left, top, width: side, height: side })
    .resize(SIZE, SIZE, { kernel: "lanczos3" })
    .sharpen({ sigma: 1.0, m1: 0.8, m2: 2.2 })
    .webp({
      lossless: true,
      effort: 6,
    })
    .toBuffer();
  fs.writeFileSync(out, buf);

  const outMeta = await sharp(buf).metadata();
  console.log(
    `${nodeId} ${rel} → ${outRel} | ${note} | ` +
      `${(stat.size / 1024).toFixed(0)}K ${width}x${height} → ` +
      `${(buf.length / 1024).toFixed(1)}K ${outMeta.width}x${outMeta.height}`,
  );
}
