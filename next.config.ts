import type { NextConfig } from "next";
import redirectsJson from "./src/content/migrated/redirects.json";

/** Preview на общем хосте: npm run build:server */
const basePath = (
  process.env.KOCHFIT_BASE_PATH ??
  process.env.NEXT_PUBLIC_BASE_PATH ??
  ""
).replace(/\/$/, "");

/** Экспорт в корень (без basePath) — KOCHFIT_STATIC_EXPORT=1 */
const isStaticExport =
  Boolean(basePath) || process.env.KOCHFIT_STATIC_EXPORT === "1";

const v2Redirects = Object.entries(redirectsJson as Record<string, string>).map(
  ([source, destination]) => ({
    source: `/${source}`,
    destination,
    permanent: true,
  }),
);

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  ...(isStaticExport
    ? {
        output: "export" as const,
        basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  ...(!isStaticExport
    ? {
        async redirects() {
          return [
            { source: "/goback404", destination: "/", permanent: true },
            { source: "/mpod", destination: "/stlk", permanent: true },
            ...v2Redirects,
          ];
        },
      }
    : {}),
};

export default nextConfig;
