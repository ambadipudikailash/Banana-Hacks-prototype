/** Public API location only. Credentials must stay in the backend. */
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "",
  get isConfigured() {
    return this.baseUrl.length > 0;
  },
} as const;
