import React, { useRef, useState } from 'react';
import { SCENES } from '../data/defaultContent';
import { AlertIcon, CheckCircleIcon, ResetIcon } from '../components/icons/StoryIcons';
import { Confetti } from '../components/GameFx';

const ZONE_STYLES = {
  kiri: {
    btn: 'story-btn-blue',
    idle: 'bg-sky-wash/95 border-sky shadow-[0_6px_0_#0f4873]',
    hover: 'bg-sky-wash border-sky border-dashed scale-[1.01] shadow-[0_0_0_4px_#f2b705]',
    badge: 'bg-sky',
    text: 'text-sky',
    dashed: 'border-sky/60',
    rule: 'border-sky/40',
  },
  kanan: {
    btn: 'story-btn-green',
    idle: 'bg-meadow-wash/95 border-meadow shadow-[0_6px_0_#125232]',
    hover: 'bg-meadow-wash border-meadow border-dashed scale-[1.01] shadow-[0_0_0_4px_#f2b705]',
    badge: 'bg-meadow',
    text: 'text-meadow',
    dashed: 'border-meadow/60',
    rule: 'border-meadow/40',
  },
};

function CardThumb({ card, index, size = 'lg' }) {
  const dim = size === 'lg' ? 'w-18 h-18' : size === 'md' ? 'w-14 h-14' : 'w-12 h-12';
  if (card.image) {
    return (
      <img
        src={card.image}
        width="72"
        height="72"
        alt=""
        draggable={false}
        className={`${dim} rounded-xl object-cover border-2 border-ink bg-parchment shrink-0 pointer-events-none`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${dim} rounded-xl border-2 border-ink bg-gold-wash shrink-0 inline-flex items-center justify-center font-display font-extrabold text-2xl text-wood pointer-events-none`}
    >
      {index + 1}
    </span>
  );
}

/**
 * Permainan pilah kartu ke dua kotak (misal Hak vs Kewajiban).
 * Mendukung seret (mouse, sentuh, smartboard), ketuk-pilih lalu ketuk kotak, dan tombol keyboard.
 */
export function SortChallenge({ cards, leftLabel, rightLabel, onComplete, onPlaySound }) {
  const [placed, setPlaced] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [drag, setDrag] = useState(null);
  const [hoverZone, setHoverZone] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [burst, setBurst] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);

  const originRef = useRef(null);
  const suppressClickRef = useRef(false);
  const zoneRefs = { kiri: useRef(null), kanan: useRef(null) };

  const labels = { kiri: leftLabel, kanan: rightLabel };
  const indexOf = (id) => cards.findIndex((c) => c.id === id);
  const remaining = cards.filter((c) => !placed[c.id]);
  const sortedCount = cards.length - remaining.length;
  const percent = Math.round((sortedCount / cards.length) * 100);
  const selectedCard = cards.find((c) => c.id === selectedId) ?? null;

  function place(cardId, zone) {
    const card = cards.find((c) => c.id === cardId);
    if (!card || placed[cardId]) return;
    if (card.box === zone) {
      const next = { ...placed, [cardId]: zone };
      setPlaced(next);
      setSelectedId(null);
      setFeedback({ type: 'success', text: card.feedbackCorrect });
      setBurst((b) => b + 1);
      if (cards.every((c) => next[c.id])) onComplete(mistakes);
      else onPlaySound('correct');
    } else {
      setFeedback({ type: 'error', text: card.feedbackWrong });
      setMistakes((m) => m + 1);
      setShakeKey((k) => k + 1);
      onPlaySound('wrong');
    }
  }

  function zoneAt(x, y) {
    for (const zone of ['kiri', 'kanan']) {
      const el = zoneRefs[zone].current;
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return zone;
    }
    return null;
  }

  function onPointerDown(e, card) {
    if (e.target.closest('button[data-direct-sort="true"]')) return;
    if (e.button !== undefined && e.button !== 0) return;
    suppressClickRef.current = false;
    originRef.current = { card, pointerId: e.pointerId, x: e.clientX, y: e.clientY, dragging: false };
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // Event sintetis di pengujian bisa tidak punya pointer aktif.
    }
  }

  function onPointerMove(e) {
    const o = originRef.current;
    if (!o || o.pointerId !== e.pointerId) return;
    if (!o.dragging && Math.hypot(e.clientX - o.x, e.clientY - o.y) > 8) {
      o.dragging = true;
      setSelectedId(o.card.id);
    }
    if (o.dragging) {
      setDrag({ card: o.card, x: e.clientX, y: e.clientY });
      setHoverZone(zoneAt(e.clientX, e.clientY));
    }
  }

  function onPointerUp(e) {
    const o = originRef.current;
    if (!o || o.pointerId !== e.pointerId) return;
    if (o.dragging) {
      suppressClickRef.current = true;
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
      const zone = zoneAt(e.clientX, e.clientY);
      if (zone) place(o.card.id, zone);
    }
    originRef.current = null;
    setDrag(null);
    setHoverZone(null);
  }

  function onPointerCancel() {
    suppressClickRef.current = false;
    originRef.current = null;
    setDrag(null);
    setHoverZone(null);
  }

  function reset() {
    setPlaced({});
    setSelectedId(null);
    setFeedback({ type: '', text: '' });
    setMistakes(0);
    onPlaySound('click');
  }

  function renderZone(zone) {
    const s = ZONE_STYLES[zone];
    const inZone = cards.filter((c) => placed[c.id] === zone);
    const total = cards.filter((c) => c.box === zone).length;
    return (
      <div
        ref={zoneRefs[zone]}
        data-drop-zone={zone}
        className={`rounded-3xl border-[4px] p-4 space-y-3 min-h-72 transition-all ${
          hoverZone === zone ? s.hover : s.idle
        }`}
      >
        <div className={`flex items-center justify-between gap-2 pb-2.5 border-b-2 ${s.rule}`}>
          <h3 className="font-display font-extrabold text-xl text-ink m-0">Kotak {labels[zone]}</h3>
          <span className={`px-3 py-0.5 rounded-xl ${s.badge} text-white border-2 border-ink text-xs font-extrabold`}>
            {inZone.length}/{total}
          </span>
        </div>

        {selectedCard && (
          <button type="button" onClick={() => place(selectedCard.id, zone)} className={`story-btn ${s.btn} w-full text-sm`}>
            Letakkan Kartu Terpilih di Sini
          </button>
        )}

        {hoverZone === zone && (
          <p className={`text-sm font-extrabold ${s.text} bg-white border-2 rounded-xl px-3 py-2 text-center m-0`}>
            Lepaskan kartu di Kotak {labels[zone]}!
          </p>
        )}

        {inZone.length === 0 ? (
          <p
            className={`text-sm font-semibold text-ink-muted bg-white/95 border-2 border-dashed ${s.dashed} rounded-2xl p-5 text-center m-0`}
          >
            Belum ada kartu. Seret kartu ke sini atau pilih tombol {labels[zone]} pada kartu.
          </p>
        ) : (
          <ul className="space-y-2.5 p-0 m-0 list-none">
            {inZone.map((card) => (
              <li
                key={card.id}
                className="animate-bubble-in flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border-2 border-ink shadow-[0_3px_0_#14261c] text-ink"
              >
                <CardThumb card={card} index={indexOf(card.id)} size="sm" />
                <span className="text-sm font-bold flex-1 leading-snug">{card.text}</span>
                <CheckCircleIcon className={`w-5 h-5 ${s.text} shrink-0`} />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div key={shakeKey} className={`relative space-y-4 w-full ${shakeKey ? 'animate-shake' : ''}`}>
      <Confetti burstKey={burst} pieces={22} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        <div className="lg:col-span-5 bg-parchment/95 border-[3px] border-ink rounded-2xl px-4 py-3 shadow-[0_4px_0_#14261c] flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-44 space-y-1.5">
            <div className="flex items-center justify-between text-sm font-extrabold text-ink">
              <span>Progres Pilahan</span>
              <span>
                {sortedCount} dari {cards.length} kartu
              </span>
            </div>
            <div className="h-3.5 w-full rounded-full bg-locked-bg border-2 border-ink overflow-hidden">
              <div className="h-full bg-meadow transition-all duration-300" style={{ width: `${percent}%` }} />
            </div>
          </div>
          {sortedCount > 0 && (
            <button type="button" onClick={reset} className="story-btn story-btn-paper text-xs py-1.5 px-3">
              <ResetIcon className="w-4 h-4 shrink-0" />
              <span>Ulangi</span>
            </button>
          )}
        </div>

        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={`lg:col-span-7 flex items-center gap-3 px-4 py-2.5 rounded-2xl border-[3px] shadow-[0_4px_0_#14261c] font-extrabold text-sm sm:text-base ${
            feedback.type === 'error'
              ? 'bg-crimson-wash border-crimson text-crimson-ink'
              : feedback.type === 'success'
              ? 'bg-meadow-wash border-meadow text-meadow'
              : 'bg-gold-wash border-ink text-ink'
          }`}
        >
          <img
            src={SCENES.mascot}
            width="46"
            height="46"
            alt=""
            className="w-11 h-11 rounded-full object-cover border-2 border-ink bg-white shrink-0"
          />
          <div className="flex items-start gap-2 min-w-0">
            {feedback.type === 'error' && <AlertIcon className="w-5 h-5 shrink-0 mt-0.5" />}
            {feedback.type === 'success' && <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />}
            <span>
              {feedback.text ||
                `Seret kartu ke Kotak ${leftLabel} atau Kotak ${rightLabel}, atau ketuk kartu lalu pilih kotaknya!`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
        <div className="lg:col-span-5 game-board-wood p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display font-extrabold text-lg text-ink m-0">Dek Kartu ({remaining.length} tersisa)</h2>
            {selectedCard && (
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-gold border-2 border-ink text-ink">
                Ketuk kotak tujuan
              </span>
            )}
          </div>

          {remaining.length === 0 ? (
            <div className="p-6 rounded-2xl bg-meadow-wash border-2 border-meadow text-center space-y-2">
              <CheckCircleIcon className="w-10 h-10 text-meadow mx-auto" />
              <p className="font-display font-extrabold text-lg text-ink m-0">Semua kartu sudah terpilah dengan tepat!</p>
            </div>
          ) : (
            <ul className="space-y-2.5 p-0 m-0 list-none">
              {remaining.map((card) => {
                const isSelected = selectedId === card.id;
                const isDragging = drag?.card.id === card.id;
                return (
                  <li key={card.id}>
                    <div
                      onPointerDown={(e) => onPointerDown(e, card)}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      onPointerCancel={onPointerCancel}
                      style={{ touchAction: 'none' }}
                      className={`rounded-2xl border-[2.5px] p-3 transition-colors select-none cursor-grab active:cursor-grabbing ${
                        isDragging
                          ? 'opacity-40 bg-gold-wash border-ink border-dashed'
                          : isSelected
                          ? 'bg-gold-wash border-ink shadow-[0_4px_0_#14261c]'
                          : 'bg-white border-ink shadow-[0_3px_0_#14261c] hover:bg-gold-wash/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <CardThumb card={card} index={indexOf(card.id)} />
                        <div className="min-w-0 flex-1 space-y-2">
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => {
                              if (suppressClickRef.current) {
                                suppressClickRef.current = false;
                                return;
                              }
                              setSelectedId((prev) => (prev === card.id ? null : card.id));
                              onPlaySound('click');
                            }}
                            className="text-left w-full p-0 bg-transparent border-0 font-bold text-sm sm:text-base text-ink leading-snug cursor-grab active:cursor-grabbing"
                          >
                            {card.text}
                          </button>
                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            {['kiri', 'kanan'].map((zone) => (
                              <button
                                key={zone}
                                type="button"
                                data-direct-sort="true"
                                aria-label={`Masukkan "${card.text}" ke ${labels[zone]}`}
                                onClick={() => place(card.id, zone)}
                                className={`story-btn ${ZONE_STYLES[zone].btn} text-xs sm:text-sm py-1.5 px-3`}
                              >
                                {labels[zone]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderZone('kiri')}
          {renderZone('kanan')}
        </div>
      </div>

      {drag && (
        <div
          aria-hidden="true"
          style={{ left: `${drag.x}px`, top: `${drag.y}px` }}
          className="fixed z-50 -translate-x-1/2 -translate-y-1/2 rotate-2 pointer-events-none w-72 p-3 rounded-2xl bg-gold-wash border-[3px] border-ink shadow-[0_8px_0_#14261c] flex items-center gap-3"
        >
          <CardThumb card={drag.card} index={indexOf(drag.card.id)} size="md" />
          <span className="text-sm font-extrabold text-ink leading-snug">{drag.card.text}</span>
        </div>
      )}
    </div>
  );
}
