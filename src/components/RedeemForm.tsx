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
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <label htmlFor="name" className="flex flex-col gap-1.5 text-left text-sm font-bold text-giro-ink">
        Nome
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="min-h-12 rounded-xl border border-[#d7c29e] bg-white px-3.5 py-2.5 font-medium text-giro-ink shadow-sm outline-none transition placeholder:text-giro-ink/45 focus:border-giro-terracotta focus:ring-3 focus:ring-giro-terracotta/20"
        />
      </label>

      <label htmlFor="whatsapp" className="flex flex-col gap-1.5 text-left text-sm font-bold text-giro-ink">
        WhatsApp
        <input
          type="tel"
          id="whatsapp"
          name="whatsapp"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="(48) 99999-9999"
          value={whatsapp}
          onChange={(event) => setWhatsapp(formatPhone(event.target.value))}
          className="min-h-12 rounded-xl border border-[#d7c29e] bg-white px-3.5 py-2.5 font-medium text-giro-ink shadow-sm outline-none transition placeholder:text-giro-ink/45 focus:border-giro-terracotta focus:ring-3 focus:ring-giro-terracotta/20"
        />
      </label>

      <label htmlFor="regulation" className="flex items-start gap-2.5 text-left text-xs leading-relaxed text-giro-ink/80">
        <input
          type="checkbox"
          id="regulation"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-giro-terracotta"
        />
        Li e aceito o regulamento: 1 cupom por pessoa, válido na primeira visita, não cumulativo.
      </label>

      {error ? (
        <p role="alert" className="text-sm font-bold text-giro-red">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="mt-1 min-h-13 rounded-full bg-giro-orange px-5 py-3 text-base font-extrabold text-white shadow-[0_5px_0_#9a4a12] transition duration-200 hover:-translate-y-0.5 hover:bg-[#c96520] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-giro-ink active:translate-y-0 active:shadow-[0_2px_0_#9a4a12]"
      >
        Resgatar meu cupom
      </button>
    </form>
  );
}
