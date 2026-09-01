import { LessonPage } from "@/components/site/LessonPage";
import { lecithinLesson } from "@/content/lessons/lecithin";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(lecithinLesson);

/** /lecithin — «Лецитин» (live kochfit.ru/lecithin, Tilda page32242758) */
export default function LecithinPage() {
  return <LessonPage doc={lecithinLesson} />;
}
