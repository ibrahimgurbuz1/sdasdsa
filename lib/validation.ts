/**
 * Input validation and sanitization utilities
 */

export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .substring(0, 500); // Limit length
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[0-9\s\-\+\(\)]{7,20}$/;
  return phoneRegex.test(phone);
}

export function onlyDigits(input: string, maxLength = 11): string {
  return input.replace(/\D/g, '').slice(0, maxLength);
}

export function formatPhoneInput(input: string): string {
  const digits = onlyDigits(input, 11);

  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  if (digits.length <= 9) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;

  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
}

export function sanitizeNumber(input: any): number | null {
  const num = Number(input);
  return isNaN(num) ? null : num;
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) {
    return { valid: false, error: 'Şifre en az 6 karakter olmalıdır' };
  }
  return { valid: true };
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeString(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  });
  return sanitized;
}
