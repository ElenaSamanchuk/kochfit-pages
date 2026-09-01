import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/content/blog";
import {
  getAllProsePaths,
  getSitemapLessonPaths,
} from "@/content/tilda-dynamic";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

const publicRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/community", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/e_mtd", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/r", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/for_pregnant", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/person", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/journal", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/result", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/equipment", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/basket", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/suport", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/work", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/year-results", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/sale", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/taplink", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/info_referral", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/care", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/oferta", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/part_oferta", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/consent", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/data-consent", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const push = (
    url: string,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: number,
  ) => {
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({ url, changeFrequency, priority });
  };

  for (const r of publicRoutes) {
    push(
      r.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${r.path}`,
      r.changeFrequency,
      r.priority,
    );
  }

  for (const p of getAllBlogPosts()) {
    push(`${SITE_URL}/blog/${p.id}`, "monthly", 0.5);
  }

  for (const p of getSitemapLessonPaths()) {
    push(`${SITE_URL}/${p}`, "monthly", 0.5);
  }

  for (const p of getAllProsePaths()) {
    push(`${SITE_URL}/${p}`, "monthly", p.includes("/") ? 0.4 : 0.5);
  }

  return entries;
}
