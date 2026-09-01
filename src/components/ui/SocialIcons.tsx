import { assetPath } from "@/lib/asset-path";

const img = (name: string) => assetPath(`/images/shared/footer/${name}`);

/** Figma 442:11737 — native 120w @4×, sizes = ширина файла (как мостик InsideCourse). */
const FOOTER_SOCIAL_BUST = "v=footer-social-native-120";
export const footerSocialWebp = (stem: string, width: number) =>
  `${assetPath(`/images/shared/footer/${stem}-${width}.webp`)}?${FOOTER_SOCIAL_BUST}`;
export const footerSocialSrcSet = (stem: string, width: number) =>
  `${footerSocialWebp(stem, width)} ${width}w`;
/** Не CSS-бокс 30/34px — иначе srcset берёт мелкий кандидат. */
export const footerSocialSizes = "120px";

export const footerSocialIcons = {
  telegram: { stem: "imgSocialTelegram", width: 120 },
  youtube: { stem: "imgSocialYoutube", width: 120 },
  instagram: { stem: "imgSocialInstagram", width: 120 },
  vk: { stem: "imgSocialVk", width: 120 },
  email: { stem: "imgSocialEmail", width: 120 },
  asterisk: "imgFaSolidAsterisk.svg",
} as const;

/** Иконка для drawer-меню — currentColor через CSS mask (те же SVG, что в футере) */
export function MenuSocialIcon({ asset }: { asset: string }) {
  return (
    <span
      className="block size-[27px] shrink-0 bg-current"
      style={{
        maskImage: `url("${img(asset)}")`,
        WebkitMaskImage: `url("${img(asset)}")`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "27px 27px",
        WebkitMaskSize: "27px 27px",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
      aria-hidden
    />
  );
}

/** Drawer-меню — SVG-маска (отдельно от растрового футера). */
export const menuSocialIconAssets: Record<
  "Instagram" | "Telegram" | "YouTube" | "ВКонтакте",
  string
> = {
  Instagram: "imgGroup5.svg",
  Telegram: "imgGroup1.svg",
  YouTube: "imgGroup3.svg",
  "ВКонтакте": "imgEntypoSocialVkWithCircle.svg",
};
