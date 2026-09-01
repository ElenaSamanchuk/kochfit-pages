import { AppPromoSection } from "@/components/home/AppPromoSection";
import { PlatformPromoSection } from "@/components/home/PlatformPromoSection";
import { AuthorSection } from "@/components/home/AuthorSection";
import { CoursesCatalog } from "@/components/home/CoursesCatalog";
import { HomeHero } from "@/components/home/HomeHero";
import { PlatformSection } from "@/components/home/PlatformSection";
import { WhyKochfit } from "@/components/home/WhyKochfit";
import { HeroHeader } from "@/components/site/HeroHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kochfit — онлайн-курсы по фитнесу и женскому здоровью",
  description:
    "Онлайн фитнес-школа женского здоровья Юлии Кочкиной: тренировки, дыхание и система, которая встраивается в жизнь, от 15-минутной зарядки до силовых тренировок",
  path: "/",
  absoluteTitle: true,
  ogTitle: "Kochfit — фитнес-школа женского здоровья",
  image: "/images/shared/hero-bg.webp",
});

/** Главная — Figma 2031:1818 «главная» (секция «страницы итог») */
export default function HomePage() {
  return (
    <>
      <HeroHeader />
      <main className="figma-landing page-inset mx-auto w-full max-w-[1400px] overflow-x-clip xl:overflow-x-visible">
      <HomeHero />
      <div className="section-gap-after-hero overflow-x-visible overflow-y-visible" data-reveal="up">
        <WhyKochfit />
      </div>
      <div className="section-gap section-gap-before-courses" data-reveal="up">
        <CoursesCatalog />
      </div>
      <div className="section-gap" data-reveal="up">
        <PlatformSection />
      </div>
      <div className="section-gap overflow-x-visible overflow-y-visible" data-reveal="up">
        <AuthorSection />
      </div>
      <div className="section-gap section-gap--112" data-reveal="up">
        {/* Figma 2031:2122 — приложение + платформа */}
        <section
          data-figma-node="2031:2122"
          className="mx-auto flex w-full max-w-[1160px] flex-col gap-[18px] xl:flex-row xl:items-stretch xl:justify-between"
        >
          <AppPromoSection />
          <PlatformPromoSection />
        </section>
      </div>
    </main>
    </>
  );
}
