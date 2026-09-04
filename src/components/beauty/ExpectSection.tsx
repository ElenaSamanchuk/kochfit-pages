import { ExpectCourseSection } from "@/components/site/ExpectCourseSection";

/** «Что вас ждет на курсе» страницы «Красота и здоровье» — Figma 2031:2534 */
export function ExpectSection() {
  return (
    <ExpectCourseSection
      figmaNode="2031:2534"
      imageDir="beauty-health"
      steps={[
        {
          title: "1 шаг",
          text: "Купите тариф, получите доступ к личному кабинету",
        },
        {
          title: "2 шаг",
          text: "Занимайтесь от 15 до 90 минут в день, в зависимости от вашего уровня подготовки",
        },
        {
          title: "3 шаг",
          text: (
            <>
              {"Заходите с телефона "}
              <br aria-hidden />
              или ноутбука в удобное время
            </>
          ),
        },
      ]}
      chipsRow1={[
        { icon: "imgContainer3.svg", text: "Личный кабинет" },
        { icon: "imgContainer3.svg", text: "Мобильное приложение" },
        {
          icon: "imgContainer3.svg",
          text: "Тренировки от 15 до 90 минут",
          mobileText: "Тренировки 15–90 мин",
        },
      ]}
      chipsRow2={[
        {
          icon: "imgContainer2.svg",
          text: "Тренируйся дома, в зале, в поездке",
          mobileText: "Дома, зал, поездка",
          hideOnMobile: true,
        },
        {
          icon: "imgContainer3.svg",
          text: "Лекции от психолога, нутрициолога, гинеколога",
          mobileText: "Лекции экспертов",
        },
      ]}
    />
  );
}
