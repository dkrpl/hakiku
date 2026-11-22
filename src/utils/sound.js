let sharedContext = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedContext) {
    sharedContext = new AudioCtx();
  }
  if (sharedContext.state === 'suspended') {
    sharedContext.resume().catch(() => {});
  }
  return sharedContext;
}

function playToneSequence(notes, muted) {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    notes.forEach(({ freq, start, duration, type = 'triangle', gain = 0.14 }) => {
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + start);

      amp.gain.setValueAtTime(0.001, now + start);
      amp.gain.exponentialRampToValueAtTime(gain, now + start + 0.02);
      amp.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

      osc.connect(amp);
      amp.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + duration + 0.02);
    });
  } catch {
    // Ignore audio failures in restricted browsers or test environments.
  }
}

export const soundFx = {
  playClick(muted = false) {
    playToneSequence([{ freq: 440, start: 0, duration: 0.06, type: 'sine', gain: 0.08 }], muted);
  },
  playCorrect(muted = false) {
    playToneSequence(
      [
        { freq: 523.25, start: 0, duration: 0.12, type: 'triangle', gain: 0.14 },
        { freq: 659.25, start: 0.1, duration: 0.14, type: 'triangle', gain: 0.14 },
        { freq: 783.99, start: 0.2, duration: 0.2, type: 'triangle', gain: 0.15 },
      ],
      muted
    );
  },
  playWrong(muted = false) {
    playToneSequence(
      [
        { freq: 329.63, start: 0, duration: 0.14, type: 'sine', gain: 0.13 },
        { freq: 261.63, start: 0.13, duration: 0.2, type: 'sine', gain: 0.13 },
      ],
      muted
    );
  },
  playUnlock(muted = false) {
    playToneSequence(
      [
        { freq: 523.25, start: 0, duration: 0.1, type: 'triangle', gain: 0.14 },
        { freq: 659.25, start: 0.09, duration: 0.1, type: 'triangle', gain: 0.14 },
        { freq: 783.99, start: 0.18, duration: 0.12, type: 'triangle', gain: 0.15 },
        { freq: 1046.5, start: 0.3, duration: 0.28, type: 'triangle', gain: 0.16 },
      ],
      muted
    );
  },
  playVictory(muted = false) {
    playToneSequence(
      [
        { freq: 523.25, start: 0, duration: 0.12, type: 'triangle', gain: 0.15 },
        { freq: 659.25, start: 0.11, duration: 0.12, type: 'triangle', gain: 0.15 },
        { freq: 783.99, start: 0.22, duration: 0.12, type: 'triangle', gain: 0.15 },
        { freq: 1046.5, start: 0.34, duration: 0.34, type: 'triangle', gain: 0.17 },
      ],
      muted
    );
  },
};
