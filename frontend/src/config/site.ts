const workspaceName = process.env.NEXT_PUBLIC_WORKSPACE_NAME?.trim();

export const siteConfig = {
  name: "ReverseX AI",
  tagline: "Visual Reverse Engineering Platform",
  workspaceName: workspaceName || "Workspace",
  description:
    "Turn photographs of physical objects into clear, explorable engineering insights.",
  upload: {
    maxPhotos: 12,
    maxFileSizeBytes: 15 * 1024 * 1024,
    acceptedImageTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  },
} as const;
