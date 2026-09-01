import { LessonPage } from "@/components/site/LessonPage";
import { fbasketLesson } from "@/content/lessons/fbasket";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(fbasketLesson);

/** /fbasket — «Продуктовая корзина» (live kochfit.ru/fbasket, Tilda page39495259) */
export default function FbasketPage() {
  return <LessonPage doc={fbasketLesson} />;
}
