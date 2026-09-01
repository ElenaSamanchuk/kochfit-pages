import { basePath } from "@/lib/asset-path";

/** Нормализует pathname: убирает basePath и trailing slash. */
export function normalizePathname(pathname: string): string {
  let path = pathname || "/";

  if (basePath && path.startsWith(basePath)) {
    path = path.slice(basePath.length) || "/";
  }

  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  return path;
}

/** Точное совпадение для `/`, prefix для вложенных маршрутов. */
export function isNavLinkActive(href: string, pathname: string): boolean {
  const current = normalizePathname(pathname);
  const target = normalizePathname(href);

  if (target === "/") {
    return current === "/";
  }

  return current === target || current.startsWith(`${target}/`);
}
