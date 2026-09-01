"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isNavLinkActive } from "@/lib/nav-active";

type Variant = "hero" | "light";

const styles: Record<Variant, { base: string; active: string }> = {
  hero: {
    base: "whitespace-nowrap text-white/75 transition hover:text-white",
    active: "whitespace-nowrap font-bold text-white transition",
  },
  light: {
    base: "py-3 transition hover:text-accent",
    active: "py-3 font-semibold text-accent transition",
  },
};

export function ActiveNavLink({
  href,
  children,
  variant,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant: Variant;
  className?: string;
}) {
  const pathname = usePathname();
  const active = isNavLinkActive(href, pathname);
  const variantStyles = styles[variant];

  return (
    <Link
      href={href}
      className={`${active ? variantStyles.active : variantStyles.base} ${className}`.trim()}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
