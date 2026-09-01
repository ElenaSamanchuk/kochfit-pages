import { PersonalWorkPage } from "@/components/basket/PersonalWorkPage";
import { PageShell } from "@/components/site/PageShell";
import { personalWorkContent as c } from "@/content/personal-work";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: c.title,
  description: c.description,
  path: "/basket",
});

/** Лендинг «Персональная работа» (старый /basket, page22983826). Оплата — попап на странице */
export default function BasketPage() {
  return (
    <PageShell>
      <PersonalWorkPage />
    </PageShell>
  );
}
