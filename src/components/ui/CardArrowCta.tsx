import { assetPath } from "@/lib/asset-path";
import Link from "next/link";

/** Круг со стрелкой — как AuthorSection mobile (bg-surface-blue + imgAuthorArrowMobile). */
const arrowSrc = assetPath("/images/home/imgAuthorArrowMobile.svg");

const baseClass =
  "group/card-arrow absolute bottom-[12px] right-[12px] z-10 block size-[36px] shrink-0 overflow-hidden rounded-full border border-solid border-surface-blue bg-surface-blue transition hover:opacity-90";

type CardArrowCtaProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  /** Extra classes, e.g. `xl:hidden` or `min-[1200px]:hidden` */
  className?: string;
  /**
   * Visual-only arrow when the parent card is already the link/button
   * (avoids nested interactive controls).
   */
  decorative?: boolean;
};

export function CardArrowCta({
  label,
  href,
  onClick,
  className,
  decorative = false,
}: CardArrowCtaProps) {
  const classNames = className ? `${baseClass} ${className}` : baseClass;
  const arrow = (
    <img
      loading="lazy"
      alt=""
      width={36}
      height={36}
      aria-hidden
      className="block size-full transition duration-300 group-hover/card-arrow:translate-x-[2px] group-hover/card-arrow:-translate-y-[2px]"
      src={arrowSrc}
    />
  );

  if (decorative) {
    return (
      <span aria-hidden className={`${classNames} pointer-events-none`}>
        {arrow}
      </span>
    );
  }

  if (href) {
    return (
      <Link href={href} aria-label={label} className={classNames}>
        {arrow}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} onClick={onClick} className={classNames}>
      {arrow}
    </button>
  );
}
