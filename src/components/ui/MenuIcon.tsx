/** Бургер-иконка меню — inline SVG для чёткого масштабирования. */
export function MenuIcon({ className = "size-full text-[#4B4D57]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M2.625 6.125H18.375" stroke="currentColor" strokeLinecap="round" />
      <path d="M2.625 10.5H18.375" stroke="currentColor" strokeLinecap="round" />
      <path d="M2.625 14.875H18.375" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}
