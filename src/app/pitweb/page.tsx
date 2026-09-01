import { LessonPage } from "@/components/site/LessonPage";
import { pitwebLesson } from "@/content/lessons/pitweb";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(pitwebLesson);

/** /pitweb — «Психолог Юлия Жарова» (live kochfit.ru/pitweb, Tilda page39500136) */
export default function PitwebPage() {
  return <LessonPage doc={pitwebLesson} />;
}
