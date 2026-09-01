import { LessonPage } from "@/components/site/LessonPage";
import { tmjLesson } from "@/content/lessons/tmj";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(tmjLesson);

/** /tmj — «Язык, лицо и работа с ВНЧС» (live kochfit.ru/tmj, Tilda page25017522) */
export default function TmjPage() {
  return <LessonPage doc={tmjLesson} />;
}
