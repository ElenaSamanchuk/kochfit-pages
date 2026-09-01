import { assetPath } from "@/lib/asset-path";

/** Градиентная галочка в скруглённом квадрате — Figma imgGroup1321319599 / imgContainer1 */
export function FeatureCheckIcon({ className }: { className?: string }) {
  return (
    <img
      loading="lazy"
      alt=""
      width={18}
      height={18}
      aria-hidden
      className={className ?? "block size-[14px] shrink-0 xl:size-[18px]"}
      src={assetPath("/images/shared/check-circle.svg")}
    />
  );
}
