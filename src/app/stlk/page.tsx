import { LessonPage } from "@/components/site/LessonPage";
import { stlkLesson } from "@/content/lessons/stlk";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Мышечная поддержка",
  description: stlkLesson.description,
  path: "/stlk",
});

/** /stlk — урок «Мышечная поддержка» (old-site/page40340320.html) */
export default function StlkPage() {
  return <LessonPage doc={stlkLesson} />;
}
