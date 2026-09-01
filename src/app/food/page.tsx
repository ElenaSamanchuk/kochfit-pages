import { LessonPage } from "@/components/site/LessonPage";
import { foodLesson } from "@/content/lessons/food";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(foodLesson);

/** /food — «Питание» (live kochfit.ru/food, Tilda page39436744) */
export default function FoodPage() {
  return <LessonPage doc={foodLesson} />;
}
