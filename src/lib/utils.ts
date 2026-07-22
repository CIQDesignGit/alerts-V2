import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Quiet focus for filter fields / selects — neutral border + soft ring.
 * Avoids brand-purple borders that fight active filter chips.
 */
export const fieldFocusClass =
  "outline-none transition-[border-color,box-shadow] focus-visible:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-900/10";

/** Same idea for compact icon / outline controls in the filter bar */
export const controlFocusClass =
  "outline-none transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-neutral-900/10 focus-visible:ring-offset-1 focus-visible:ring-offset-background";

