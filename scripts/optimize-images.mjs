#!/usr/bin/env node
/**
 * Оптимизация PNG/JPEG в public/images (in-place), политика «качество в приоритете»:
 * - апскейла нет никогда; даунскейл только если ширина > 2600px;
 * - JPEG → mozjpeg q90;
 * - PNG → обычный deflate (compressionLevel 9), БЕЗ палитрового сжатия
 *   (palette:true мылит фотографии); если результат не меньше 95% исходника —
 *   файл остаётся как есть;
 * - SVG и прочие форматы не трогаем (обходим только png/jpe?g).
 * Файлы меньше порога не трогаем. Отчёт — в stdout.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = "public/images";
const MIN_BYTES = 150 * 1024;
const MAX_WIDTH = 2600;
const JPEG_QUALITY = 90;

/**
 * Hero/LCP-картинки: НЕ пережимать.
 * Hero-фоны курсов апскейлены Real-ESRGAN до 2800px и лежат в .webp —
 * скрипт webp не трогает (regex ниже), но пути перечислены для ясности.
 * PNG-версии оставлены для OG-метаданных страниц.
 */
const SKIP = new Set(
  [
    "beauty-health/img54.png",
    "beauty-health/img54.webp",
    "beauty-health/imgImage1.png",
    "beauty-health/imgImage2.png",
    "beauty-health/imgImage3.png",
    "beauty-health/imgImage4.png",
    "beauty-health/imgImage5.png",
    "beauty-health/imgImage8.png",
    "beauty-health/imgImage9.png",
    "beauty-health/imgImage11.png",
    "beauty-health/imgIPhone15Pro.png",
    "beauty-health/imgIPhone16Pro.png",
    "beauty-health/imgChangeThis1.png",
    "beauty-health/imgShadow.png",
    "pelvic-floor/img8892.png",
    "pelvic-floor/img8892.webp",
    "pelvic-floor/imgImage.png",
    "pelvic-floor/imgImage1.png",
    "pelvic-floor/imgImage2.png",
    "pelvic-floor/imgIndicatorImage.png",
    "pelvic-floor/imgIndicatorImage1.png",
    "pelvic-floor/imgChangeThis1.png",
    "pelvic-floor/imgShadow.png",
    "postpartum/imgChatGptImage2420261720451.png",
    "postpartum/imgChatGptImage2420261720451.webp",
    "postpartum/imgHf20260520113803Accb8Bac783540Ad9B063Eae4D01114F1.png",
    "pregnancy/imgChatGptImage2420261720451.png",
    "pregnancy/imgChatGptImage2420261720451.webp",
    "pregnancy/imgImage2398.png",
    "pregnancy/imgImage2398.webp",
    "pregnancy/imgImage.png",
    "pregnancy/imgImage1.png",
    "pregnancy/imgImage2.png",
    "pregnancy/imgChangeThis1.png",
    "pregnancy/imgShadow.png",
    "shared/hero-bg.webp",
    // Главная: hi-res PNG-оригиналы (на сайте — .webp из optimize-home-images.mjs)
    "home/imgImage.webp",
    "home/imgImage1.webp",
    "home/imgRectangle29425.webp",
    "home/imgRectangle29426.webp",
    "home/imgRectangle29427.webp",
    "home/imgCourseImage.webp",
    "home/imgSectionImage.webp",
    "home/imgRectangle29012.webp",
    "home/imgRectangle29017.webp",
    "home/imgRectangle29018.webp",
    "home/imgRectangle29019.webp",
    "home/imgTelegramCloudPhotoSize25217572614337927521Y61.webp",
    "home/imgTelegramCloudPhotoSize25217572614337927521Y62.webp",
    "home/img202605131451311.webp",
    "home/imgAuthorSectionBg.webp",
    "home/imgSectionImage1.webp",
    "home/imgAuthorImage.webp",
    // Качество > вес: ключевые фото/отзывы/person не пережимать
    "pregnancy/imgTelegramCloudDocument251953956619142188471.jpg",
    "pregnancy/imgTelegramCloudDocument251953956619142200000.jpg",
    "pregnancy/imgTelegramCloudDocument251995135605935164511.jpg",
    "pregnancy/imgRectangle29012.jpg",
    "pregnancy/imgImg65731.jpg",
    "person/img_5958.jpg",
    "home/imgImage.png",
    "home/imgImage1.png",
    // Курсы Kochfit: hi-res fills, качество > вес
    "home/imgCourseImage.jpg",
    "home/imgCourseImage.png",
    "home/imgRectangle29425.png",
    "home/imgRectangle29426.png",
    "home/imgRectangle29427.png",
    "postpartum/imgHeroImage1.png",
    "postpartum/imgBannerImage.png",
    "postpartum/imgBannerImage1.png",
    "postpartum/imgBannerImage2.png",
    "postpartum/imgBannerImage3.png",
    "postpartum/imgBannerImage4.png",
    "postpartum/imgBannerImage5.png",
    "postpartum/imgBannerImage6.png",
    "postpartum/imgBannerImage7.png",
    "postpartum/imgImage.png",
    "postpartum/imgImage1.png",
    "postpartum/imgImage2.png",
    "postpartum/imgChangeThis1.png",
    "postpartum/imgShadow.png",
    "home/imgAuthorSectionBg.png",
    "home/imgAuthorImage.png",
    "home/imgSectionImage1.png",
    "home/imgSectionImage.png",
    "home/imgRectangle29012.png",
    "home/imgRectangle29017.png",
    "home/imgRectangle29018.png",
    "home/imgRectangle29019.png",
    "home/imgTelegramCloudPhotoSize25217572614337927521Y61.png",
    "home/imgTelegramCloudPhotoSize25217572614337927521Y62.png",
    "home/img202605131451311.png",
    "home/imgChangeThis1.png",
    "home/imgShadow.png",
    "articles/st6/1.jpg",
    "articles/st10/9_3.jpg",
  ].map((p) => path.join(ROOT, p)),
);

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(png|jpe?g)$/i.test(e.name)) files.push(p);
  }
})(ROOT);

let before = 0;
let after = 0;
let touched = 0;

for (const file of files) {
  if (SKIP.has(file)) continue;
  const stat = fs.statSync(file);
  if (stat.size < MIN_BYTES) continue;

  const meta = await sharp(file).metadata();
  let pipe = sharp(file);
  if ((meta.width ?? 0) > MAX_WIDTH) {
    pipe = pipe.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  const isPng = /\.png$/i.test(file);
  const buf = isPng
    ? await pipe.png({ compressionLevel: 9 }).toBuffer()
    : await pipe.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();

  // Записываем только если реально стало меньше (< 95% исходника),
  // иначе оставляем оригинал нетронутым.
  if (buf.length < stat.size * 0.95) {
    fs.writeFileSync(file, buf);
    before += stat.size;
    after += buf.length;
    touched++;
    console.log(
      `${file}: ${(stat.size / 1024).toFixed(0)}K → ${(buf.length / 1024).toFixed(0)}K`,
    );
  }
}

console.log(
  `\nИтого: ${touched} файлов, ${(before / 1024 / 1024).toFixed(1)}M → ${(after / 1024 / 1024).toFixed(1)}M`,
);
