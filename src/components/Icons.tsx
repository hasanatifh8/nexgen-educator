import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconBook = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5v-2Z" /><path d="M8 7h8M8 11h6" /></svg>
);
export const IconTimer = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5M9 2h6" /></svg>
);
export const IconBadge = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="9" r="6" /><path d="m9 14.5-2 7 5-3 5 3-2-7" /><path d="m9.5 9 1.8 1.8L14.5 7.5" /></svg>
);
export const IconCheck = (p: IconProps) => (
  <svg {...base} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const IconX = (p: IconProps) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconArrowRight = (p: IconProps) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconClock = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const IconSignal = (p: IconProps) => (
  <svg {...base} {...p}><path d="M5 20v-4M10 20v-8M15 20V8M20 20V4" /></svg>
);
export const IconShield = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const IconDownload = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
);
export const IconMenu = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IconSparkles = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></svg>
);
export const IconBuilding = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 21V5l8-3 8 3v16M4 21h16M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4" /></svg>
);
export const IconRefresh = (p: IconProps) => (
  <svg {...base} {...p}><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" /></svg>
);
