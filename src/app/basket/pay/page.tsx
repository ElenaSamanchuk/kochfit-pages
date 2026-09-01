import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Оплата — персональная работа",
  description: "Переход к оплате персональной работы Kochfit",
  path: "/basket",
  noIndex: true,
  follow: false,
});

/** Fallback URL: редирект на лендинг с открытием попапа оплаты */
export default function BasketPayRedirectPage() {
  redirect("/basket?pay=1");
}
