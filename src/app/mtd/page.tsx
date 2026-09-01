import { LessonPage } from "@/components/site/LessonPage";
import { mtdLesson } from "@/content/lessons/mtd";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(mtdLesson);

/** /mtd — «МТД /ДЫХАНИЕ/ЖИВОТ» (live kochfit.ru/mtd, Tilda page23287193) */
export default function MtdPage() {
  return <LessonPage doc={mtdLesson} />;
}
