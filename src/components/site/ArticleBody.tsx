import { HubCards } from "@/components/site/HubCards";
import { MediaSlider, type MediaSlide } from "@/components/site/MediaSlider";
import { AppLink } from "@/components/ui/AppLink";
import type { ArticleBlock } from "@/content/tilda-dynamic";
import { typo, typoHtml } from "@/lib/typography";

type MediaBlock = Extract<
  ArticleBlock,
  { t: "img" } | { t: "gallery" } | { t: "kinescope" } | { t: "kinescopeGallery" }
>;
type OtherBlock = Exclude<ArticleBlock, MediaBlock>;

type RenderNode =
  | { key: number; kind: "media"; items: MediaSlide[] }
  | { key: number; kind: "other"; block: OtherBlock };

function isMediaBlock(block: ArticleBlock): block is MediaBlock {
  return (
    block.t === "img" ||
    block.t === "gallery" ||
    block.t === "kinescope" ||
    block.t === "kinescopeGallery"
  );
}

function toSlides(block: MediaBlock, recentImages: readonly string[]): MediaSlide[] {
  switch (block.t) {
    case "img":
      return [{ kind: "image", src: block.src, alt: block.alt, caption: block.caption }];
    case "gallery":
      return block.images.map((im) => ({
        kind: "image" as const,
        src: im.src,
        alt: im.alt,
      }));
    case "kinescope":
      return [{ kind: "video", src: block.src, preview: recentImages.at(-1) }];
    case "kinescopeGallery":
      return block.srcs.map((src, i) => ({
        kind: "video" as const,
        src,
        preview: recentImages[i] ?? recentImages.at(-1),
      }));
    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

/** Подряд идущие фото и kinescope-видео (в любом сочетании) — одна группа. */
function groupBlocks(blocks: readonly ArticleBlock[]): RenderNode[] {
  const nodes: RenderNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    if (!block) break;
    if (isMediaBlock(block)) {
      const items: MediaSlide[] = [];
      const recentImages: string[] = [];
      const key = i;
      while (i < blocks.length) {
        const next = blocks[i];
        if (!next || !isMediaBlock(next)) break;
        items.push(...toSlides(next, recentImages));
        if (next.t === "img") {
          recentImages.length = 0;
          recentImages.push(next.src);
        } else if (next.t === "gallery") {
          recentImages.length = 0;
          recentImages.push(...next.images.map((im) => im.src));
        }
        i += 1;
      }
      nodes.push({ key, kind: "media", items });
      continue;
    }
    nodes.push({ key: i, kind: "other", block });
    i += 1;
  }
  return nodes;
}

function OtherBlockView({ block }: { block: OtherBlock }) {
  switch (block.t) {
    case "h2":
      return (
        <h2 className="pt-[16px] font-display text-[20px] font-normal leading-[1.3] text-ink">
          {typo(block.text)}
        </h2>
      );
    case "p":
      return (
        <p
          className="[&_a]:font-semibold [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-ink"
          dangerouslySetInnerHTML={{ __html: typoHtml(block.html) }}
        />
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          className={`space-y-[8px] pl-[22px] ${
            block.ordered ? "list-decimal" : "list-disc marker:text-accent"
          } [&_strong]:text-ink`}
        >
          {block.items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: typoHtml(item) }} />
          ))}
        </Tag>
      );
    }
    case "video":
      return (
        <AppLink
          href={`https://youtu.be/${block.id}`}
          className="flex items-center gap-[12px] rounded-[16px] bg-surface-blue px-[20px] py-[16px] font-semibold text-ink transition hover:opacity-90"
        >
          <span
            className="flex size-[40px] shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
              <path
                d="M13 6.27a2 2 0 0 1 0 3.46L3 15.5A2 2 0 0 1 0 13.77V2.23A2 2 0 0 1 3 .5l10 5.77Z"
                fill="currentColor"
              />
            </svg>
          </span>
          Смотреть видео на YouTube
        </AppLink>
      );
    case "cta": {
      const cls =
        "inline-flex min-h-[48px] items-center justify-center rounded-[14px] px-[28px] font-display text-[15px] font-bold text-white transition hover:opacity-90";
      const style = { backgroundImage: "var(--gradient-primary)" } as const;
      return (
        <AppLink href={block.href} className={cls} style={style}>
          {block.label}
        </AppLink>
      );
    }
    case "cards":
      return <HubCards items={block.items} />;
    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

/**
 * Рендер блоков статьи блога (/st1–/st14) и уроков.
 * Подряд идущие img/gallery/kinescope склеиваются в MediaSlider.
 */
export function ArticleBody({ blocks }: { blocks: readonly ArticleBlock[] }) {
  const nodes = groupBlocks(blocks);

  return (
    <div className="mt-[28px] min-w-0 space-y-[16px] text-[15px] leading-[1.5] sm:leading-[1.65] text-ink-secondary [&_img]:max-w-full [&_img]:h-auto">
      {nodes.map((node) =>
        node.kind === "media" ? (
          <MediaSlider key={node.key} items={node.items} />
        ) : (
          <OtherBlockView key={node.key} block={node.block} />
        ),
      )}
    </div>
  );
}
