import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonPage } from "@/components/site/LessonPage";
import { LessonVideos } from "@/components/site/LessonVideos";
import { PageShell } from "@/components/site/PageShell";
import { getAllBlogPosts, getBlogIds, getBlogPost } from "@/content/blog";
import { getBlogLesson, getBlogLessonIds } from "@/content/lessons/blog";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  const ids = new Set([...getBlogIds(), ...getBlogLessonIds()]);
  return [...ids].map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lesson = getBlogLesson(id);
  if (lesson) {
    return pageMetadata({
      title: lesson.title,
      description: lesson.description,
      path: `/blog/${id}`,
    });
  }
  const post = getBlogPost(id);
  if (!post) {
    return pageMetadata({
      title: "Статья не найдена",
      description: "Статья блога Kochfit не найдена",
      path: `/blog/${id}`,
      noIndex: true,
      follow: true,
    });
  }
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${id}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const lesson = getBlogLesson(id);
  if (lesson) {
    return <LessonPage doc={lesson} />;
  }

  const post = getBlogPost(id);
  if (!post) notFound();

  const all = getAllBlogPosts();
  const idx = all.findIndex((p) => p.id === post.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <PageShell article>
      <article className="min-w-0 rounded-[24px] bg-white p-[15px] shadow-[var(--shadow-card)] sm:p-[28px] lg:p-[48px]">
        <Link
          href={routes.journal}
          className="text-[13px] font-semibold text-accent transition hover:opacity-80"
        >
          ← Полезный блог
        </Link>
        <h1 className="mt-[16px] font-display text-[28px] font-normal leading-[1.2] text-ink lg:text-[36px]">
          {post.title}
        </h1>
        {post.videos && <LessonVideos videos={post.videos} />}
        <div className="mt-[28px] space-y-[14px] text-[15px] leading-[1.5] sm:leading-[1.65] text-ink-secondary">
          {post.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {(prev || next) && (
          <nav className="mt-[40px] flex flex-col gap-[12px] border-t border-line pt-[24px] sm:flex-row sm:justify-between">
            {prev ? (
              <Link
                href={`/blog/${prev.id}`}
                className="text-[14px] text-accent underline-offset-2 hover:underline"
              >
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/blog/${next.id}`}
                className="text-right text-[14px] text-accent underline-offset-2 hover:underline sm:text-right"
              >
                {next.title} →
              </Link>
            ) : null}
          </nav>
        )}
      </article>
    </PageShell>
  );
}
