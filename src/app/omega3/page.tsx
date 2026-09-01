import { LessonPage } from "@/components/site/LessonPage";
import { omega3Lesson } from "@/content/lessons/omega3";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(omega3Lesson);

/** /omega3 — «Омега–3» (live kochfit.ru/omega3, Tilda page32236661) */
export default function Omega3Page() {
  return <LessonPage doc={omega3Lesson} />;
}
