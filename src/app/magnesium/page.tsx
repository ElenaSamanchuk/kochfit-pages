import { LessonPage } from "@/components/site/LessonPage";
import { magnesiumLesson } from "@/content/lessons/magnesium";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(magnesiumLesson);

/** /magnesium — «Магний» (live kochfit.ru/magnesium, Tilda page32241098) */
export default function MagnesiumPage() {
  return <LessonPage doc={magnesiumLesson} />;
}
