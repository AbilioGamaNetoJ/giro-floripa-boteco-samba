export const HOUSE_WHATSAPP = "5548992056185";

export function reservationLink(name: string, code: string): string {
  const text = [
    "Olá! Ganhei 10% na Roleta Premiada do Giro Floripa.",
    `Nome: ${name}`,
    `Cupom: ${code}`,
    "Quero reservar uma mesa.",
  ].join("\n");

  return `https://wa.me/${HOUSE_WHATSAPP}?text=${encodeURIComponent(text)}`;
}
