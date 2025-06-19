export function isValidLuhn(cardNumber: string): boolean {
  const clean = cardNumber.replace(/\s+/g, ''); // remove spaces
  let sum = 0;
  let shouldDouble = false;

  // Loop right to left
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}
