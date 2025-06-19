// src/utils/getStoreIdFromURL.ts

export function getStoreIdFromURL(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('store') || 'tech-store'; // default fallback
}
