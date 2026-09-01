import { Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";

/** Вариативный Nunito Sans с осями wdth/YTLC — как в макете Figma */
export const nunitoSans = Nunito_Sans({
  subsets: ["latin", "cyrillic"],
  axes: ["opsz", "wdth", "YTLC"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const evolventa = localFont({
  src: [
    {
      path: "../../public/fonts/evolventa/Evolventa-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/evolventa/Evolventa-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-evolventa",
  display: "swap",
  adjustFontFallback: false,
});
