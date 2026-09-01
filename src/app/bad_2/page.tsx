import { LessonPage } from "@/components/site/LessonPage";
import { bad2Lesson } from "@/content/lessons/bad_2";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(bad2Lesson);

/** /bad_2 — «Что такое БАДы и зачем они нужны» (live kochfit.ru/bad_2, Tilda page32545782) */
export default function Bad2Page() {
  return <LessonPage doc={bad2Lesson} />;
}
