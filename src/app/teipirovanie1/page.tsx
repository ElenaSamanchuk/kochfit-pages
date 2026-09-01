import { LessonPage } from "@/components/site/LessonPage";
import { teipirovanie1Lesson } from "@/content/lessons/teipirovanie1";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(teipirovanie1Lesson);

/** /teipirovanie1 — «Тейпирование шрамов» (live kochfit.ru/teipirovanie1, Tilda page18422510) */
export default function Teipirovanie1Page() {
  return <LessonPage doc={teipirovanie1Lesson} />;
}
