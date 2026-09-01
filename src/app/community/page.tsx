import { AboutCourse } from "@/components/beauty/AboutCourse";
import { AudienceSection } from "@/components/beauty/AudienceSection";
import { BeautyHero } from "@/components/beauty/BeautyHero";
import { ExpectSection } from "@/components/beauty/ExpectSection";
import { InsideCourse } from "@/components/beauty/InsideCourse";
import { ReferralSection } from "@/components/beauty/ReferralSection";
import { TariffsSection } from "@/components/beauty/TariffsSection";
import { HeroHeader } from "@/components/site/HeroHeader";
import { JsonLd } from "@/components/site/JsonLd";
import { courseJsonLd, pageMetadata } from "@/lib/seo";

const title = "Красота и здоровье";
const description =
  "Система тренировок, дыхания и работы с телом, которую можно встроить в обычную жизнь и заниматься регулярно от 15 минут в день";

export const metadata = pageMetadata({
  title,
  description,
  path: "/community",
  ogTitle: "Курс «Красота и здоровье» от Юлии Кочкиной",
  image: "/images/beauty-health/img54.webp",
});

/** «Красота и здоровье» — Figma 2031:2178 «красота и здоровье» */
export default function BeautyHealthPage() {
  return (
    <>
      <HeroHeader />
      <main className="figma-landing page-inset mx-auto w-full max-w-[1400px] overflow-x-clip">
      <JsonLd data={courseJsonLd({ name: title, description, path: "/community" })} />
      <BeautyHero />
      <div className="section-gap overflow-x-visible overflow-y-visible" data-reveal="up">
        <AboutCourse />
      </div>
      <div className="section-gap" data-reveal="up">
        <InsideCourse />
      </div>
      <div className="section-gap" data-reveal="up">
        <AudienceSection />
      </div>
      <div className="section-gap" data-reveal="up">
        <TariffsSection />
      </div>
      <div className="section-gap section-gap-before-expect" data-reveal="up">
        <ExpectSection />
      </div>
      <div className="section-gap section-gap-before-referral" data-reveal="up">
        <ReferralSection />
      </div>
    </main>
    </>
  );
}
