import { LessonPage } from "@/components/site/LessonPage";
import { tapingcrestLesson } from "@/content/lessons/tapingcrest";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(tapingcrestLesson);

/** /tapingcrest — ««Холка» или «Вдовий горбик».» (live kochfit.ru/tapingcrest, Tilda page23690082) */
export default function TapingcrestPage() {
  return <LessonPage doc={tapingcrestLesson} />;
}
