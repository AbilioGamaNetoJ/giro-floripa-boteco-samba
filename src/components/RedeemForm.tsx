import { useState, type FormEvent } from "react";
import { formatPhone, isValidMobile } from "../lib/phone";

type Props = {
  onSubmit: (name: string, whatsapp: string) => void;
};

export function RedeemForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("Digite seu nome.");
      return;
    }
    if (!isValidMobile(whatsapp)) {
      setError("Digite um WhatsApp válido com DDD.");
      return;
    }
    if (!accepted) {
      setError("Aceite o regulamento para resgatar.");
      return;
    }

    setError("");
    onSubmit(trimmedName, whatsapp);
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-1 text-left text-sm font-semibold text-giro-ink">
        Nome
        <input
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-xl border border-[#e4d2b4] bg-white px-3 py-2.5 font-medium text-giro-ink outline-none focus:border-giro-terracotta"
        />
      </label>

      <label className="flex flex-col gap-1 text-left text-sm font-semibold text-giro-ink">
        WhatsApp
        <input
          type="tel"
          name="whatsapp"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="(48) 99999-9999"
          value={whatsapp}
          onChange={(event) => setWhatsapp(formatPhone(event.target.value))}
          className="rounded-xl border border-[#e4d2b4] bg-white px-3 py-2.5 font-medium text-giro-ink outline-none focus:border-giro-terracotta"
        />
      </label>

      <label className="flex items-start gap-2 text-left text-xs leading-relaxed text-giro-ink/80">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-0.5 accent-giro-terracotta"
        />
        Li e aceito o regulamento: 1 cupom por pessoa, válido na primeira visita, não cumulativo.
      </label>

      {error ? <p className="text-sm font-semibold text-giro-red">{error}</p> : null}

      <button
        type="submit"
        className="mt-1 rounded-full bg-giro-orange py-3 font-display text-lg font-extrabold text-white shadow-[0_4px_0_#9a4a12] transition hover:-translate-y-0.5"
      >
        Resgatar meu cupom
      </button>
    </form>
  );
}
