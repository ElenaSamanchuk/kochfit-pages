import { assetPath } from "@/lib/asset-path";

type ImageType = "image/webp" | "image/jpeg" | "image/png";

/**
 * Предзагрузка LCP-картинки. Next.js поднимает `<link>` в `<head>`.
 * `href` — путь из `public/`; `assetPath` учитывает basePath `/kochfit`.
 */
export function LcpPreload({
  href,
  type = "image/webp",
}: {
  href: string;
  type?: ImageType;
}) {
  return (
    <link rel="preload" as="image" href={assetPath(href)} type={type} fetchPriority="high" />
  );
}
