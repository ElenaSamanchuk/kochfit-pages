import {
  Children,
  Fragment,
  cloneElement,
  createElement,
  isValidElement,
  type JSX,
  type ReactElement,
  type ReactNode,
} from "react";
import { nbspAfterParticles, russianQuotes, typo } from "@/lib/typography";

export { nbspAfterParticles, russianQuotes, typo };

type TypoElementProps = {
  children?: ReactNode;
  dangerouslySetInnerHTML?: { __html: string };
  "data-no-typo"?: boolean;
};

function processTypoChild(child: ReactNode): ReactNode {
  if (child == null || typeof child === "boolean") return child;
  if (typeof child === "string") return typo(child);
  if (typeof child === "number") return child;

  if (isValidElement(child)) {
    const props = child.props as TypoElementProps;
    if (props["data-no-typo"] || props.dangerouslySetInnerHTML) return child;
    if (props.children == null) return child;
    if (child.type === Fragment) return typoChildren(props.children);
    return cloneElement(
      child as ReactElement<TypoElementProps>,
      {},
      typoChildren(props.children),
    );
  }

  return child;
}

/** Рекурсивно обрабатывает текстовые узлы в React-дереве. */
export function typoChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child) => processTypoChild(child));
}

/** Обёртка-фрагмент: типографика для всего поддерева (страница, секция, client-компонент). */
export function Typo({ children }: { children: ReactNode }) {
  return <>{typoChildren(children)}</>;
}

type TypoTextProps<T extends keyof JSX.IntrinsicElements> = {
  as?: T;
  children: ReactNode;
} & Omit<JSX.IntrinsicElements[T], "children">;

/** Полиморфный текстовый блок с типографикой. */
export function TypoText<T extends keyof JSX.IntrinsicElements = "span">({
  as,
  children,
  ...props
}: TypoTextProps<T>) {
  const tag = (as ?? "span") as keyof JSX.IntrinsicElements;
  return createElement(tag, props, typoChildren(children));
}
