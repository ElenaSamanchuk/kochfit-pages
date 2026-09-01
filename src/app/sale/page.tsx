import { AboutCourse } from "@/components/beauty/AboutCourse";
import { AudienceSection } from "@/components/beauty/AudienceSection";
import { BeautyHero } from "@/components/beauty/BeautyHero";
import { ExpectSection } from "@/components/beauty/ExpectSection";
import { InsideCourse } from "@/components/beauty/InsideCourse";
import { ReferralSection } from "@/components/beauty/ReferralSection";
import { TariffsSection } from "@/components/beauty/TariffsSection";
import { HeroHeader } from "@/components/site/HeroHeader";
import { JsonLd } from "@/components/site/JsonLd";
import { coursePricing } from "@/content/courses";
import { courseJsonLd, pageMetadata } from "@/lib/seo";

const title = "Красота и здоровье — скидки";
const description =
  "Система тренировок, дыхания и работы с телом, которую можно встроить в обычную жизнь и заниматься регулярно от 15 минут в день. Акционные цены на тарифы курса";

export const metadata = pageMetadata({
  title,
  description,
  path: "/sale",
  ogTitle: "Курс «Красота и здоровье» от Юлии Кочкиной — скидки",
  image: "/images/beauty-health/img54.webp",
});

const { sale } = coursePricing.beautyHealth;

/** /sale — клон «Красоты и здоровья» (Figma 2031:2178) с акционными ценами тарифов */
export default function SalePage() {
  return (
    <>
      <HeroHeader />
      <main className="figma-landing page-inset mx-auto w-full max-w-[1400px] overflow-x-clip">
      <JsonLd data={courseJsonLd({ name: title, description, path: "/sale" })} />
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
        <TariffsSection
          standardPeriods={sale.standardFixedPeriods}
          premiumPeriods={sale.premiumFixedPeriods}
          showOldPrices
        />
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
