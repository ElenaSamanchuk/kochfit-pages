#!/usr/bin/env node
/**
 * Исправляет ориентацию сертификатов person: пиксели сохранены «боком»,
 * EXIF orientation = 1. Физически поворачиваем sharp.rotate() и перезаписываем.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = "public/images/person";

/** filename → итоговый угол поворота от исходника (sharp: положительный = по часовой) */
const ROTATIONS = {
  "photo.jpg": 270,
  "3.jpg": 90,
  "4.jpg": 270,
  "5.jpg": 90,
  "6.jpg": 270,
  "7.jpg": 270,
  "9.jpg": 270,
  "12.jpg": 90,
  "19.jpg": 90,
  "22.jpg": 270,
};

for (const [file, angle] of Object.entries(ROTATIONS)) {
  const fp = path.join(DIR, file);
  if (!fs.existsSync(fp)) {
    console.error("missing:", fp);
    process.exitCode = 1;
    continue;
  }

  const before = await sharp(fp).metadata();
  await sharp(fp).rotate(angle).toFile(`${fp}.tmp`);
  fs.renameSync(`${fp}.tmp`, fp);
  const after = await sharp(fp).metadata();

  console.log(
    `${file}: ${before.width}x${before.height} → ${after.width}x${after.height} (rotate ${angle}°)`,
  );
}

console.log(`\nFixed ${Object.keys(ROTATIONS).length} files.`);
