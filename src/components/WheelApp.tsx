import { useEffect, useState } from "react";
import { prize } from "../data/prize";
import { generateCouponCode } from "../lib/coupon";
import { readClaim, writeClaim } from "../lib/storage";
import { PrizeWheel } from "./PrizeWheel";
import { WinModal } from "./WinModal";

export default function WheelApp() {
  const [ready, setReady] = useState(false);
  const [won, setWon] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const claim = readClaim();
    if (claim) {
      setName(claim.name);
      setCode(claim.code);
      setWon(true);
    }
    setReady(true);
  }, []);

  function handleSpinEnd() {
    setWon(true);
    setModalOpen(true);
  }

  function handleRedeem(nextName: string, whatsapp: string) {
    const nextCode = code || generateCouponCode(prize.couponPrefix);
    writeClaim({
      name: nextName,
      whatsapp,
      code: nextCode,
      claimedAt: new Date().toISOString(),
    });
    setName(nextName);
    setCode(nextCode);
  }

  if (!ready) {
    return <div className="mx-auto h-[22rem] w-[min(100%,22rem)] sm:h-[24rem] sm:w-[24rem]" />;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <PrizeWheel disabled={won} onSpinEnd={handleSpinEnd} />

      {won && !modalOpen ? (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-full bg-giro-terracotta px-5 py-2 font-display text-sm font-bold text-white"
        >
          {code ? "Ver meu cupom" : "Resgatar prêmio"}
        </button>
      ) : null}

      <WinModal
        open={modalOpen}
        initialStep={code ? "code" : "prize"}
        code={code}
        name={name}
        onClose={() => setModalOpen(false)}
        onRedeem={handleRedeem}
      />
    </div>
  );
}
