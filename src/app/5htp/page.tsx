import { LessonPage } from "@/components/site/LessonPage";
import { lesson5htp } from "@/content/lessons/5htp";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(lesson5htp);

/** /5htp — «5–НТР» (live kochfit.ru/5htp, Tilda page32243061) */
export default function Page5htp() {
  return <LessonPage doc={lesson5htp} />;
}
