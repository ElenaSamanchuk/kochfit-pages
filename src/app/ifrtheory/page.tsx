import { LessonPage } from "@/components/site/LessonPage";
import { ifrtheoryLesson } from "@/content/lessons/ifrtheory";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(ifrtheoryLesson);

/** /ifrtheory — «МФР теория» (live kochfit.ru/ifrtheory, Tilda page23203985) */
export default function IfrtheoryPage() {
  return <LessonPage doc={ifrtheoryLesson} />;
}
