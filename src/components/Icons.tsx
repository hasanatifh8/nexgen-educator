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
export const IconLock = (p: IconProps) => (
  <svg {...base} {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);
export const IconLogout = (p: IconProps) => (
  <svg {...base} {...p}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11" /></svg>
);
export const IconPlay = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="m10 8.5 5 3.5-5 3.5v-7Z" /></svg>
);
export const IconLightbulb = (p: IconProps) => (
  <svg {...base} {...p}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" /></svg>
);
export const IconInfo = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
);
export const IconAlert = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 4 2.5 20h19L12 4Z" /><path d="M12 10v4M12 17h.01" /></svg>
);
export const IconLink = (p: IconProps) => (
  <svg {...base} {...p}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>
);
export const IconPencil = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" /><path d="m13.5 6.5 4 4" /></svg>
);
export const IconChevronDown = (p: IconProps) => (
  <svg {...base} {...p}><path d="m6 9 6 6 6-6" /></svg>
);
export const IconImage = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></svg>
);
export const IconUsers = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" /></svg>
);
export const IconPhone = (p: IconProps) => (
  <svg {...base} {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
);
export const IconHome = (p: IconProps) => (
  <svg {...base} {...p}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V10Z" /></svg>
);
export const IconUser = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const IconFile = (p: IconProps) => (
  <svg {...base} {...p}><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
);
export const IconWallet = (p: IconProps) => (
  <svg {...base} {...p}><path d="M3 7a2 2 0 0 1 2-2h13v4" /><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2Z" /><circle cx="16" cy="14.5" r="1.2" /></svg>
);
export const IconGrid = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
);
export const IconNotes = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" /><path d="M15 3v5h5" /><path d="M8 12h8M8 16h5" /></svg>
);
export const IconTag = (p: IconProps) => (
  <svg {...base} {...p}><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>
);
export const IconCalendar = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
);
export const IconBell = (p: IconProps) => (
  <svg {...base} {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8Z" /><path d="M10.3 20a1.9 1.9 0 0 0 3.4 0" /></svg>
);
export const IconEye = (p: IconProps) => (
  <svg {...base} {...p}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const IconEyeOff = (p: IconProps) => (
  <svg {...base} {...p}><path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-2.9 3.9M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.8 9.8 0 0 0 5.4-1.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" /></svg>
);
