// src/utils/path.ts
export const withBase = (p: string) =>
  `${import.meta.env.BASE_URL}${p.replace(/^\/+/, '')}`;
