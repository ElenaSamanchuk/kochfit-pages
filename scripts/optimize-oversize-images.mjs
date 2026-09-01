#!/usr/bin/env node
/**
 * Сжимает растр > 1MB в public/: качество в приоритете.
 * - WebP уже есть → q88 (схемы q92), без апскейла
 * - JPEG → mozjpeg q90
 * - PNG → WebP-сиблинг + сжатие оригинала; фото без альфы, если PNG
 *   всё ещё > 1MB после ресайза — удаляем PNG (на сайте остаётся .webp)
 *
 *   node scripts/optimize-oversize-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.resolve(import.meta.dirname, "..", "public");
const MIN_BYTES = 1024 * 1024;
const WEBP_QUALITY = 88;
const WEBP_DIAGRAM = 92;
/** Hero-портреты (лицо крупно) — q88 мылит; не давить ниже. */
const WEBP_HERO_PORTRAIT = 94;
const JPEG_QUALITY = 90;
const DEFAULT_MAX_W = 2600;

const EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (EXTS.has(path.extname(e.name).toLowerCase())) out.push(p);
  }
  return out;
}

function relFromPublic(abs) {
  return path.relative(PUBLIC, abs).replaceAll("\\", "/");
}

/** Потолок ширины по роли (display × dpr с запасом). Без апскейла. */
function roleMaxWidth(rel) {
  const n = rel.replaceAll("\\", "/");

  if (/images\/home\/imgRectangle2901[2-9](-\d+)?\.(webp|png)$/i.test(n)) return 512;
  if (/imgIndicatorImage/i.test(n)) return 512;

  if (/images\/(pelvic-floor|pregnancy)\/imgImage[12]?\.(png|webp)$/i.test(n)) {
    return 320;
  }

  if (/imgBannerImage/i.test(n)) return 808;
  if (/imgHf202604291330522E949F7AB5Bd41DdB9FdF7Ecf1D6D7B92/i.test(n)) return 800;
  if (/imgRectangle2938/i.test(n)) return 800;

  if (/images\/home\/imgImage1?\.png$/i.test(n)) return 240;
  if (/imgCourseImage/i.test(n)) return 1800;
  if (/imgAuthorSectionBg|images\/home\/imgSectionImage1/i.test(n)) return 2320;

  if (/imgIPhone15Pro/i.test(n)) return 840;
  if (/imgAuthorPortrait-4k/i.test(n)) return 2000;

  // 2× Figma hero (1360×728 → 2720); ceiling с запасом под будущие экспорт
  if (/beauty-health\/img54\./i.test(n)) return 2800;
  if (/pelvic-floor\/img8892\./i.test(n)) return 2800;
  if (/imgImage2398/i.test(n)) return 1600;
  if (/imgChatGptImage/i.test(n)) return 2800;
  if (/imgHf20260520113803/i.test(n)) return 1600;

  if (/\/(articles|results|person)\//i.test(n)) return 1800;
  if (/lessons\/recipes/i.test(n)) return 1800;
  if (/lessons\/stlk/i.test(n)) return 2400;

  if (/postpartum\/imgImage[12]?\.(png|webp)$/i.test(n)) return 1680;

  return DEFAULT_MAX_W;
}

function isDiagram(rel) {
  return /lessons\/stlk/i.test(rel);
}

function isHeroPortrait(rel) {
  return /beauty-health\/img54\./i.test(rel) || /pelvic-floor\/img8892\./i.test(rel);
}

function webpQualityFor(rel) {
  if (isDiagram(rel)) return WEBP_DIAGRAM;
  if (isHeroPortrait(rel)) return WEBP_HERO_PORTRAIT;
  return WEBP_QUALITY;
}

async function encodeWebp(pipe, { quality, hasAlpha, smartSubsample }) {
  return pipe
    .webp({
      quality,
      alphaQuality: hasAlpha ? 100 : 80,
      effort: 6,
      smartSubsample,
    })
    .toBuffer();
}

const files = walk(path.join(PUBLIC, "images")).filter((f) => {
  try {
    return fs.statSync(f).size > MIN_BYTES;
  } catch {
    return false;
  }
});

files.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size);

const rows = [];
let beforeTotal = 0;
let afterTotal = 0;

for (const file of files) {
  const rel = relFromPublic(file);
  const before = fs.statSync(file).size;
  const ext = path.extname(file).toLowerCase();
  const meta = await sharp(file).metadata();
  const srcW = meta.width ?? 0;
  const hasAlpha = Boolean(meta.hasAlpha);
  const maxW = roleMaxWidth(rel);
  const diagram = isDiagram(rel);
  const heroPortrait = isHeroPortrait(rel);
  const q = webpQualityFor(rel);
  const targetW = srcW > 0 ? Math.min(maxW, srcW) : maxW;
  const needResize = srcW > targetW;

  const basePipe = () => {
    let p = sharp(file);
    if (needResize) {
      p = p.resize({ width: targetW, withoutEnlargement: true, kernel: "lanczos3" });
    }
    return p;
  };

  let after = before;
  let action = "skip";
  let webpWrote = "";

  try {
    if (ext === ".webp") {
      // Не пережимать уже готовые hero-портреты q94 — иначе q88 «съедает» лицо.
      if (heroPortrait && before > 150 * 1024 && !needResize) {
        action = `webp hero keep q≥${WEBP_HERO_PORTRAIT}`;
      } else {
        const buf = await encodeWebp(basePipe(), {
          quality: q,
          hasAlpha,
          smartSubsample: !diagram && !heroPortrait,
        });
        if (buf.length < before * 0.98) {
          fs.writeFileSync(file, buf);
          after = buf.length;
          action = needResize ? `webp q${q} resize→${targetW}` : `webp q${q}`;
        } else {
          action = "webp already compact";
        }
      }
    } else if (ext === ".jpg" || ext === ".jpeg") {
      const jpgBuf = await basePipe()
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toBuffer();
      const webpPath = file.replace(/\.jpe?g$/i, ".webp");
      const webpBuf = await encodeWebp(basePipe(), {
        quality: q,
        hasAlpha: false,
        smartSubsample: !diagram && !heroPortrait,
      });
      fs.writeFileSync(webpPath, webpBuf);
      webpWrote = path.basename(webpPath);

      if (jpgBuf.length < before * 0.98) {
        fs.writeFileSync(file, jpgBuf);
        after = jpgBuf.length;
        action = `jpeg q${JPEG_QUALITY}` + (needResize ? ` resize→${targetW}` : "") + ` + ${webpWrote}`;
      } else {
        after = fs.statSync(file).size;
        action = `jpeg kept + ${webpWrote}`;
      }
    } else if (ext === ".png") {
      const webpPath = file.replace(/\.png$/i, ".webp");
      const webpBuf = await encodeWebp(basePipe(), {
        quality: q,
        hasAlpha,
        smartSubsample: !diagram && !heroPortrait,
      });
      const existingWebp = fs.existsSync(webpPath) ? fs.statSync(webpPath).size : Infinity;
      // Обычные: пишем меньший webp. Hero: не затирать крупный q94 мелким q88.
      const writeWebp = !fs.existsSync(webpPath)
        || (heroPortrait ? webpBuf.length >= existingWebp || existingWebp < 150 * 1024 : webpBuf.length < existingWebp);
      if (writeWebp) fs.writeFileSync(webpPath, webpBuf);
      webpWrote = path.basename(webpPath);

      if (heroPortrait) {
        // Hero PNG — исходник OG/ре-энкода; не удалять даже если >1MB.
        after = before;
        action = `png hero kept + ${webpWrote}`;
      } else if (hasAlpha) {
        const pngBuf = await basePipe().png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
        if (pngBuf.length < before * 0.95) {
          fs.writeFileSync(file, pngBuf);
          after = pngBuf.length;
          action = `png deflate` + (needResize ? ` resize→${targetW}` : "") + ` + ${webpWrote}`;
        } else {
          after = before;
          action = `png kept (alpha) + ${webpWrote}`;
        }
        if (after > MIN_BYTES && fs.existsSync(webpPath)) {
          fs.unlinkSync(file);
          after = 0;
          action = `png→webp (alpha, removed png) ${webpWrote}`;
        }
      } else {
        const pngBuf = await basePipe().png({ compressionLevel: 9 }).toBuffer();
        if (pngBuf.length < before * 0.95 && pngBuf.length <= MIN_BYTES) {
          fs.writeFileSync(file, pngBuf);
          after = pngBuf.length;
          action = `png deflate` + (needResize ? ` resize→${targetW}` : "") + ` + ${webpWrote}`;
        } else if (fs.existsSync(webpPath)) {
          fs.unlinkSync(file);
          after = 0;
          action = `png→webp (removed png) ${webpWrote}`;
        } else {
          fs.writeFileSync(file, pngBuf);
          after = pngBuf.length;
          action = `png deflate fallback + ${webpWrote}`;
        }
      }
    } else if (ext === ".gif") {
      const webpPath = file.replace(/\.gif$/i, ".webp");
      const webpBuf = await encodeWebp(basePipe(), {
        quality: q,
        hasAlpha,
        smartSubsample: !diagram && !heroPortrait,
      });
      fs.writeFileSync(webpPath, webpBuf);
      webpWrote = path.basename(webpPath);
      action = `gif + ${webpWrote}`;
    }
  } catch (err) {
    action = `ERROR ${err instanceof Error ? err.message : String(err)}`;
    after = before;
  }

  const webpSize = webpWrote
    ? (() => {
        const wp = file.replace(/\.(png|jpe?g|gif)$/i, ".webp");
        return fs.existsSync(wp) ? fs.statSync(wp).size : 0;
      })()
    : ext === ".webp"
      ? after
      : 0;

  beforeTotal += before;
  afterTotal += after === 0 ? webpSize : after;
  if (after === 0 && webpSize && ext !== ".webp") {
    afterTotal += 0;
  }

  rows.push({
    rel,
    beforeKb: Math.round(before / 1024),
    afterKb: after === 0 ? 0 : Math.round(after / 1024),
    webpKb: webpSize ? Math.round(webpSize / 1024) : null,
    srcW,
    maxW: targetW,
    action,
  });

  const shownAfter = after === 0 ? `removed (webp ${Math.round(webpSize / 1024)}K)` : `${Math.round(after / 1024)}K`;
  console.log(
    `${rel}: ${Math.round(before / 1024)}K → ${shownAfter}  (${srcW}w→${targetW}w)  ${action}`,
  );
}

console.log(
  `\nИтого оригиналы: ${(beforeTotal / 1024 / 1024).toFixed(1)}MB → обработано ${rows.length} файлов`,
);
console.log("report rows:", rows.length);
