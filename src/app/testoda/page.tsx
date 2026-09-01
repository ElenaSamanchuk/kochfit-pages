import { LessonPage } from "@/components/site/LessonPage";
import { testodaLesson } from "@/content/lessons/testoda";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(testodaLesson);

/** /testoda — «Тестирование ОДА» (live kochfit.ru/testoda, Tilda page23936452) */
export default function TestodaPage() {
  return <LessonPage doc={testodaLesson} />;
}
