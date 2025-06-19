// utils/formatCardNumber.ts
export function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, '')            // Remove non-digits
    .replace(/(.{4})/g, '$1 ')     // Add space every 4 digits
    .trim();                       // Remove trailing space
}
