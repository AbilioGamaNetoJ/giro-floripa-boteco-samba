let audioCtx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

async function unlock(): Promise<AudioContext | null> {
  const ctx = context();
  if (!ctx) return null;
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  return ctx;
}

function tick(ctx: AudioContext, when: number, volume: number) {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(210, when);
  osc.frequency.exponentialRampToValueAtTime(90, when + 0.035);

  filter.type = "bandpass";
  filter.frequency.value = 1400;
  filter.Q.value = 4;

  gain.gain.setValueAtTime(volume, when);
  gain.gain.exponentialRampToValueAtTime(0.001, when + 0.05);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(when);
  osc.stop(when + 0.06);
}

export async function playSpinSound(durationMs: number): Promise<void> {
  const ctx = await unlock();
  if (!ctx) return;

  const start = ctx.currentTime;
  const duration = durationMs / 1000;
  let elapsed = 0;

  while (elapsed < duration) {
    const progress = elapsed / duration;
    const eased = progress * progress;
    const interval = 0.038 + eased * 0.26;
    const volume = 0.09 * (1 - eased * 0.45);
    tick(ctx, start + elapsed, volume);
    elapsed += interval;
  }
}

export async function playWinSound(): Promise<void> {
  const ctx = await unlock();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];

  notes.forEach((frequency, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const when = now + index * 0.11;

    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(0.16, when + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(when);
    osc.stop(when + 0.6);
  });
}
