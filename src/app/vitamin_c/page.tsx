import { LessonPage } from "@/components/site/LessonPage";
import { vitaminCLesson } from "@/content/lessons/vitamin_c";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(vitaminCLesson);

/** /vitamin_c — «Витамин С» (live kochfit.ru/vitamin_c, Tilda page32242372) */
export default function VitaminCPage() {
  return <LessonPage doc={vitaminCLesson} />;
}
