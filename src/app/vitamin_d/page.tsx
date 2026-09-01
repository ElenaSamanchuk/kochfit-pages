import { LessonPage } from "@/components/site/LessonPage";
import { vitaminDLesson } from "@/content/lessons/vitamin_d";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(vitaminDLesson);

/** /vitamin_d — «Витамин D» (live kochfit.ru/vitamin_d, Tilda page32204824) */
export default function VitaminDPage() {
  return <LessonPage doc={vitaminDLesson} />;
}
