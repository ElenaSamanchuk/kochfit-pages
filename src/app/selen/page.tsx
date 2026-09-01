import { LessonPage } from "@/components/site/LessonPage";
import { selenLesson } from "@/content/lessons/selen";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(selenLesson);

/** /selen — «Селен и йод» (live kochfit.ru/selen, Tilda page32241562) */
export default function SelenPage() {
  return <LessonPage doc={selenLesson} />;
}
