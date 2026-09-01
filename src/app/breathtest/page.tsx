import { LessonPage } from "@/components/site/LessonPage";
import { breathtestLesson } from "@/content/lessons/breathtest";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(breathtestLesson);

/** /breathtest — «Тестирование дыхание» (live kochfit.ru/breathtest, Tilda page23936424) */
export default function BreathtestPage() {
  return <LessonPage doc={breathtestLesson} />;
}
