/** Префикс для деплоя в подкаталог (например /kochfit). Локально — пусто. */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

/** Абсолютный путь к файлу из public/ с учётом basePath. */
export function assetPath(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export { basePath };
