import { LessonPage } from "@/components/site/LessonPage";
import { massageLesson } from "@/content/lessons/massage";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(massageLesson);

/** /massage — «Улучшаем работу ЖКТ через массаж живота» (live kochfit.ru/massage, Tilda page28757455) */
export default function MassagePage() {
  return <LessonPage doc={massageLesson} />;
}
