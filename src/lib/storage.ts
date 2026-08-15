const STORAGE_KEY = "giro-floripa-claim";

export type ClaimRecord = {
  name: string;
  whatsapp: string;
  code: string;
  claimedAt: string;
};

// Fase 2: persistir no servidor (Worker + D1). localStorage não impede
// segundo cupom se o cliente limpar o navegador. Ver o plano do projeto.
export function readClaim(): ClaimRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ClaimRecord;
  } catch {
    return null;
  }
}

export function writeClaim(claim: ClaimRecord): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(claim));
}
