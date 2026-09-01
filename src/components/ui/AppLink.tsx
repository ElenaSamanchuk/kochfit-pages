import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { isInternalHref, newTabProps } from "@/lib/link-target";

type Props = {
  href: string;
  className?: string;
  style?: ComponentProps<"a">["style"];
  children: ReactNode;
  "aria-label"?: string;
  "data-figma-node"?: string;
  onClick?: ComponentProps<"a">["onClick"];
  tabIndex?: number;
};

/**
 * Внутренние пути — next/link (текущая вкладка).
 * Якоря / mailto / tel — `<a>` без новой вкладки.
 * Внешние (другие домены, tg://) — `target="_blank"` + `rel="noopener noreferrer"`.
 */
export function AppLink({ href, className, style, children, ...rest }: Props) {
  if (isInternalHref(href)) {
    return (
      <Link href={href} className={className} style={style} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={className}
      style={style}
      {...rest}
      {...newTabProps(href)}
    >
      {children}
    </a>
  );
}
