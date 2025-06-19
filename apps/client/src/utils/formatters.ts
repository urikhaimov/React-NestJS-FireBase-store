/**
 * Format credit card number with spaces: "1234123412341234" -> "1234 1234 1234 1234"
 */



/**
 * Format credit card number:
 * - Visa, MasterCard: "1234 5678 9012 3456"
 * - Amex: "1234 567890 12345"
 */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '');

  // American Express: starts with 34 or 37, formatted 4-6-5
  if (/^3[47]/.test(digits)) {
    return digits
      .slice(0, 15)
      .replace(/^(\d{0,4})(\d{0,6})(\d{0,5})/, (_, g1, g2, g3) =>
        [g1, g2, g3].filter(Boolean).join(' ')
      );
  }

  // Visa, MasterCard, others: format as 4-4-4-4
  return digits
    .slice(0, 16)
    .replace(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/, (_, g1, g2, g3, g4) =>
      [g1, g2, g3, g4].filter(Boolean).join(' ')
    );
}
/**
 * Format expiry: "MMYY" or "MM/YY" (autoinsert slash)
 */
// utils/formatters.ts

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);

  // No digits
  if (digits.length === 0) return '';

  // 1 digit – just show it
  if (digits.length === 1) {
    return digits;
  }

  // First two digits (month)
  const month = digits.slice(0, 2);

  // Enforce MM: only allow 01-12
  if (!/^(0[1-9]|1[0-2])$/.test(month)) {
    return month[0]; // fallback to first digit only
  }

  // Format MM/YY
  if (digits.length <= 2) {
    return month;
  }

  const year = digits.slice(2);
  return `${month}/${year}`;
}

/**
 * Normalize CVC (3 or 4 digits max)
 */
export function formatCVC(value: string): string {
  return value.replace(/\D/g, '').slice(0, 4);
}

export function formatZip(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
}
