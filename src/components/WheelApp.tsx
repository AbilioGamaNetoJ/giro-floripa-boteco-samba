import { useEffect, useState } from "react";
import { prize } from "../data/prize";
import { generateCouponCode } from "../lib/coupon";
import { readClaim, readSpin, writeClaim, writeSpin } from "../lib/storage";
import { PrizeWheel } from "./PrizeWheel";
import { WinModal } from "./WinModal";

export default function WheelApp() {
  const [ready, setReady] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const claim = readClaim();
    const spin = readSpin();

    setHasSpun(Boolean(spin || claim));
    if (claim) {
      setName(claim.name);
      setCode(claim.code);
    }
    setReady(true);
  }, []);

  function handleSpinEnd() {
    writeSpin({
      prizeId: prize.id,
      spunAt: new Date().toISOString(),
    });
    setHasSpun(true);
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
    return <div className="mx-auto h-[22rem] w-full max-w-[22rem] sm:h-[25rem] sm:max-w-[25rem]" />;
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <PrizeWheel disabled={hasSpun} onSpinEnd={handleSpinEnd} />

      {hasSpun && !modalOpen ? (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="min-h-12 rounded-full bg-giro-terracotta px-6 py-3 text-sm font-extrabold tracking-[0.01em] text-white shadow-[0_5px_0_#8b1e1e] transition duration-200 hover:-translate-y-0.5 hover:bg-[#af3521] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-giro-ink active:translate-y-0 active:shadow-[0_2px_0_#8b1e1e]"
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
