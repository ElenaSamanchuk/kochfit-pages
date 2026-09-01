import { LessonPage } from "@/components/site/LessonPage";
import { ferrumLesson } from "@/content/lessons/ferrum";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(ferrumLesson);

/** /ferrum — «Железо» (live kochfit.ru/ferrum, Tilda page32242506) */
export default function FerrumPage() {
  return <LessonPage doc={ferrumLesson} />;
}
