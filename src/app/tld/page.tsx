import { LessonPage } from "@/components/site/LessonPage";
import { tldLesson } from "@/content/lessons/tld";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(tldLesson);

/** /tld — «ТЕЙПИРОВАНИЕ. ЛИМФОДРЕНАЖ ЖИВОТА» (live kochfit.ru/tld, Tilda page20761641) */
export default function TldPage() {
  return <LessonPage doc={tldLesson} />;
}
