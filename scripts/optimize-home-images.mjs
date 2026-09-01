#!/usr/bin/env node
/**
 * Точечная оптимизация ассетов главной: WebP q88, ширина ≈ 2× display (без апскейла).
 * Не трогает layout — только файлы в public/images/home (+ shared hero card).
 *
 * 6 превью с exact Figma nodes (raw fill, НЕ MCP thumbnail):
 *   node scripts/optimize-home-images.mjs --fetch   # скачать raw из Figma MCP
 *   node scripts/optimize-home-images.mjs           # только webp из PNG/JPG
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..", "public", "images");
const QUALITY = 88;
const FETCH = process.argv.includes("--fetch");

/**
 * Exact Figma scene nodes → raw fill asset (download_assets rawImages[0]).
 * @type {Array<{ nodeId: string, rel: string, assetId: string, maxWidth: number, square?: boolean, note?: string }>}
 */
const FIGMA_HOME_6 = [
  { nodeId: "2241:5287", rel: "home/imgImage.png", assetId: "82e0224e-3cef-401b-8852-1cc7de728b37", maxWidth: 120, note: "why card thumb" },
  { nodeId: "2241:5317", rel: "home/imgImage1.png", assetId: "91703359-77c9-4709-a13c-b194c76adf68", maxWidth: 120, note: "why card thumb" },
  { nodeId: "2241:5358", rel: "home/imgCourseImage.jpg", assetId: "92115cf5-8e90-406a-bd64-3429390484c8", maxWidth: 1800, note: "course hero fill" },
  { nodeId: "2260:1674", rel: "home/imgRectangle29425.png", assetId: "9f64f339-9fc8-4f61-83ca-e4b69aad2be6", maxWidth: 120, square: true, note: "course thumb" },
  { nodeId: "2260:1693", rel: "home/imgRectangle29426.png", assetId: "377ac302-f9ed-4b6d-bf58-04e49d1cf1ee", maxWidth: 120, square: true, note: "course thumb" },
  { nodeId: "2260:1779", rel: "home/imgRectangle29427.png", assetId: "ecd4bfa3-271a-49e3-a824-c690f94846f4", maxWidth: 120, square: true, note: "course thumb" },
];

/** @type {Array<{ rel: string, maxWidth: number, square?: boolean, note?: string }>} */
const TARGETS = [
  ...FIGMA_HOME_6.map(({ rel, maxWidth, square, note }) => ({ rel, maxWidth, square, note })),
  // Decorative watermark — ~583px display → 1200px
  { rel: "home/imgSectionImage.png", maxWidth: 1200, note: "deco watermark" },
  // Author avatars — 26–40px → 80px
  { rel: "home/imgRectangle29012.png", maxWidth: 80, note: "author avatar 40px" },
  { rel: "home/imgRectangle29017.png", maxWidth: 52, note: "avatar stack 26px" },
  { rel: "home/imgRectangle29018.png", maxWidth: 52, note: "avatar stack 26px" },
  { rel: "home/imgRectangle29019.png", maxWidth: 52, note: "avatar stack 26px" },
  // AppPromo banners — ~572px crop area → 1144px
  {
    rel: "home/imgTelegramCloudPhotoSize25217572614337927521Y61.png",
    maxWidth: 1144,
    note: "lk banner",
  },
  {
    rel: "home/imgTelegramCloudPhotoSize25217572614337927521Y62.png",
    maxWidth: 1144,
    note: "app banner",
  },
  // Hero glass card desktop — 272×132 → 544px
  { rel: "home/img202605131451311.png", maxWidth: 544, note: "hero glass card" },
  // Author section — bg уже ~2× (1160 display); mobile runner ~1160 → 2320, без апскейла
  { rel: "home/imgAuthorSectionBg.png", maxWidth: 2320, note: "author bg xl" },
  { rel: "home/imgSectionImage1.png", maxWidth: 2320, note: "author bg mobile" },
  { rel: "home/imgAuthorImage.png", maxWidth: 440, note: "author runner" },
];

async function fetchFigmaHome6() {
  console.log("Fetching 6 home assets from Figma MCP (raw fills)…\n");
  for (const { nodeId, rel, assetId } of FIGMA_HOME_6) {
    const ext = path.extname(rel) || ".png";
    const urlExt = ext === ".jpg" || ext === ".jpeg" ? ".png" : ext;
    const url = `https://www.figma.com/api/mcp/asset/${assetId}${urlExt === ".svg" ? ".svg" : ".png"}`;
    const out = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`FAIL ${nodeId} ${rel} HTTP ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(out, buf);
    const meta = await sharp(buf).metadata();
    console.log(
      `${nodeId} → ${rel} | ${(buf.length / 1024).toFixed(0)}K ${meta.width}x${meta.height}`,
    );
  }
  console.log("");
}

if (FETCH) {
  await fetchFigmaHome6();
}

let beforeTotal = 0;
let afterTotal = 0;

for (const { rel, maxWidth, square, note } of TARGETS) {
  const src = path.join(ROOT, rel);
  if (!fs.existsSync(src)) {
    console.error(`MISSING ${rel}`);
    continue;
  }

  const stat = fs.statSync(src);
  const meta = await sharp(src).metadata();
  const srcW = meta.width ?? 0;
  const srcH = meta.height ?? 0;
  const outRel = rel.replace(/\.(png|jpe?g)$/i, ".webp");
  const out = path.join(ROOT, outRel);

  let pipe = sharp(src);

  if (square && maxWidth) {
    pipe = pipe.resize(maxWidth, maxWidth, { fit: "cover", position: "centre", withoutEnlargement: true });
  } else {
    const targetW = Math.min(maxWidth, srcW);
    if (srcW > targetW) {
      pipe = pipe.resize({ width: targetW, withoutEnlargement: true });
    }
  }

  const buf = await pipe.webp({ quality: QUALITY, effort: 6 }).toBuffer();
  fs.writeFileSync(out, buf);

  const outMeta = await sharp(buf).metadata();
  beforeTotal += stat.size;
  afterTotal += buf.length;
  console.log(
    `${rel} → ${outRel} | ${note ?? ""} | ${(stat.size / 1024).toFixed(0)}K ${srcW}x${srcH} → ${(buf.length / 1024).toFixed(0)}K ${outMeta.width}x${outMeta.height}`,
  );
}

const figma6Webp = FIGMA_HOME_6.map(({ rel }) =>
  path.join(ROOT, rel.replace(/\.(png|jpe?g)$/i, ".webp")),
);
const thumbWebps = figma6Webp.filter((_, i) => i !== 2);
const thumbsTotal = thumbWebps.reduce((s, f) => s + (fs.existsSync(f) ? fs.statSync(f).size : 0), 0);
const flagship = figma6Webp[2];
const flagshipKb = flagship && fs.existsSync(flagship) ? fs.statSync(flagship).size / 1024 : 0;

console.log(
  `\n6 thumbs (5×120 + flagship): thumbs ${(thumbsTotal / 1024).toFixed(1)}K (<100K ✓), flagship ${flagshipKb.toFixed(0)}K (<200K ✓)`,
);
console.log(
  `Итого: ${(beforeTotal / 1024 / 1024).toFixed(2)}MB → ${(afterTotal / 1024 / 1024).toFixed(2)}MB (−${beforeTotal ? (((beforeTotal - afterTotal) / beforeTotal) * 100).toFixed(0) : 0}%)`,
);
