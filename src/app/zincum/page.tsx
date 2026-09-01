import { LessonPage } from "@/components/site/LessonPage";
import { zincumLesson } from "@/content/lessons/zincum";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(zincumLesson);

/** /zincum — «Цинк» (live kochfit.ru/zincum, Tilda page32242093) */
export default function ZincumPage() {
  return <LessonPage doc={zincumLesson} />;
}
