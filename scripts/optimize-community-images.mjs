#!/usr/bin/env node
/**
 * Растровые ассеты страницы /community + общие phone/footer-ассеты.
 *
 * Hi-res PNG-оригиналы из Figma (download-figma-hires-batch.mjs) в разы крупнее
 * размера отрисовки, поэтому браузер даунскейлит их в один проход — картинка
 * «мылит», а вес страницы держится на мегабайтах. Готовим .webp: Lanczos3 +
 * лёгкий unsharp, пропорции сохраняем, чтобы object-fit/object-position в
 * компонентах работали как раньше.
 *
 *   node scripts/optimize-community-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..", "public", "images");
const QUALITY = 95;

/**
 * width: целевая ширина; null — оставить исходное разрешение (меняем только формат).
 * widths: набор вариантов для srcSet.
 * sharpen: false — без unsharp (портрет/тело после Lanczos3, иначе каша).
 * @type {Array<{ src: string, out?: string, stem?: string, width?: number|null, widths?: number[], optional?: boolean, sharpen?: boolean, quality?: number, crop?: { left: number, top: number, width: number, height: number }, outputAspect?: number, cropAspect?: number, cropAnchor?: "right"|"center", note: string }>}
 */
const TASKS = [
  // ——— InsideCourse мостик, Figma 2031:2302 ———
  // Raw fill 2752×1536. Без даунскейла до 2000: один srcset-кандидат native,
  // sizes=2752px, чтобы 1440@dpr2 не взял 700/1100/1400.
  {
    src: "beauty-health/imgImage1.png",
    out: "beauty-health/imgImage1-2752.webp",
    width: null,
    quality: 98,
    sharpen: false,
    note: "мостик 2031:2302, raw 2752w q98 без resize",
  },

  // ——— TariffsSection, Figma 2031:2351 ———
  { src: "beauty-health/imgImage8.png", out: "beauty-health/imgImage8.webp", width: 320, note: "кураторы, миниатюра 80×80" },
  { src: "beauty-health/imgImage7.png", out: "beauty-health/imgImage7.webp", width: 160, note: "аватар чата 23×23" },
  // Исходник уже мельче отрисовки (853 CSS px), уменьшать нельзя — только формат.
  { src: "beauty-health/imgImage9.png", out: "beauty-health/imgImage9.webp", width: null, note: "декор-баннер подписки" },

  // ——— ReferralSection, Figma 2031:2414 ———
  { src: "beauty-health/imgImage10.png", stem: "beauty-health/imgImage10", widths: [1200, 2000], note: "фото реферальной программы" },

  // ——— Портрет автора, Figma 2031:2469 raw 4092×3069, scaleMode CROP ———
  // imageTransform [[sx,0,tx],[0,sy,ty]] = [[0.4828934371471405, 0, 0.5171065330505371],
  //   [0, 0.6965169310569763, 0.01617480255663395]]. Не cropAnchor right на всю высоту:
  // тот вырез сдвигал Юлию в кадр и ломал посадку относительно 1024×768 / макета.
  {
    src: "beauty-health/imgAuthorPortrait-4k.png",
    stem: "beauty-health/imgAuthorPortrait",
    crop: { left: 2116, top: 50, width: 1976, height: 2138 },
    outputAspect: 161 / 174,
    widths: [644, 966],
    sharpen: false,
    note: "Figma CROP 2031:2469 из 4k, 4×/6× бокса, q95",
  },

  // ——— Footer, Figma 442:11705 ———
  { src: "shared/footer/imgImage3.png", out: "shared/footer/imgImage3.webp", width: 160, note: "логотип NinetyNine 34×23" },
];

/*
 * PhoneMockup.tsx общий и берёт ассеты из папки своей страницы, поэтому .webp
 * нужен в каждой папке, где лежит PNG, иначе на других страницах будет 404.
 * Разрешение не меняем: коэффициент даунскейла у мокапа около 1, весь выигрыш — в формате.
 */
const PHONE_DIRS = ["beauty-health", "home", "pelvic-floor", "postpartum", "pregnancy", "subscription-popup"];
for (const dir of PHONE_DIRS) {
  for (const file of ["imgShadow.png", "imgChangeThis1.png"]) {
    TASKS.push({
      src: `${dir}/${file}`,
      out: `${dir}/${file.replace(/\.png$/, ".webp")}`,
      width: null,
      optional: true,
      note: "phone mockup",
    });
  }
}

const encode = async (src, width, { sharpen = true, crop, outputAspect, cropAspect, cropAnchor, srcMeta, quality = QUALITY } = {}) => {
  let pipe = sharp(src);
  if (crop) {
    const ratio = outputAspect ?? crop.height / crop.width;
    const height = Math.round(width / ratio);
    pipe = pipe.extract(crop).resize({ width, height, kernel: "lanczos3" });
  } else if (cropAspect && srcMeta?.width && srcMeta?.height) {
    const cropH = srcMeta.height;
    const cropW = Math.round(cropH * cropAspect);
    const left = cropAnchor === "right" ? Math.max(0, srcMeta.width - cropW) : Math.max(0, Math.round((srcMeta.width - cropW) / 2));
    const height = Math.round(width / cropAspect);
    pipe = pipe
      .extract({ left, top: 0, width: Math.min(cropW, srcMeta.width), height: cropH })
      .resize({ width, height, kernel: "lanczos3" });
  } else if (width) {
    pipe = pipe.resize({ width, fit: "inside", kernel: "lanczos3", withoutEnlargement: true });
    if (sharpen) pipe = pipe.sharpen({ sigma: 0.7, m1: 0.5, m2: 2 });
  }
  return pipe.webp({ quality, alphaQuality: 100, effort: 6 }).toBuffer();
};

let done = 0;
let skipped = 0;

for (const task of TASKS) {
  const src = path.join(ROOT, task.src);
  if (!fs.existsSync(src)) {
    if (!task.optional) console.error(`MISSING ${task.src}`);
    skipped++;
    continue;
  }
  const inSize = fs.statSync(src).size;
  const inMeta = await sharp(src).metadata();
  const outputs = task.widths
    ? task.widths.map((w) => ({ rel: `${task.stem}-${w}.webp`, width: w }))
    : [{ rel: task.out, width: task.width }];

  for (const { rel, width } of outputs) {
    const buf = await encode(src, width, {
      sharpen: task.sharpen !== false,
      crop: task.crop,
      outputAspect: task.outputAspect,
      cropAspect: task.cropAspect,
      cropAnchor: task.cropAnchor,
      srcMeta: inMeta,
      quality: task.quality,
    });
    fs.writeFileSync(path.join(ROOT, rel), buf);
    const meta = await sharp(buf).metadata();
    console.log(
      `${task.src.padEnd(38)} → ${rel.padEnd(40)} ` +
        `${inMeta.width}x${inMeta.height} ${(inSize / 1024).toFixed(0)}K → ` +
        `${meta.width}x${meta.height} ${(buf.length / 1024).toFixed(1)}K  | ${task.note}`,
    );
    done++;
  }
}

console.log(`\ndone: ${done} файлов, пропущено ${skipped}`);
