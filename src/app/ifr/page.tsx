import { LessonPage } from "@/components/site/LessonPage";
import { ifrLesson } from "@/content/lessons/ifr";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(ifrLesson);

/** /ifr — «2. МФР» (live kochfit.ru/ifr, Tilda page23285224) */
export default function IfrPage() {
  return <LessonPage doc={ifrLesson} />;
}
