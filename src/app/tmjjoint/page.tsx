import { LessonPage } from "@/components/site/LessonPage";
import { tmjjointLesson } from "@/content/lessons/tmjjoint";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(tmjjointLesson);

/** /tmjjoint — «Височно-нижнечелюстной сустав (ВНЧС)» (live kochfit.ru/tmjjoint, Tilda page25017562) */
export default function TmjjointPage() {
  return <LessonPage doc={tmjjointLesson} />;
}
