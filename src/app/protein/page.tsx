import { LessonPage } from "@/components/site/LessonPage";
import { proteinLesson } from "@/content/lessons/protein";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(proteinLesson);

/** /protein — «Протеин» (live kochfit.ru/protein, Tilda page32242865) */
export default function ProteinPage() {
  return <LessonPage doc={proteinLesson} />;
}
