import { applyLinkTargetsToHtml } from "@/lib/link-target";

/**
 * Русская типографика: неразрывный пробел (U+00A0) после коротких слов,
 * чтобы частицы и союзы не «висели» в конце строки.
 *
 * @example
 * ```ts
 * import { typo } from "@/lib/typography";
 *
 * <p>{typo("Тренировки в удобное время")}</p>
 * ```
 *
 * @see Typo / TypoText — {@link @/components/ui/TypoText} для JSX-дерева
 */

/** Частицы и короткие слова: длинные первыми, чтобы regex не резал совпадения. */
export const TYPO_PARTICLES = [
  "между",
  "через",
  "перед",
  "после",
  "без",
  "для",
  "при",
  "про",
  "над",
  "под",
  "или",
  "ещё",
  "уже",
  "это",
  "если",
  "тоже",
  "также",
  "все",
  "всё",
  "где",
  "куда",
  "так",
  "как",
  "что",
  "чем",
  "то",
  "не",
  "ни",
  "на",
  "но",
  "по",
  "за",
  "из",
  "от",
  "до",
  "об",
  "во",
  "со",
  "же",
  "ли",
  "бы",
  "уж",
  "в",
  "и",
  "с",
  "к",
  "о",
  "у",
  "а",
] as const;

const CYRILLIC = "а-яёА-ЯЁ";
const PARTICLE_ALT = TYPO_PARTICLES.map((p) =>
  p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
).join("|");

/** Не часть более длинного слова; пробел после частицы → nbsp. */
const NBSP_AFTER_PARTICLE = new RegExp(
  `(?<![${CYRILLIC}a-zA-Z0-9-])(${PARTICLE_ALT})([ \\t]+)(?=\\S)`,
  "gi",
);

/**
 * Заменяет обычный пробел после частицы на неразрывный (U+00A0).
 * Только для plain text — не применять к HTML (`dangerouslySetInnerHTML`).
 */
export function nbspAfterParticles(text: string): string {
  if (!text.includes(" ")) return text;
  return text.replace(NBSP_AFTER_PARTICLE, (_, particle: string) => `${particle}\u00A0`);
}

/** Прямые и типографские кавычки → русские «ёлочки». */
const QUOTE_CHARS = /["\u201c\u201d\u201e]/;

/**
 * Заменяет прямые `"…"` и типографские “…” на «…».
 * Только для plain text — не применять к HTML (`dangerouslySetInnerHTML`).
 */
export function russianQuotes(text: string): string {
  if (!QUOTE_CHARS.test(text)) return text;

  let result = "";
  let straightOpen = true;

  for (const ch of text) {
    if (ch === "\u201c" || ch === "\u201e") {
      result += "«";
    } else if (ch === "\u201d") {
      result += "»";
    } else if (ch === '"') {
      result += straightOpen ? "«" : "»";
      straightOpen = !straightOpen;
    } else {
      result += ch;
    }
  }

  return result;
}

/** Короткий алиас для JSX: `{typo("…")}`. */
export function typo(text: string): string {
  return nbspAfterParticles(russianQuotes(text));
}

/** Типографика для HTML-фрагментов (только текст между тегами, теги не трогаем). */
export function typoHtml(html: string): string {
  const withTargets = applyLinkTargetsToHtml(html);
  if (!withTargets.includes(" ")) return withTargets;
  return withTargets
    .split(/(<[^>]+>)/g)
    .map((part) => (part.startsWith("<") ? part : typo(part)))
    .join("");
}

const TYPO_DOM_SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "CODE",
  "PRE",
]);

function shouldTypoDomTextNode(node: Text): boolean {
  const parent = node.parentElement;
  if (!parent) return false;
  if (TYPO_DOM_SKIP_TAGS.has(parent.tagName)) return false;
  if (parent.closest("[data-no-typo]")) return false;
  if (parent.isContentEditable) return false;
  const text = node.textContent ?? "";
  return text.includes(" ") && text.trim().length > 0;
}

/**
 * Проходит по текстовым узлам DOM и применяет typo().
 * Идемпотентно — повторный вызов безопасен (nbsp уже на месте).
 */
export function applyTypoToDom(root: ParentNode = document.body): void {
  if (typeof document === "undefined") return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];

  let current = walker.nextNode();
  while (current) {
    const textNode = current as Text;
    if (shouldTypoDomTextNode(textNode)) nodes.push(textNode);
    current = walker.nextNode();
  }

  for (const node of nodes) {
    const original = node.textContent ?? "";
    const fixed = typo(original);
    if (fixed !== original) node.textContent = fixed;
  }
}
