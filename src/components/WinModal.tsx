import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { prize } from "../data/prize";
import { reservationLink } from "../lib/whatsapp";
import { RedeemForm } from "./RedeemForm";

type Step = "prize" | "form" | "code";

type Props = {
  open: boolean;
  initialStep?: Step;
  code?: string;
  name?: string;
  onClose: () => void;
  onRedeem: (name: string, whatsapp: string) => void;
};

export function WinModal({
  open,
  initialStep = "prize",
  code,
  name,
  onClose,
  onRedeem,
}: Props) {
  const [step, setStep] = useState<Step>(initialStep);
  const [copied, setCopied] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) setStep(initialStep);
  }, [open, initialStep]);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#2A1810]/65 p-4 backdrop-blur-sm sm:p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="win-title"
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/70 bg-giro-paper px-5 pt-9 pb-6 shadow-[0_24px_70px_rgba(42,24,16,0.4)] sm:px-7"
      >
        <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#8b1e1e_0_20%,#e3a008_20%_40%,#c4452a_40%_60%,#e07a2f_60%_80%,#8b1e1e_80%)]" aria-hidden="true" />
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-giro-red text-2xl leading-none font-bold text-white shadow-sm transition hover:bg-[#741722] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-giro-ink"
          aria-label="Fechar"
        >
          ×
        </button>

        {step === "prize" ? (
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-15 w-15 items-center justify-center rounded-full border-4 border-white bg-giro-gold text-2xl font-black text-giro-ink shadow-md">
              %
            </div>
            <h2 id="win-title" className="font-display text-4xl leading-none text-giro-red">
              Você ganhou!
            </h2>
            <p className="mt-4 rounded-full border border-giro-gold/35 bg-[#f5e5c7] px-5 py-2 text-base font-extrabold text-giro-ink">
              {prize.title}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-giro-ink/80">{prize.description}</p>
            <button
              type="button"
              onClick={() => setStep("form")}
              className="mt-7 min-h-13 w-full rounded-full bg-giro-orange px-5 py-3 text-base font-extrabold text-white shadow-[0_5px_0_#9a4a12] transition duration-200 hover:-translate-y-0.5 hover:bg-[#c96520] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-giro-ink active:translate-y-0 active:shadow-[0_2px_0_#9a4a12]"
            >
              Resgatar prêmio
            </button>
          </div>
        ) : null}

        {step === "form" ? (
          <div>
            <h2 id="win-title" className="mb-2 text-center font-display text-3xl leading-none text-giro-red">
              Resgatar prêmio
            </h2>
            <p className="mb-6 text-center text-sm leading-relaxed text-giro-ink/80">
              Preencha para gerar seu cupom de uso no balcão.
            </p>
            <RedeemForm onSubmit={onRedeem} />
          </div>
        ) : null}

        {step === "code" && code ? (
          <div className="flex flex-col items-center text-center">
            <h2 id="win-title" className="font-display text-4xl leading-none text-giro-red">
              Seu cupom
            </h2>
            <p className="mt-2 text-sm text-giro-ink/80">Mostre este código no balcão do Giro.</p>
            <div className="mt-5 w-full rounded-2xl border-2 border-dashed border-giro-gold bg-[#fff8e8] px-4 py-5">
              <p className="text-xs font-extrabold tracking-[0.18em] text-giro-ink/65 uppercase">
                Seu cupom de brinde
              </p>
              <p className="mt-2 text-4xl font-extrabold tracking-[0.08em] text-giro-red">{code}</p>
              <button
                type="button"
                onClick={copyCode}
                className="mt-4 min-h-10 rounded-full border border-giro-ink/25 bg-white px-4 py-2 text-sm font-bold text-giro-ink transition hover:border-giro-terracotta hover:text-giro-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-giro-ink"
              >
                {copied ? "Copiado!" : "Copiar código"}
              </button>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-giro-ink/80">
              Válido na primeira visita. Peça para aplicar o desconto na finalização da conta.
            </p>
            <a
              href={reservationLink(name ?? "", code)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex min-h-13 w-full items-center justify-center rounded-full bg-giro-orange px-5 py-3 text-center text-base font-extrabold text-white shadow-[0_5px_0_#9a4a12] transition duration-200 hover:-translate-y-0.5 hover:bg-[#c96520] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-giro-ink active:translate-y-0 active:shadow-[0_2px_0_#9a4a12]"
            >
              Reservar minha mesa
            </a>
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
