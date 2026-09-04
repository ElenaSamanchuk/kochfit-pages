import { PostpartumHero } from "@/components/postpartum/PostpartumHero";
import { PostpartumTariffs } from "@/components/postpartum/PostpartumTariffs";
import { ProgramCards } from "@/components/postpartum/ProgramCards";
import { SuitableBanner } from "@/components/postpartum/SuitableBanner";
import { WhenToStart } from "@/components/postpartum/WhenToStart";
import { WorksWith } from "@/components/postpartum/WorksWith";
import { ExpectCourseSection } from "@/components/site/ExpectCourseSection";
import { HeroHeader } from "@/components/site/HeroHeader";
import { JsonLd } from "@/components/site/JsonLd";
import { courseJsonLd, pageMetadata } from "@/lib/seo";

const title = "Восстановление после родов";
const description =
  "Курс для женщин, которые хотят вернуть телу подвижность, осанку и мышечную поддержку после родов";

export const metadata = pageMetadata({
  title,
  description,
  path: "/r",
  ogTitle: "Курс «Восстановление после родов» от Юлии Кочкиной",
  image: "/images/postpartum/imgHf20260520113803Accb8Bac783540Ad9B063Eae4D01114F1.webp",
});

/** «Восстановление после родов» — Figma 2042:9154 */
export default function PostpartumPage() {
  return (
    <>
      <HeroHeader />
      <main className="figma-landing page-inset mx-auto w-full max-w-[1400px] overflow-x-clip xl:overflow-x-visible">
      <JsonLd data={courseJsonLd({ name: title, description, path: "/r" })} />
      <PostpartumHero />
      <div className="section-gap" data-reveal="up">
        <WorksWith />
      </div>
      <div className="section-gap overflow-x-visible overflow-y-visible" data-reveal="up">
        <ProgramCards />
      </div>
      <div className="section-gap section-gap-after-program" data-reveal="up">
        <WhenToStart />
      </div>
      <div className="section-gap overflow-x-visible overflow-y-visible" data-reveal="up">
        <SuitableBanner />
      </div>
      <div className="section-gap section-gap-before-tariffs" data-reveal="up">
        <PostpartumTariffs />
      </div>
      <div className="section-gap section-gap-before-expect-postpartum" data-reveal="up">
        <ExpectCourseSection
          figmaNode="2042:9439"
          imageDir="postpartum"
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
              text: "Начать можно с телефона в любое время",
              mobileText: "С телефона в любое время",
              hideOnMobile: true,
            },
            {
              icon: "imgContainer1.svg",
              text: "Лекции нутрициолога и психолога",
              mobileText: "Лекции экспертов",
            },
          ]}
        />
      </div>
    </main>
    </>
  );
}
