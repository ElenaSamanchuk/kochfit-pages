import type { ReactNode } from "react";
import { Switch } from "@/components/ui/Switch";

/**
 * Карточка с переключателем Switch (Figma 2262:2643) сверху, заголовок и текст ниже.
 */
export function FeatureToggleCard({
  title,
  text,
  className,
}: {
  title: ReactNode;
  text: ReactNode;
  className?: string;
}) {
  return (
    <article className={`flex w-full flex-col gap-2 xl:gap-3${className ? ` ${className}` : ""}`}>
      <Switch />
      <div className="flex w-full flex-col gap-0.5 leading-[normal]">
        <p className="text-body font-semibold text-ink">{title}</p>
        <div className="text-small font-normal text-ink-secondary">{text}</div>
      </div>
    </article>
  );
}
