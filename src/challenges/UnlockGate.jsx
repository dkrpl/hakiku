import React, { useEffect, useRef, useState } from 'react';
import { MascotBubble, StarRow, Confetti } from '../components/GameFx';

const TAPS_NEEDED = 3;

function Padlock({ open, cracks }) {
  return (
    <svg viewBox="0 0 120 140" aria-hidden="true" className="w-36 h-40 sm:w-44 sm:h-48 drop-shadow-[0_6px_0_#4a2608]">
      <g className={open ? 'padlock-shackle-open' : ''} style={{ transformOrigin: '86px 62px' }}>
        <path d="M34 62V42a26 26 0 0 1 52 0v20" fill="none" stroke="#14261c" strokeWidth="13" strokeLinecap="round" />
        <path d="M34 62V42a26 26 0 0 1 52 0v20" fill="none" stroke="#9aa5a0" strokeWidth="7" strokeLinecap="round" />
      </g>
      <rect x="14" y="58" width="92" height="74" rx="16" fill="#f2b705" stroke="#14261c" strokeWidth="5" />
      <rect x="22" y="66" width="76" height="12" rx="6" fill="#fef5d6" opacity="0.7" />
      <circle cx="60" cy="95" r="10" fill="#14261c" />
      <rect x="56" y="98" width="8" height="18" rx="4" fill="#14261c" />
      {cracks >= 1 && <path d="M30 120l10-12 6 6 8-10" fill="none" stroke="#7a4315" strokeWidth="3" strokeLinecap="round" />}
      {cracks >= 2 && <path d="M92 70l-8 10 6 5-7 9" fill="none" stroke="#7a4315" strokeWidth="3" strokeLinecap="round" />}
    </svg>
  );
}

/**
 * Gerbang kunci: siswa mengetuk gembok 3 kali sampai terbuka,
 * lalu kode pintu ditampilkan. Bintang menunjukkan hasil tantangan.
 */
export function UnlockGate({ stars, onOpened, onPlaySound }) {
  const [taps, setTaps] = useState(0);
  const [wiggle, setWiggle] = useState(0);
  const open = taps >= TAPS_NEEDED;
  const buttonRef = useRef(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(onOpened, 900);
    return () => clearTimeout(t);
  }, [open, onOpened]);

  function handleTap() {
    if (open) return;
    const next = taps + 1;
    setTaps(next);
    setWiggle((w) => w + 1);
    onPlaySound(next >= TAPS_NEEDED ? 'unlock' : 'click');
  }

  const left = TAPS_NEEDED - taps;
  const message = open
    ? 'Gemboknya terbuka! Lihat kode pintumu…'
    : taps === 0
    ? 'Kamu berhasil! Ketuk gembok emas 3 kali untuk membukanya!'
    : `Terus! Ketuk ${left} kali lagi!`;

  return (
    <div className="story-panel relative max-w-2xl w-full mx-auto p-6 sm:p-8 text-center space-y-5 animate-screen-enter">
      <Confetti burstKey={open ? 1 : 0} pieces={50} />
      <p className="text-sm font-extrabold text-meadow uppercase tracking-wide m-0">Tantangan selesai!</p>
      <StarRow stars={stars} animate />
      <button
        ref={buttonRef}
        type="button"
        onClick={handleTap}
        aria-label={open ? 'Gembok terbuka' : `Buka gembok, ketuk ${left} kali lagi`}
        className={`unlock-pad mx-auto block rounded-3xl p-2 ${open ? '' : 'cursor-pointer'}`}
      >
        <span key={wiggle} className={`inline-block ${wiggle && !open ? 'animate-shake' : ''} ${open ? 'animate-hop' : ''}`}>
          <Padlock open={open} cracks={Math.min(taps, 2)} />
        </span>
      </button>
      <div className="flex justify-center gap-2" aria-hidden="true">
        {Array.from({ length: TAPS_NEEDED }, (_, i) => (
          <span key={i} className={`w-4 h-4 rounded-full border-2 border-ink ${i < taps ? 'bg-gold' : 'bg-white'}`} />
        ))}
      </div>
      <div className="flex justify-center">
        <MascotBubble text={message} tone={open ? 'correct' : 'idle'} />
      </div>
    </div>
  );
}
