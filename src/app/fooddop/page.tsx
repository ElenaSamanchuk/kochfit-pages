import { LessonPage } from "@/components/site/LessonPage";
import { fooddopLesson } from "@/content/lessons/fooddop";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(fooddopLesson);

/** /fooddop — «Дополнительные материалы - питание» (live kochfit.ru/fooddop, Tilda page39497957) */
export default function FooddopPage() {
  return <LessonPage doc={fooddopLesson} />;
}
