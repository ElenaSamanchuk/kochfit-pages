import blogPostsJson from "@/content/migrated/blog-posts.json";

export type BlogPost = {
  id: number;
  title: string;
  description: string;
  paragraphs: readonly string[];
  /** Kinescope-embed уроков (видеохостинг, нативной замены iframe нет) */
  videos?: readonly string[];
  ogImage?: string;
};

const posts = blogPostsJson as Record<string, BlogPost>;

function normalizePosts(raw: Record<string, BlogPost>): Record<string, BlogPost> {
  const out: Record<string, BlogPost> = {};
  for (const [key, post] of Object.entries(raw)) {
    const id = key.replace(/\/$/, "");
    if (!/^\d+$/.test(id) || !post?.title) continue;
    out[id] = { ...post, id: Number(id) };
  }
  return out;
}

const blogPosts = normalizePosts(posts);

export function getBlogPost(id: string | number): BlogPost | null {
  return blogPosts[String(id)] ?? null;
}

export function getAllBlogPosts(): BlogPost[] {
  return Object.values(blogPosts).sort((a, b) => a.id - b.id);
}

export function getBlogIds(): string[] {
  return Object.keys(blogPosts);
}

/** Подбор статьи блога по заголовку карточки журнала */
export function findBlogPostByTitle(title: string): BlogPost | null {
  const normalized = title.trim().toLowerCase();
  const exact = getAllBlogPosts().find(
    (p) => p.title.trim().toLowerCase() === normalized,
  );
  if (exact) return exact;
  return (
    getAllBlogPosts().find(
      (p) =>
        p.title.toLowerCase().includes(normalized.slice(0, 24)) ||
        normalized.includes(p.title.toLowerCase().slice(0, 24)),
    ) ?? null
  );
}
