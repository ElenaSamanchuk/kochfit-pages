import { LessonPage } from "@/components/site/LessonPage";
import { teipirovanie3Lesson } from "@/content/lessons/teipirovanie3";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(teipirovanie3Lesson);

/** /teipirovanie3 — «Тейпирование: Пупочное кольцо» (live kochfit.ru/teipirovanie3, Tilda page18422959) */
export default function Teipirovanie3Page() {
  return <LessonPage doc={teipirovanie3Lesson} />;
}
