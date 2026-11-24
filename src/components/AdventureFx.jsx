import React, { useMemo } from 'react';

/**
 * Suasana petualangan di atas slide: kunang-kunang berkelip dan daun yang melayang pelan.
 * Hanya di pinggir layar supaya tidak menutupi tulisan, dan tidak bisa diketuk (pointer-events: none).
 */
export function AdventureFx() {
  const fireflies = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const leftSide = i % 2 === 0;
        return {
          id: i,
          left: leftSide ? Math.random() * 9 : 91 + Math.random() * 8,
          top: 8 + Math.random() * 84,
          delay: Math.random() * 6,
          duration: 5 + Math.random() * 5,
          size: 5 + Math.random() * 5,
        };
      }),
    []
  );
  const leaves = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: i % 2 === 0 ? 1 + Math.random() * 7 : 92 + Math.random() * 6,
        delay: i * 3.2 + Math.random() * 2,
        duration: 11 + Math.random() * 6,
        size: 22 + Math.random() * 12,
        glyph: ['🍃', '🍂', '🍃', '🌿', '🍂'][i],
      })),
    []
  );

  return (
    <div aria-hidden="true" className="adventure-fx">
      {fireflies.map((f) => (
        <span
          key={`f${f.id}`}
          className="firefly"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: f.size,
            height: f.size,
            animationDelay: `${f.delay}s, ${f.delay}s`,
            animationDuration: `${f.duration}s, ${1.6 + (f.id % 4) * 0.5}s`,
          }}
        />
      ))}
      {leaves.map((l) => (
        <span
          key={`l${l.id}`}
          className="drift-leaf"
          style={{ left: `${l.left}%`, fontSize: l.size, animationDelay: `${l.delay}s`, animationDuration: `${l.duration}s` }}
        >
          {l.glyph}
        </span>
      ))}
    </div>
  );
}
