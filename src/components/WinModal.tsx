import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (open) setStep(initialStep);
  }, [open, initialStep]);

  if (!open) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#2A1810]/55 p-4 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="win-title"
        className="relative w-full max-w-md rounded-3xl bg-white px-5 pt-8 pb-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-giro-red text-lg font-bold text-white"
          aria-label="Fechar"
        >
          ×
        </button>

        {step === "prize" ? (
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-giro-gold text-2xl font-black text-giro-ink">
              %
            </div>
            <h2 id="win-title" className="font-display text-3xl text-giro-red">
              Você ganhou!
            </h2>
            <p className="mt-3 rounded-full bg-[#F6EBD8] px-4 py-1.5 font-display text-lg text-giro-ink">
              {prize.title}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-giro-ink/70">{prize.description}</p>
            <button
              type="button"
              onClick={() => setStep("form")}
              className="mt-6 w-full rounded-full bg-giro-orange py-3 font-display text-lg font-extrabold text-white shadow-[0_4px_0_#9a4a12] transition hover:-translate-y-0.5"
            >
              Resgatar prêmio
            </button>
          </div>
        ) : null}

        {step === "form" ? (
          <div>
            <h2 id="win-title" className="mb-1 text-center font-display text-2xl text-giro-red">
              Resgatar prêmio
            </h2>
            <p className="mb-4 text-center text-sm text-giro-ink/70">
              Preencha para gerar seu cupom de uso no balcão.
            </p>
            <RedeemForm onSubmit={onRedeem} />
          </div>
        ) : null}

        {step === "code" && code ? (
          <div className="flex flex-col items-center text-center">
            <h2 id="win-title" className="font-display text-3xl text-giro-red">
              Seu cupom
            </h2>
            <p className="mt-1 text-sm text-giro-ink/70">Mostre este código no balcão do Giro.</p>
            <div className="mt-4 w-full rounded-2xl border-2 border-dashed border-giro-gold bg-[#FFF8E8] px-4 py-5">
              <p className="text-xs font-bold tracking-[0.18em] text-giro-ink/55 uppercase">
                Seu cupom de brinde
              </p>
              <p className="mt-1 font-display text-4xl tracking-wide text-giro-red">{code}</p>
              <button
                type="button"
                onClick={copyCode}
                className="mt-3 rounded-full border border-giro-ink/20 px-4 py-1.5 text-sm font-semibold text-giro-ink"
              >
                {copied ? "Copiado!" : "Copiar código"}
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-giro-ink/70">
              Válido na primeira visita. Peça para aplicar o desconto na finalização da conta.
            </p>
            <a
              href={reservationLink(name ?? "", code)}
              target="_blank"
              rel="noreferrer"
              className="mt-5 w-full rounded-full bg-giro-orange py-3 text-center font-display text-lg font-extrabold text-white shadow-[0_4px_0_#9a4a12] transition hover:-translate-y-0.5"
            >
              Reservar minha mesa
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
