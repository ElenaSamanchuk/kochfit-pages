import { CourseProgram } from "@/components/pelvic/CourseProgram";
import { PelvicAudience } from "@/components/pelvic/PelvicAudience";
import { PelvicHero } from "@/components/pelvic/PelvicHero";
import { PelvicTariff } from "@/components/pelvic/PelvicTariff";
import { WhatIsMtd } from "@/components/pelvic/WhatIsMtd";
import { ExpectCourseSection } from "@/components/site/ExpectCourseSection";
import { HeroHeader } from "@/components/site/HeroHeader";
import { JsonLd } from "@/components/site/JsonLd";
import { courseJsonLd, pageMetadata } from "@/lib/seo";

const title = "Мышцы тазового дна и дыхание";
const description =
  "Курс для тех, кто хочет укрепить тазовое дно, наладить дыхание и убрать дискомфорт. Чтобы тело работало без ограничений";

export const metadata = pageMetadata({
  title,
  description,
  path: "/e_mtd",
  ogTitle: "Курс «Мышцы тазового дна и дыхание» от Юлии Кочкиной",
  image: "/images/pelvic-floor/img8892.webp",
});

/** «Мышцы тазового дна и дыхание» — Figma 2031:2607 */
export default function PelvicFloorPage() {
  return (
    <>
      <HeroHeader />
      <main className="figma-landing page-inset mx-auto w-full max-w-[1400px] overflow-x-clip">
      <JsonLd data={courseJsonLd({ name: title, description, path: "/e_mtd" })} />
      <PelvicHero />
      <div className="section-gap" data-reveal="up">
        <PelvicAudience />
      </div>
      <div className="section-gap" data-reveal="up">
        <WhatIsMtd />
      </div>
      <div className="section-gap" data-reveal="up">
        <CourseProgram />
      </div>
      <div className="section-gap" data-reveal="up">
        <PelvicTariff />
      </div>
      <div className="section-gap section-gap-before-expect-mtd" data-reveal="up">
        <ExpectCourseSection
          figmaNode="2031:2877"
          imageDir="pelvic-floor"
          chipsRow1={[
            { icon: "imgContainer1.svg", text: "Личный кабинет" },
            { icon: "imgContainer1.svg", text: "Мобильное приложение" },
            {
              icon: "imgContainer1.svg",
              text: "Уроки от 12 до 40 минут",
              mobileText: "Уроки 12–40 мин",
            },
          ]}
          chipsRow2={[
            {
              icon: "imgContainer.svg",
              text: "Тренируйся дома в удобное время",
              mobileText: "Дома в удобное время",
            },
            {
              icon: "imgContainer1.svg",
              text: "Вебинары специалиста по движению и акушера-гинеколога",
              hideOnMobile: true,
            },
          ]}
        />
      </div>
    </main>
    </>
  );
}
