/**
 * Мобильный портретный кадр hero «Красота и здоровье» с наращенной стеной.
 *
 * Стена достраивается протяжкой верхней строки кадра — по значениям стык
 * непрерывен. Но плоская протяжка всё равно читается полосой на фоне
 * текстурной стены, поэтому вокруг стыка накладывается размытая копия
 * с альфа-рампом: резкой границы не остаётся.
 *
 * Зеркальная склейка не годится — на границе разворачивается градиент стены
 * и появляется видимая складка.
 */
import sharp from "sharp";
import fs from "node:fs";

const SRC = "public/images/beauty-health/img54.png";
const OUT = "public/images/beauty-health";
const CROP_X = 1570, CROP_W = 1150, SRC_H = 1456;
const SKIP_TOP = 4;           // светлая кромка исходника
const EXTEND = 588;           // добавляем стену → итог ≈9:16
const BODY_H = SRC_H - SKIP_TOP;
const FINAL_H = EXTEND + BODY_H;
const FEATHER = 220;          // половина высоты полосы сопряжения

/**
 * Стена: протяжка верхней полосы кадра + сильное размытие.
 * Без размытия протяжка превращает любую горизонтальную неоднородность строки
 * в резкую вертикальную полосу во всю высоту стены — она и читалась «стыком».
 */
const SEED_H = 80;
const seed = await sharp(SRC)
  .extract({ left: CROP_X, top: SKIP_TOP, width: CROP_W, height: SEED_H })
  .png().toBuffer();

const wall = await sharp(seed)
  .resize({ width: CROP_W, height: EXTEND, fit: "fill" })
  .blur(45)
  .png().toBuffer();

const body = await sharp(SRC)
  .extract({ left: CROP_X, top: SKIP_TOP, width: CROP_W, height: BODY_H })
  .png().toBuffer();

const base = await sharp({
  create: { width: CROP_W, height: FINAL_H, channels: 3, background: "#929090" },
})
  .composite([
    { input: wall, top: 0, left: 0 },
    { input: body, top: EXTEND, left: 0 },
  ])
  .png().toBuffer();

/* ——— сопряжение: размытая полоса вокруг стыка через альфа-рамп ——— */
const bandTop = EXTEND - FEATHER;
const bandH = FEATHER * 2;

const band = await sharp(base)
  .extract({ left: 0, top: bandTop, width: CROP_W, height: bandH })
  .blur(26)
  .ensureAlpha()
  .png().toBuffer();

/** Белый в середине → прозрачный к краям полосы. */
const ramp = Buffer.from(
  `<svg width="${CROP_W}" height="${bandH}" xmlns="http://www.w3.org/2000/svg">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="#fff" stop-opacity="0"/>` +
    `<stop offset="0.5" stop-color="#fff" stop-opacity="1"/>` +
    `<stop offset="1" stop-color="#fff" stop-opacity="0"/>` +
    `</linearGradient></defs>` +
    `<rect width="${CROP_W}" height="${bandH}" fill="url(#g)"/></svg>`,
);

const feathered = await sharp(band)
  .composite([{ input: ramp, blend: "dest-in" }])
  .png().toBuffer();

const composed = await sharp(base)
  .composite([{ input: feathered, top: bandTop, left: 0 }])
  .png().toBuffer();

fs.writeFileSync(`${OUT}/imgHeroBeautyMobile.png`, composed);
for (const w of [550, 1100, 1150]) {
  await sharp(composed).resize({ width: w }).webp({ quality: 82 }).toFile(`${OUT}/imgHeroBeautyMobile-${w}.webp`);
}
console.log(
  `готово: ${CROP_W}x${FINAL_H} (aspect ${(CROP_W / FINAL_H).toFixed(3)}), ` +
  `голова на ${(100 * (EXTEND + 176 - SKIP_TOP) / FINAL_H).toFixed(1)}% высоты`,
);
