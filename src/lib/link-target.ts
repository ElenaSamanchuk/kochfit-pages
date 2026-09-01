/** Same-origin app paths: `/community`, `/r#tariffs`, … */
export function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function isInPageHref(href: string): boolean {
  return href.startsWith("#");
}

export function isMailOrTelHref(href: string): boolean {
  return /^(mailto:|tel:)/i.test(href.trim());
}

/**
 * Other origins and app protocols (http(s), protocol-relative, Telegram).
 * Anchors, `/…` routes, mailto/tel stay in the current tab.
 */
export function opensInNewTab(href: string): boolean {
  const h = href.trim();
  if (!h || isInternalHref(h) || isInPageHref(h) || isMailOrTelHref(h)) {
    return false;
  }
  return /^(https?:|\/\/|tg:)/i.test(h);
}

export const NEW_TAB_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export function newTabProps(
  href: string,
): { target: "_blank"; rel: "noopener noreferrer" } | Record<string, never> {
  return opensInNewTab(href) ? NEW_TAB_PROPS : {};
}

const ANCHOR_OPEN = /<a\b([^>]*?)>/gi;

/** Нормализует target/rel у `<a>` в HTML-фрагментах (статьи, уроки). */
export function applyLinkTargetsToHtml(html: string): string {
  if (!html.includes("<a")) return html;
  return html.replace(ANCHOR_OPEN, (_full, attrs: string) => {
    const hrefMatch = attrs.match(
      /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
    );
    if (!hrefMatch) return `<a${attrs}>`;
    const href = (hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? "").trim();
    if (opensInNewTab(href)) {
      let next = attrs;
      if (!/\btarget\s*=/i.test(next)) next += ' target="_blank"';
      if (!/\brel\s*=/i.test(next)) {
        next += ' rel="noopener noreferrer"';
      } else if (!/noopener/i.test(next)) {
        next = next.replace(
          /\brel\s*=\s*(["'])([^"']*)\1/i,
          (_m, q: string, val: string) =>
            `rel=${q}${val} noopener noreferrer${q}`,
        );
      }
      return `<a${next}>`;
    }
    if (isInternalHref(href) || isInPageHref(href)) {
      let next = attrs.replace(
        /\s*\btarget\s*=\s*(?:"_blank"|'_blank'|_blank)/gi,
        "",
      );
      next = next.replace(
        /\s*\brel\s*=\s*(?:"(?:\s*(?:noopener|noreferrer)\s*)+"|'(?:\s*(?:noopener|noreferrer)\s*)+')/gi,
        "",
      );
      return `<a${next}>`;
    }
    return `<a${attrs}>`;
  });
}
