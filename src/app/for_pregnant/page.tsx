import { EquipmentSection } from "@/components/pregnancy/EquipmentSection";
import { PregnancyBenefits } from "@/components/pregnancy/PregnancyBenefits";
import { PregnancyHero } from "@/components/pregnancy/PregnancyHero";
import { PregnancyProgram } from "@/components/pregnancy/PregnancyProgram";
import { PregnancyReviews } from "@/components/pregnancy/PregnancyReviews";
import { PregnancyTariffs } from "@/components/pregnancy/PregnancyTariffs";
import { UsefulMaterials } from "@/components/pregnancy/UsefulMaterials";
import { ExpectCourseSection } from "@/components/site/ExpectCourseSection";
import { HeroHeader } from "@/components/site/HeroHeader";
import { JsonLd } from "@/components/site/JsonLd";
import { courseJsonLd, pageMetadata } from "@/lib/seo";

const title = "Активная беременность";
const description =
  "Тренировки и лекции, которые помогают чувствовать себя в ресурсе, подготовить тело к родам и восстановиться быстрее";

export const metadata = pageMetadata({
  title,
  description,
  path: "/for_pregnant",
  ogTitle: "Курс «Активная беременность» от Юлии Кочкиной",
  image: "/images/pregnancy/imgImage2398.webp",
});

/** «Активная беременность» — Figma 2351:10750 */
export default function PregnancyPage() {
  return (
    <>
      <HeroHeader />
      <main className="figma-landing page-inset mx-auto w-full max-w-[1400px] overflow-x-clip min-[1200px]:overflow-x-visible">
      <JsonLd data={courseJsonLd({ name: title, description, path: "/for_pregnant" })} />
      <PregnancyHero />
      <div className="section-gap" data-reveal="up">
        <PregnancyBenefits />
      </div>
      <div className="section-gap overflow-x-visible overflow-y-visible" data-reveal="up">
        <PregnancyProgram />
      </div>
      <div className="section-gap section-gap-before-expect-pregnant" data-reveal="up">
        <ExpectCourseSection
          figmaNode="2351:10931"
          imageDir="pregnancy"
          chipsRow1={[
            { icon: "imgContainer1.svg", text: "Личный кабинет" },
            { icon: "imgContainer1.svg", text: "Мобильное приложение" },
            {
              icon: "imgContainer1.svg",
              text: "Тренировки 20–30 минут",
              mobileText: "Тренировки 20–30 мин",
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
              text: "Лекции акушера, нутрициолога, специалиста по ГВ",
              mobileText: "Лекции специалистов",
            },
          ]}
        />
      </div>
      <div className="section-gap section-gap-before-tariffs" data-reveal="up">
        <PregnancyTariffs />
      </div>
      <div className="section-gap overflow-x-visible overflow-y-visible" data-reveal="up">
        <UsefulMaterials />
      </div>
      <div className="section-gap overflow-x-visible overflow-y-visible" data-reveal="up">
        <EquipmentSection />
      </div>
      <div className="section-gap overflow-x-visible overflow-y-visible" data-reveal="up">
        <PregnancyReviews />
      </div>
    </main>
    </>
  );
}
