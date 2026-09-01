import { assetPath } from "@/lib/asset-path";

/** Vuesax bold profile — глиф кнопки ЛК 2031:2192 (страница «Красота и здоровье»). */
export function ProfileIcon({ className = "size-full" }: { className?: string }) {
  return (
    <span className={`relative block overflow-clip ${className}`} aria-hidden>
      <img
        alt=""
        src={assetPath("/images/shared/profile-lk.svg")}
        className="size-full"
        width={21}
        height={21}
      />
    </span>
  );
}
