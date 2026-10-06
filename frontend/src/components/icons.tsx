import type { ReactNode } from "react";

export type IconName =
  | "logo" | "plus" | "arrow" | "sun" | "moon" | "menu" | "close"
  | "upload" | "object" | "connections" | "cube" | "linkedin" | "github"
  | "x" | "sparkle" | "check" | "file" | "chevron";

const artwork: Record<IconName, ReactNode> = {
  logo: <><path d="M12 2.75 21 8v8l-9 5.25L3 16V8l9-5.25Z" /><path d="m12 6.6 5.6 3.25v4.3L12 17.4l-5.6-3.25v-4.3L12 6.6Z" /><path d="m12 2.75 5.6 3.25v4.3L12 13.6l-5.6-3.3V6L12 2.75Z" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
  moon: <path d="M20.3 15.4A8.5 8.5 0 0 1 8.6 3.7 8.6 8.6 0 1 0 20.3 15.4Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  upload: <><path d="M12 16V4m-5 5 5-5 5 5" /><path d="M5 14v5h14v-5" /></>,
  object: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.4 7.6 7.6 4.3 7.6-4.3M12 12v9" /></>,
  connections: <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><path d="m7.7 7.2 3.2 8.1m5.4-8.1-3.2 8.1M8 6h8" /></>,
  cube: <><path d="m12 2.8 8.3 4.7v9L12 21.2l-8.3-4.7v-9L12 2.8Z" /><path d="m3.9 7.8 8.1 4.7 8.1-4.7M12 12.5v8.2" /></>,
  linkedin: <path d="M6.5 9v9M6.5 6v.1M10.5 18v-5c0-2.2 4.5-2.5 4.5 0v5m0 0v-4.4c0-1.8 3.5-2.2 3.5.3V18" />,
  github: <path d="M9 19c-4.4 1.4-4.4-2.5-6.2-3m12.4 6v-3.1a2.7 2.7 0 0 0-.8-2.1c2.7-.3 5.6-1.3 5.6-6a4.7 4.7 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.8 11.8 0 0 0-6.2 0C6.6 4.1 5.6 4.4 5.6 4.4a4.3 4.3 0 0 0-.1 3.2 4.7 4.7 0 0 0-1.3 3.2c0 4.7 2.9 5.7 5.6 6a2.7 2.7 0 0 0-.8 2.1V22" />,
  x: <path d="m5 4 14 16M19 4 5 20" />,
  sparkle: <><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" /><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" /></>,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  file: <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5M9 13h6m-6 4h6" />,
  chevron: <path d="m7 10 5 5 5-5" />,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.8,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      {artwork[name]}
    </svg>
  );
}
