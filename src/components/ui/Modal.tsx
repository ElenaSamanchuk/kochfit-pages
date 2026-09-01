"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

const subscribeNoop = () => () => {};

type ModalAlign = "center" | "bottom";

export type ModalProps = {
  /** Открыт ли попап (false запускает exit-анимацию, unmount — после неё) */
  open: boolean;
  onClose: () => void;
  /** После завершения exit-анимации (для conditional render родителя) */
  onClosed?: () => void;
  /** aria-label диалога */
  ariaLabel: string;
  children: ReactNode;
  /** Классы панели (белая карточка / контент) — без max-h и overflow-y */
  panelClassName?: string;
  /** Классы оверлея (фон + scroll-контейнер) */
  overlayClassName?: string;
  align?: ModalAlign;
  zIndexClass?: string;
  closeOnBackdrop?: boolean;
};

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPadding = document.body.style.paddingRight;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) {
      document.body.style.paddingRight = `${scrollbar}px`;
    }

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.paddingRight = prevBodyPadding;
    };
  }, [locked]);
}

/**
 * Общий попап: portal в body, затемнённый backdrop, body scroll lock,
 * прокрутка длинного контента на оверлее (не внутри карточки), fade + scale анимации.
 */
export function Modal({
  open,
  onClose,
  onClosed,
  ariaLabel,
  children,
  panelClassName = "",
  overlayClassName = "bg-[rgba(60,60,66,0.4)]",
  align = "center",
  zIndexClass = "z-[60]",
  closeOnBackdrop = true,
}: ModalProps) {
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [render, setRender] = useState(open);
  const [exiting, setExiting] = useState(false);
  const frozenChildren = useRef(children);

  if (open) {
    frozenChildren.current = children;
  }

  useEffect(() => {
    if (open) {
      setRender(true);
      setExiting(false);
    } else if (render) {
      setExiting(true);
    }
  }, [open, render]);

  useBodyScrollLock(render);

  useEffect(() => {
    if (!render) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [render, onClose]);

  const onOverlayAnimEnd = useCallback(
    (e: React.AnimationEvent<HTMLDivElement>) => {
      if (!exiting || e.target !== e.currentTarget) return;
      setRender(false);
      setExiting(false);
      onClosed?.();
    },
    [exiting, onClosed],
  );

  const onBackdropClick = useCallback(() => {
    if (closeOnBackdrop) onClose();
  }, [closeOnBackdrop, onClose]);

  if (!mounted || !render) return null;

  const alignClass =
    align === "bottom"
      ? "items-end justify-center p-0 sm:items-center sm:p-4"
      : "items-center justify-center p-4";

  return createPortal(
    <div
      role="presentation"
      className={`fixed inset-0 overflow-y-auto ${zIndexClass} ${
        exiting ? "animate-fade-out" : "animate-fade-in"
      } ${overlayClassName}`}
      onClick={onBackdropClick}
      onAnimationEnd={onOverlayAnimEnd}
    >
      <div className={`flex min-h-full ${alignClass}`}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className={`relative mx-auto w-full ${
            exiting ? "animate-pop-out" : "animate-pop-in"
          } ${panelClassName}`}
          onClick={(e) => e.stopPropagation()}
        >
          {frozenChildren.current}
        </div>
      </div>
    </div>,
    document.body,
  );
}
