/** Shared site header tokens — fixed bar + spacer for inner pages */

export const siteHeaderZ = "z-30";

/** SimpleHeader inner row height (excluding safe-area padding) */
export const simpleHeaderBarClass = "h-[64px]";

/** Flow spacer so fixed SimpleHeader does not overlap main content */
export const simpleHeaderSpacerClass =
  "h-[calc(64px+env(safe-area-inset-top,0px))] shrink-0";
