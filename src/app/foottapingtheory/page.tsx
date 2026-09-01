import { LessonPage } from "@/components/site/LessonPage";
import { foottapingtheoryLesson } from "@/content/lessons/foottapingtheory";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(foottapingtheoryLesson);

/** /foottapingtheory — «Стопа, теория + тейпирование» (live kochfit.ru/foottapingtheory, Tilda page23205504) */
export default function FoottapingtheoryPage() {
  return <LessonPage doc={foottapingtheoryLesson} />;
}
