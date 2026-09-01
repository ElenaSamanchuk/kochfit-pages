import type { Metadata, Viewport } from "next";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { Typo } from "@/components/ui/TypoText";
import { TypoDomSweep } from "@/components/ui/TypoDomSweep";
import { CookieConsent } from "@/components/site/CookieConsent";
import { JsonLd } from "@/components/site/JsonLd";
import { ScrollTopButton } from "@/components/site/ScrollTopButton";
import { DragScrollInit } from "@/components/site/DragScrollInit";
import { Footer } from "@/components/site/Footer";
import { SiteScripts } from "@/components/site/SiteScripts";
import { evolventa, nunitoSans } from "@/lib/fonts";
import { organizationJsonLd, SITE_URL, websiteJsonLd } from "@/lib/seo";
import "./globals.css";
import "@/components/site/nn99-brand-blue.css";

const defaultTitle = "Kochfit — фитнес-школа женского здоровья";
const defaultDescription =
  "Система тренировок, которая встраивается в жизнь: от 15-минутной зарядки до силовых тренировок";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: "%s — Kochfit",
  },
  description: defaultDescription,
  keywords: [
    "фитнес",
    "похудение",
    "онлайн",
    "женское здоровье",
    "программа питания",
    "программа тренировок",
    "восстановление после родов",
    "мышцы тазового дна",
    "беременность",
  ],
  verification: {
    yandex: "dacdb5eda486cd7a",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Kochfit",
    title: defaultTitle,
    description: "Онлайн фитнес-школа женского здоровья Юлии Кочкиной",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
};

/** viewportFit: "cover" — обязателен, чтобы env(safe-area-inset-*) вообще резолвился на iPhone с чёлкой */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${nunitoSans.variable} ${evolventa.variable}`}
      suppressHydrationWarning
    >
      {/* CSS Collabza грузится лениво в SiteScripts, чтобы не блокировать рендер */}
      {/* Extensions (e.g. ColorZilla cz-shortcut-listen) mutate body before hydration */}
      <body className="antialiased" suppressHydrationWarning>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Typo>
          {children}
          <Footer />
          <CookieConsent />
        </Typo>
        <TypoDomSweep />
        <ScrollTopButton />
        <DragScrollInit />
        <SiteScripts />
        <MotionRoot />
      </body>
    </html>
  );
}
