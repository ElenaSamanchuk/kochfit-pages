import { LessonPage } from "@/components/site/LessonPage";
import { teipirovanie2Lesson } from "@/content/lessons/teipirovanie2";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(teipirovanie2Lesson);

/** /teipirovanie2 — «Тейпирование диастаза» (live kochfit.ru/teipirovanie2, Tilda page18422733) */
export default function Teipirovanie2Page() {
  return <LessonPage doc={teipirovanie2Lesson} />;
}
