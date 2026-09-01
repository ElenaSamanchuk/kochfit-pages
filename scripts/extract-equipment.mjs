#!/usr/bin/env node
/**
 * Извлекает данные и картинки страницы инвентаря из kochfit-oborudovanie/index.html
 * и (опционально) обновляет src/content/equipment.ts + public/images/equipment/.
 *
 * Источник на Тильде: /equipment → iframe kochfit-oborudovanie (page158387209).
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE =
  process.env.EQUIPMENT_SOURCE ??
  path.resolve(ROOT, "../kochfit-oborudovanie/index.html");
const OUT_IMG = path.join(ROOT, "public/images/equipment");

if (!fs.existsSync(SOURCE)) {
  console.error("Не найден:", SOURCE);
  console.error("Укажите EQUIPMENT_SOURCE=/path/to/index.html");
  process.exit(1);
}

const html = fs.readFileSync(SOURCE, "utf8");
fs.mkdirSync(OUT_IMG, { recursive: true });

const itemsMatch = html.match(/sf=(\[[\s\S]*?\]),nf=/);
if (!itemsMatch) {
  console.error("Не удалось найти массив sf= в bundle");
  process.exit(1);
}
const items = eval(itemsMatch[1]);
console.log("items:", items.length);

const shopsMatch = html.match(/tf=(\[[\s\S]*?\]),sf=/);
const shops = shopsMatch ? eval(shopsMatch[1]) : [];
console.log("shops:", shops.length);

for (const [, file, varName] of html.matchAll(
  /"\.\/assets\/equipment\/([^"]+\.webp)":(\w+)/g,
)) {
  const re = new RegExp(`${varName}="(data:image/webp;base64,[^"]+)"`);
  const m = html.match(re);
  if (!m) continue;
  const b64 = m[1].replace(/^data:image\/webp;base64,/, "");
  fs.writeFileSync(path.join(OUT_IMG, file), Buffer.from(b64, "base64"));
  console.log("image", file);
}

console.log("\nОбновите src/content/equipment.ts вручную или через diff с JSON ниже:\n");
console.log(JSON.stringify({ shops, items }, null, 2));
