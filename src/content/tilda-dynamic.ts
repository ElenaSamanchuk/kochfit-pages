import paymentSlugsJson from "@/content/migrated/payment-slugs.json";
import prosePagesJson from "@/content/migrated/prose-pages.json";
import redirectsJson from "@/content/migrated/redirects.json";
import type { PaymentOffer } from "@/content/payments";
import { getPaymentOffer } from "@/content/payments";

/** Блок контента статьи блога (перенос из Тильды, scripts/migrate-articles.mjs) */
export type ArticleBlock =
  | { t: "h2"; text: string }
  | { t: "p"; html: string }
  | { t: "list"; ordered: boolean; items: readonly string[] }
  | { t: "img"; src: string; alt: string; caption?: string }
  | { t: "gallery"; images: readonly { src: string; alt: string }[] }
  | { t: "video"; kind: "youtube"; id: string }
  | { t: "kinescope"; src: string }
  | { t: "kinescopeGallery"; srcs: readonly string[] }
  | { t: "cta"; href: string; label: string }
  | {
      t: "cards";
      items: readonly {
        href: string;
        src: string;
        alt: string;
        title: string;
        label: string;
      }[];
    };

export type ProseDoc = {
  path: string;
  slug: string;
  title: string;
  description: string;
  paragraphs: readonly string[];
  /** Полноценный контент статьи блога (заголовки/абзацы/картинки по месту) */
  blocks?: readonly ArticleBlock[];
  /** Kinescope-embed уроков (видеохостинг, нативной замены iframe нет) */
  videos?: readonly string[];
  lesson?: boolean;
  stub?: boolean;
};

type MigratedPayment = PaymentOffer & { path?: string };

const paymentByPath = new Map<string, MigratedPayment>();
const paymentBySlug = new Map<string, MigratedPayment>();

for (const entry of Object.values(paymentSlugsJson as Record<string, MigratedPayment>)) {
  if (entry.path) paymentByPath.set(entry.path, entry);
  paymentBySlug.set(entry.slug, entry);
}

const prosePages = prosePagesJson as Record<string, ProseDoc>;
const v2Redirects = redirectsJson as Record<string, string>;

/** Dedicated app/<slug>/page.tsx wins over catch-all; do not prerender stubs. */
const DEDICATED_PROSE = new Set([
  "7test",
  "stlk",
  "mpod",
  "tmtd",
  "tmj",
  "foottapingtheory",
  "teipirovaniehalusvalgus",
  "tld",
  "teipirovanie1",
  "teipirovanie2",
  "teipirovanie3",
  "tapingcrest",
  "breathtest",
  "testoda",
  "diastasis",
  "mtd",
  "ifr",
  "faq",
  "bad_2",
  "vitamin_d",
  "omega3",
  "magnesium",
  "selen",
  "zincum",
  "calcium",
  "vitamin_c",
  "ferrum",
  "lecithin",
  "protein",
  "5htp",
  "food",
  "recipes",
  "fooddop",
  "fbasket",
  "pitweb",
]);

export function pathKey(segments: string[]): string {
  return segments.map((s) => s.replace(/\/$/, "")).filter(Boolean).join("/");
}

export function getV2Redirect(segments: string[]): string | null {
  const key = pathKey(segments);
  return v2Redirects[key] ?? null;
}

export function getDynamicPaymentOffer(segments: string[]): PaymentOffer | null {
  const key = pathKey(segments);
  const root = segments[0] ?? key;
  return (
    getPaymentOffer(root) ??
    getPaymentOffer(key.replace(/\//g, "_")) ??
    paymentByPath.get(key) ??
    paymentBySlug.get(key.replace(/\//g, "_")) ??
    null
  );
}

export function getDynamicProsePage(segments: string[]): ProseDoc | null {
  const key = pathKey(segments);
  if (DEDICATED_PROSE.has(key)) return null;
  return prosePages[key] ?? null;
}

export function getAllProsePaths(): string[] {
  return Object.keys(prosePages).filter((p) => !DEDICATED_PROSE.has(p));
}

/** Уроки с отдельным `app/<slug>/page.tsx` (не попадают в catch-all / prose sitemap). */
const EXTRA_DEDICATED_LESSONS = [
  "ifrtheory",
  "massage",
  "mtdpractice",
  "tmjjoint",
] as const;

/** Пути уроков для sitemap: dedicated pages, без дубля /mpod (= /stlk) и /faq (уже в publicRoutes). */
export function getSitemapLessonPaths(): string[] {
  return [...DEDICATED_PROSE, ...EXTRA_DEDICATED_LESSONS].filter(
    (p) => p !== "mpod" && p !== "faq",
  );
}

export function getAllPaymentPaths(): string[] {
  return [...paymentByPath.keys()];
}

export function getAllRedirectPaths(): string[] {
  return Object.keys(v2Redirects);
}
