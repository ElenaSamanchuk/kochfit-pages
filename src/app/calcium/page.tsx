import { LessonPage } from "@/components/site/LessonPage";
import { calciumLesson } from "@/content/lessons/calcium";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(calciumLesson);

/** /calcium — «Кальций» (live kochfit.ru/calcium, Tilda page32242271) */
export default function CalciumPage() {
  return <LessonPage doc={calciumLesson} />;
}
