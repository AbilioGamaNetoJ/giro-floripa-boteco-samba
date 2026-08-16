const CLAIM_STORAGE_KEY = "giro-floripa-claim";
const SPIN_STORAGE_KEY = "giro-floripa-spin";

export type ClaimRecord = {
  name: string;
  whatsapp: string;
  code: string;
  claimedAt: string;
};

export type SpinRecord = {
  prizeId: string;
  spunAt: string;
};

function readStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function readClaim(): ClaimRecord | null {
  return readStorage<ClaimRecord>(CLAIM_STORAGE_KEY);
}

export function writeClaim(claim: ClaimRecord): void {
  window.localStorage.setItem(CLAIM_STORAGE_KEY, JSON.stringify(claim));
}

export function readSpin(): SpinRecord | null {
  return readStorage<SpinRecord>(SPIN_STORAGE_KEY);
}

export function writeSpin(spin: SpinRecord): void {
  window.localStorage.setItem(SPIN_STORAGE_KEY, JSON.stringify(spin));
}
