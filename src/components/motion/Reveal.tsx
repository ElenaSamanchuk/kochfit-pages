import type { ReactNode } from "react";

type RevealVariant = "up" | "fade" | "scale" | "left" | "right";

type Props = {
  children: ReactNode;
  className?: string;
  /** Canonical: `up` (fade + slight rise). `fade` = opacity only. Other names alias to `up`. */
  variant?: RevealVariant;
  as?: "div" | "section" | "article";
};

function resolveVariant(variant: RevealVariant): "up" | "fade" {
  return variant === "fade" ? "fade" : "up";
}

/** Обёртка для появления при скролле (работает с MotionRoot) */
export function Reveal({
  children,
  className = "",
  variant = "up",
  as: Tag = "div",
}: Props) {
  return (
    <Tag data-reveal={resolveVariant(variant)} className={className}>
      {children}
    </Tag>
  );
}
