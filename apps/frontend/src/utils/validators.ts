// Email validator
export function validateEmail(value: string): true | string {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(value) ? true : 'Invalid email address';
}

// ZIP code validator (US-style 5-digit or 5+4)
export function validateZip(value: string): true | string {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(value.trim()) ? true : 'Invalid ZIP code format';
}


// CVC validator (3 or 4 digits)
export function validateCVC(value: string): true | string {
  const cvcRegex = /^[0-9]{3,4}$/;
  return cvcRegex.test(value) ? true : 'CVC must be 3 or 4 digits';
}
export function validateLuhn(value: string): true | string {
  const digits = value.replace(/\D/g, '').split('').reverse().map(Number);

  const sum = digits.reduce((acc, digit, idx) => {
    if (idx % 2 === 1) {
      const double = digit * 2;
      return acc + (double > 9 ? double - 9 : double);
    }
    return acc + digit;
  }, 0);

  return sum % 10 === 0 ? true : 'Invalid card number (Luhn check failed)';
}
// utils/validators.ts

export function validateExpiry(value: string): true | string {
  const [month, year] = value.split('/');

  if (!month || !year || !/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) {
    return 'Invalid expiry format';
  }

  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (monthNum < 1 || monthNum > 12) {
    return 'Invalid month';
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 0-indexed
  const currentYear = now.getFullYear() % 100; // last two digits

  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return 'Card has expired';
  }

  return true;
}

