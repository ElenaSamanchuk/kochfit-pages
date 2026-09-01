import { LessonPage } from "@/components/site/LessonPage";
import { teipirovaniehalusvalgusLesson } from "@/content/lessons/teipirovaniehalusvalgus";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(teipirovaniehalusvalgusLesson);

/** /teipirovaniehalusvalgus — «ТЕЙПИРОВАНИЕ ХАЛЮС ВАЛЬГУС И ГОЛЕНОСТОПА» (live kochfit.ru/teipirovaniehalusvalgus, Tilda page22238273) */
export default function TeipirovaniehalusvalgusPage() {
  return <LessonPage doc={teipirovaniehalusvalgusLesson} />;
}
