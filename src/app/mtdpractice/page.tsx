import { LessonPage } from "@/components/site/LessonPage";
import { mtdpracticeLesson } from "@/content/lessons/mtdpractice";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(mtdpracticeLesson);

/** /mtdpractice — «МТД/Дыхание/Живот практика» (live kochfit.ru/mtdpractice, Tilda page25778439) */
export default function MtdpracticePage() {
  return <LessonPage doc={mtdpracticeLesson} />;
}
