import { externalLinks } from "@/content/links";
import { ProfileIcon } from "@/components/ui/ProfileIcon";

/**
 * Круглая кнопка личного кабинета в шапке hero.
 * Figma: страница «красота и здоровье» 2031:2178 → кнопка 2031:2189 (38×38).
 * Градиент как в макете: 126.83° #73A2C6 → #9ABEDB, глиф — белый fill 21px.
 */
export function AccountIconLink({ className = "" }: { className?: string }) {
  return (
    <a
      aria-label="Личный кабинет"
      href={externalLinks.login}
      target="_blank"
      rel="noopener noreferrer"
      data-figma-node="2031:2189"
      className={`relative flex size-[30px] shrink-0 items-center justify-center rounded-[1000px] transition before:absolute before:-inset-[4px] before:content-[''] hover:scale-105 hover:opacity-90 active:scale-95 sm:size-[40px] sm:before:hidden xl:size-[38px] xl:before:-inset-[4px] ${className}`}
      style={{
        backgroundImage: "var(--gradient-primary)",
      }}
    >
      <ProfileIcon className="size-[15px] sm:size-[19px] xl:size-[21px]" />
    </a>
  );
}
