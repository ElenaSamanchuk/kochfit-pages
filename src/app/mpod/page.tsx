import { LessonPage } from "@/components/site/LessonPage";
import { stlkLesson } from "@/content/lessons/stlk";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Мышечная поддержка",
  description: stlkLesson.description,
  path: "/stlk",
  noIndex: true,
  follow: true,
});

/**
 * /mpod — тот же урок, что /stlk (Тильда page41594996 ⊂ page40340320).
 * В next.config для non-export — редирект /mpod → /stlk.
 * Static export (песочница) отдаёт тот же LessonPage, без дублирования контента.
 */
export default function MpodPage() {
  return <LessonPage doc={stlkLesson} />;
}
