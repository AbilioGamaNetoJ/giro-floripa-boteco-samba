const VALID_DDD_CODES = new Set([
  "11", "12", "13", "14", "15", "16", "17", "18", "19",
  "21", "22", "24", "27", "28",
  "31", "32", "33", "34", "35", "37", "38",
  "41", "42", "43", "44", "45", "46", "47", "48", "49",
  "51", "53", "54", "55",
  "61", "62", "63", "64", "65", "66", "67", "68", "69",
  "71", "73", "74", "75", "77", "79",
  "81", "82", "83", "84", "85", "86", "87", "88", "89",
  "91", "92", "93", "94", "95", "96", "97", "98", "99",
]);

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

export function formatPhone(value: string): string {
  const digits = digitsOnly(value);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function isValidBrazilianDDD(ddd: string): boolean {
  return VALID_DDD_CODES.has(ddd);
}

export function getPhoneValidationError(value: string): string | null {
  const digits = digitsOnly(value);

  if (digits.length === 0) {
    return "Digite seu WhatsApp com DDD.";
  }

  if (digits.length < 11) {
    return "Digite um WhatsApp completo com DDD e 9 dígitos.";
  }

  const ddd = digits.slice(0, 2);
  if (!isValidBrazilianDDD(ddd)) {
    return "Digite um DDD brasileiro válido.";
  }

  if (digits[2] !== "9") {
    return "WhatsApp deve ser um celular (começar com 9 após o DDD).";
  }

  return null;
}

export function isValidMobile(value: string): boolean {
  return getPhoneValidationError(value) === null;
}

export function toWhatsAppE164(value: string): string {
  const digits = digitsOnly(value);
  return digits.startsWith("55") ? digits : `55${digits}`;
}
