// src/utils/getHomePathForRole.ts

export function getHomePathForRole(role: string): string {
  if (['admin', 'superadmin'].includes(role)) return '/admin';
  return '/';
}
