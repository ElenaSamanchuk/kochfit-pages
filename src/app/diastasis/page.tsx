import { LessonPage } from "@/components/site/LessonPage";
import { diastasisLesson } from "@/content/lessons/diastasis";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(diastasisLesson);

/** /diastasis — «Диастаз» (live kochfit.ru/diastasis, Tilda page24890894) */
export default function DiastasisPage() {
  return <LessonPage doc={diastasisLesson} />;
}
