import { useMemo, useState } from "react";
import { prize } from "../data/prize";
import { segments, type SegmentIconId } from "../data/segments";
import { playSpinSound, playWinSound } from "../lib/sounds";

type Props = {
  disabled?: boolean;
  onSpinEnd: () => void;
};

const SIZE = 400;
const CX = 200;
const CY = 200;
const RADIUS = 186;
const LABEL_RADIUS = 110;
const TURNS = 10;
const SPIN_MS = 8200;

function polar(angleDeg: number, radius: number): [number, number] {
  const angle = (angleDeg * Math.PI) / 180;
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
}

function slicePath(index: number, total: number): string {
  const step = 360 / total;
  const start = -90 + index * step;
  const end = start + step;
  const [x1, y1] = polar(start, RADIUS);
  const [x2, y2] = polar(end, RADIUS);
  return `M ${CX} ${CY} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2} Z`;
}

function winningRotation(): number {
  const winnerIndex = segments.findIndex((segment) => segment.id === prize.segmentId);
  const step = 360 / segments.length;
  const jitter = (Math.random() - 0.5) * step * 0.4;
  const centerFromTop = winnerIndex * step + step / 2;
  return TURNS * 360 + (360 - centerFromTop) + jitter;
}

function SliceMark({ id, color }: { id: SegmentIconId; color: string }) {
  const stroke = {
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (id) {
    case "percent":
      return (
        <g>
          <circle cx="-5" cy="-4" r="2.8" {...stroke} />
          <circle cx="5" cy="4" r="2.8" {...stroke} />
          <path d="M5 -7 L-5 7" {...stroke} />
        </g>
      );
    case "caipirinha":
      return (
        <g>
          <path d="M-7 -8h14l-1.8 6a7 7 0 0 1-10.4 0Z" {...stroke} />
          <path d="M-3.5 14h7M0 -2v16" {...stroke} />
        </g>
      );
    case "mandioquinha":
      return (
        <g>
          <path d="M-6 -8c1.6 4 1.3 8 .2 13M0 -10c1.8 5 1.6 10 .3 15M6 -8c1.3 4 1.3 8 .2 12" {...stroke} />
          <path d="M-8 8c2.4 1.2 5.2 1.7 8 1.7s5.6-0.5 8-1.7" {...stroke} />
        </g>
      );
    case "bolinho":
      return (
        <g>
          <ellipse cx="0" cy="2" rx="8.5" ry="6.2" {...stroke} />
          <path d="M-5 -1c0.8-2.6 2.6-4.4 5-4.4s4.2 1.8 5 4.4" {...stroke} />
        </g>
      );
    case "croquete":
      return (
        <g>
          <rect x="-9" y="-4" width="18" height="9" rx="4.5" {...stroke} />
          <path d="M-5 0.5h10" {...stroke} />
        </g>
      );
    case "crostini":
      return (
        <g>
          <path d="M-7 7 L0 -9 L7 7Z" {...stroke} />
          <path d="M-3.5 2.5h7" {...stroke} />
        </g>
      );
  }
}

export function PrizeWheel({ disabled = false, onSpinEnd }: Props) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [spinDuration, setSpinDuration] = useState(SPIN_MS);

  const slices = useMemo(
    () =>
      segments.map((segment, index) => {
        const step = 360 / segments.length;
        const angle = -90 + index * step + step / 2;
        const [x, y] = polar(angle, LABEL_RADIUS);
        return {
          segment,
          path: slicePath(index, segments.length),
          x,
          y,
          clipId: `slice-clip-${segment.id}`,
        };
      }),
    [],
  );

  function spin() {
    if (spinning || disabled) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = prefersReduced ? 200 : SPIN_MS;
    const next = winningRotation();
    setSpinning(true);
    setSpinDuration(duration);
    setRotation(next);
    if (!prefersReduced) {
      void playSpinSound(duration);
    }

    window.setTimeout(() => {
      setSpinning(false);
      void playWinSound();
      onSpinEnd();
    }, duration);
  }

  const buttonLabel = spinning ? "Girando..." : disabled ? "Já girou" : "Girar agora";

  return (
    <div className="relative mx-auto w-full max-w-[22rem] pt-8 sm:max-w-[25rem] lg:max-w-[27rem]">
      <div
        className="pointer-events-none absolute top-0 left-1/2 z-20 -translate-x-1/2 drop-shadow-[0_3px_2px_rgba(42,24,16,0.22)]"
        aria-hidden="true"
      >
        <svg width="34" height="44" viewBox="0 0 34 44">
          <path
            d="M17 42C17 42 4 26 4 16a13 13 0 1 1 26 0C30 26 17 42 17 42Z"
            fill="#8B1E1E"
          />
          <circle cx="17" cy="16" r="5" fill="#FFF6E8" />
        </svg>
      </div>

      <div className="relative aspect-square rounded-full bg-giro-paper p-1.5 shadow-[0_18px_45px_rgba(42,24,16,0.22)]">
        <div
          className="absolute inset-1.5 rounded-full bg-[#2A1810]"
          aria-hidden="true"
        />
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="relative z-10 h-full w-full p-2.5 will-change-transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? `transform ${spinDuration}ms cubic-bezier(0.08, 0.72, 0.08, 1)`
              : "none",
          }}
          role="img"
          aria-label="Roleta premiada do Giro Floripa"
        >
          <defs>
            {slices.map((slice) => (
              <clipPath key={slice.clipId} id={slice.clipId}>
                <path d={slice.path} />
              </clipPath>
            ))}
          </defs>

          <circle cx={CX} cy={CY} r={196} fill="#2A1810" />

          {slices.map((slice) => (
            <g key={slice.segment.id}>
              <path d={slice.path} fill={slice.segment.color} />
              <g clipPath={`url(#${slice.clipId})`}>
                <g transform={`translate(${slice.x} ${slice.y})`}>
                  <g transform="translate(0 -8)">
                    <SliceMark id={slice.segment.icon} color={slice.segment.text} />
                  </g>
                  <text
                    textAnchor="middle"
                    fill={slice.segment.text}
                    fontFamily="Manrope, ui-sans-serif, sans-serif"
                    fontSize="13.5"
                    fontWeight="800"
                  >
                    {slice.segment.lines.map((line, lineIndex) => (
                      <tspan key={line} x="0" y={18 + lineIndex * 15}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              </g>
              <path d={slice.path} fill="none" stroke="#FFF6E8" strokeWidth="2" />
            </g>
          ))}

          <circle cx={CX} cy={CY} r={48} fill="#FFF6E8" />
          <circle cx={CX} cy={CY} r={190} fill="none" stroke="#E3A008" strokeWidth="7" />
        </svg>

        <button
          type="button"
          onClick={spin}
          disabled={spinning || disabled}
          className="absolute top-1/2 left-1/2 z-20 flex h-[5.4rem] w-[5.4rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-giro-paper bg-giro-red px-2 text-center text-[0.68rem] font-extrabold leading-tight tracking-[0.08em] text-white uppercase shadow-[0_8px_0_#65141f] transition duration-200 enabled:hover:-translate-y-[54%] enabled:hover:bg-[#741722] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-giro-gold disabled:cursor-not-allowed disabled:bg-[#a94b4b]"
        >
          {buttonLabel}
        </button>
        <p className="sr-only" aria-live="polite">
          {spinning ? "A roleta está girando." : disabled ? "Você já girou a roleta." : "A roleta está pronta para girar."}
        </p>
      </div>
    </div>
  );
}
