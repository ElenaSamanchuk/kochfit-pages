#!/usr/bin/env node
/**
 * Аудит ссылок:
 * 1) внешние raw <a> (https/http/tg и externalLinks login/platform/socials/…)
 *    должны иметь target="_blank" и rel="noopener".
 * 2) внутренние пути и якоря # не должны иметь target="_blank".
 * AppLink сам выставляет target — такие теги не считаются нарушением.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "src";
const EXTERNAL_KEYS = [
  "login",
  "platform",
  "telegramBot",
  "telegramChannel",
  "vk",
  "youtube",
  "instagram",
  "appStore",
  "googlePlay",
  "testOdaBlank",
  "freeWorkoutVideo",
];

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(e.name)) files.push(p);
  }
})(ROOT);

const openTagRe = /<(a|AppLink)\b[^>]*?>/gs;
let missingBlank = 0;
let internalBlank = 0;

function isExternalExpr(expr) {
  if (!expr) return false;
  if (EXTERNAL_KEYS.some((k) => new RegExp(`externalLinks\\.${k}\\b`).test(expr))) {
    return true;
  }
  if (/externalLinks\.buy\b/.test(expr)) return true;
  if (/\.checkoutUrl\b/.test(expr) || /\bbotHref\b/.test(expr) || /menuLogin\.href/.test(expr)) {
    return true;
  }
  return false;
}

function isInternalLiteral(literal) {
  return literal && ((literal.startsWith("/") && !literal.startsWith("//")) || literal.startsWith("#"));
}

function isInternalExpr(expr) {
  if (!expr) return false;
  if (/^["'`]#/.test(expr)) return true;
  if (/TARIFFS_HASH|#courses|#tariffs|#tariff|#about|#influencers/.test(expr)) return true;
  if (/externalLinks\.legal\b/.test(expr)) return true;
  if (/routes\./.test(expr)) return true;
  return false;
}

function isMailTel(literal, expr) {
  return (
    (literal && /^(mailto:|tel:)/.test(literal)) ||
    (expr && /externalLinks\.(email|supportEmail)/.test(expr))
  );
}

for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  let m;
  while ((m = openTagRe.exec(src))) {
    const tag = m[0];
    const name = m[1];
    const hrefMatch = tag.match(/href=(?:"([^"]*)"|\{([^}]*)\})/);
    if (!hrefMatch) continue;
    const literal = hrefMatch[1];
    const expr = hrefMatch[2];
    const line = src.slice(0, m.index).split("\n").length;
    const hasBlank = /target="_blank"/.test(tag);

    const isExternalLiteral = literal && /^(https?:|\/\/|tg:)/i.test(literal);
    const external = isExternalLiteral || isExternalExpr(expr);
    const internal = isInternalLiteral(literal) || isInternalExpr(expr);

    if (internal && hasBlank) {
      internalBlank++;
      console.log(`${file}:${line}  ${hrefMatch[0]}  [internal/hash with _blank]`);
      continue;
    }

    if (name === "AppLink") continue;
    if (isMailTel(literal, expr)) continue;

    if (external) {
      const hasRel = /rel="[^"]*noopener/.test(tag);
      if (!hasBlank || !hasRel) {
        missingBlank++;
        console.log(
          `${file}:${line}  ${hrefMatch[0]}  ${hasBlank ? "" : "[no _blank]"} ${hasRel ? "" : "[no rel]"}`,
        );
      }
    }
  }
}

console.log(`\nВнешних <a> без _blank/rel: ${missingBlank}`);
console.log(`Внутренних/якорей с _blank: ${internalBlank}`);
process.exit(missingBlank + internalBlank > 0 ? 1 : 0);
