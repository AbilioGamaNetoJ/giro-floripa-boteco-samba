const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCouponCode(prefix: string): string {
  const chars = Array.from({ length: 4 }, () => {
    const index = Math.floor(Math.random() * ALPHABET.length);
    return ALPHABET[index];
  }).join("");

  return `${prefix}-${chars}`;
}
