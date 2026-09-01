import { LessonPage } from "@/components/site/LessonPage";
import { tmtdLesson } from "@/content/lessons/tmtd";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(tmtdLesson);

/** /tmtd — «Тейпирование» (live kochfit.ru/tmtd, Tilda page43125711) */
export default function TmtdPage() {
  return <LessonPage doc={tmtdLesson} />;
}
