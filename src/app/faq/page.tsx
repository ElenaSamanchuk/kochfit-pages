import { LessonPage } from "@/components/site/LessonPage";
import { faqLesson } from "@/content/lessons/faq";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(faqLesson);

/** /faq — «ТЕЙПИРОВАНИЕ: ЧТО НУЖНО ЗНАТЬ» (live kochfit.ru/faq, Tilda page22998695) */
export default function FaqPage() {
  return <LessonPage doc={faqLesson} />;
}
