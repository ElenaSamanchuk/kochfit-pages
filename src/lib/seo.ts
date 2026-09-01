import type { Metadata } from "next";

/** Production origin — каноникалы и OG всегда на kochfit.ru, без preview `/kochfit`. */
export const SITE_URL = "https://kochfit.ru";
export const SITE_NAME = "Kochfit";

const DEFAULT_OG_DESCRIPTION =
  "Онлайн фитнес-школа женского здоровья Юлии Кочкиной";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!path || path === "/") return `${SITE_URL}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Open Graph title, если отличается от `<title>` */
  ogTitle?: string;
  /** Путь из `public/` (`/images/...`) или абсолютный URL */
  image?: string;
  /** Не применять шаблон `%s — Kochfit` (главная и редиректы) */
  absoluteTitle?: boolean;
  noIndex?: boolean;
  follow?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  image,
  absoluteTitle = false,
  noIndex = false,
  follow = true,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = ogTitle ?? title;
  const imageUrl = image ? absoluteUrl(image) : undefined;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow } : undefined,
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      locale: "ru_RU",
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: socialTitle,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

/** Metadata для уроков/prose с полем `path` или `slug`. */
export function lessonMetadata(doc: {
  title: string;
  description: string;
  path?: string;
  slug?: string;
}): Metadata {
  const slug = doc.path || doc.slug || "";
  return pageMetadata({
    title: doc.title,
    description: doc.description,
    path: `/${slug}`,
  });
}

/** JS-редирект при static export: noindex + canonical на целевой URL. */
export function redirectMetadata(destinationPath: string): Metadata {
  const isExternal =
    destinationPath.startsWith("http://") || destinationPath.startsWith("https://");
  return {
    title: { absolute: "Перенаправление — Kochfit" },
    robots: { index: false, follow: true },
    ...(isExternal
      ? {}
      : { alternates: { canonical: absoluteUrl(destinationPath) } }),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_OG_DESCRIPTION,
    email: "info@kochfit.ru",
    sameAs: [
      "https://vk.com/kochfit",
      "https://www.youtube.com/channel/UCtmQXxlgEX7WIOQo_sSybMA",
      "https://www.instagram.com/kochkina_yulia/",
      "https://t.me/kochfitofficial",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "ru-RU",
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function courseJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: "ru-RU",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function personJsonLd({
  name,
  description,
  jobTitle,
  image,
}: {
  name: string;
  description: string;
  jobTitle: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description,
    jobTitle,
    url: absoluteUrl("/person"),
    image: absoluteUrl(image),
    worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}
