import React, { useMemo } from 'react';
import { SCENES } from '../data/defaultContent';

const CONFETTI_COLORS = ['#f2b705', '#186a42', '#155e95', '#b91c1c', '#7a4315', '#3698d8', '#2e9e5b'];

/** Hujan konfeti CSS. Ganti `burstKey` untuk memicu ledakan baru. */
export function Confetti({ burstKey, pieces = 36 }) {
  const items = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: `${burstKey}-${i}`,
        left: Math.random() * 100,
        delay: Math.random() * 0.25,
        duration: 1.1 + Math.random() * 0.9,
        drift: (Math.random() - 0.5) * 160,
        rotate: Math.random() * 720,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 8 + Math.random() * 8,
      })),
    [burstKey, pieces]
  );

  if (!burstKey) return null;
  return (
    <div aria-hidden="true" className="confetti-layer">
      {items.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}

/** Bintang hasil (1-3). Satu bintang hilang setiap beberapa kesalahan. */
export function starsFromMistakes(mistakes) {
  if (mistakes <= 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}

export function StarRow({ stars, total = 3, size = 'w-10 h-10', animate = false }) {
  return (
    <div className="flex justify-center gap-1.5" role="img" aria-label={`${stars} dari ${total} bintang`}>
      {Array.from({ length: total }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`${size} ${animate ? 'animate-star-pop' : ''}`}
          style={animate ? { animationDelay: `${0.15 + i * 0.18}s` } : undefined}
        >
          <path
            d="M12 2.6l2.9 6 6.5.9-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.1 1.1-6.5L2.6 9.5l6.5-.9z"
            fill={i < stars ? '#f2b705' : '#e8e4da'}
            stroke="#14261c"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

/** Maskot dengan balon kata yang memantul setiap kali pesannya berganti. */
export function MascotBubble({ text, tone = 'idle' }) {
  const toneCls =
    tone === 'correct'
      ? 'bg-meadow-wash border-meadow'
      : tone === 'wrong'
      ? 'bg-crimson-wash border-crimson'
      : 'bg-gold-wash border-ink';
  return (
    <div className="flex items-end gap-3">
      <img
        src={SCENES.mascot}
        width="64"
        height="64"
        alt=""
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-[3px] border-ink bg-white shrink-0 ${
          tone === 'correct' ? 'animate-hop' : tone === 'wrong' ? 'animate-shake' : ''
        }`}
      />
      <p
        key={text}
        className={`speech-bubble animate-bubble-in text-sm sm:text-base font-extrabold text-ink m-0 border-[2.5px] ${toneCls}`}
      >
        {text}
      </p>
    </div>
  );
}

/** Titik kemajuan soal: hijau = selesai, kuning = sedang dikerjakan. */
export function ProgressDots({ total, current, doneCount }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-3 rounded-full border-2 border-ink transition-all duration-300 ${
            i < doneCount ? 'w-6 bg-meadow' : i === current ? 'w-8 bg-gold' : 'w-3 bg-white'
          }`}
        />
      ))}
    </div>
  );
}
