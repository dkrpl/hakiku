import React, { useRef, useState } from 'react';
import { ROOM2_CONTENT, SCENE_ASSETS } from '../data/hakikuData';
import { RoomFooterNav } from '../components/RoomFooterNav';
import {
  AlertIcon,
  CheckCircleIcon,
  NextIcon,
  ResetIcon,
} from '../components/icons/StoryIcons';

export function Room2Screen({
  isCompleted,
  demoUnlockAll,
  onComplete,
  onGoMap,
  onGoNextRoom,
  onPlaySound,
}) {
  const [subPage, setSubPage] = useState(1);
  const [placedMap, setPlacedMap] = useState(() => {
    if (!isCompleted) return {};
    const done = {};
    ROOM2_CONTENT.cards.forEach((c) => {
      done[c.id] = c.category;
    });
    return done;
  });
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Pointer drag state for unified mouse, touch, and smartboard stylus dragging
  const [dragState, setDragState] = useState(null);
  const [hoverZone, setHoverZone] = useState(null);
  const dragOriginRef = useRef(null);
  const suppressNextClickRef = useRef(false);
  const hakZoneRef = useRef(null);
  const kewajibanZoneRef = useRef(null);
  const tab1Ref = useRef(null);
  const tab2Ref = useRef(null);

  const remainingCards = ROOM2_CONTENT.cards.filter((card) => !placedMap[card.id]);
  const hakCards = ROOM2_CONTENT.cards.filter((card) => placedMap[card.id] === 'hak');
  const kewajibanCards = ROOM2_CONTENT.cards.filter((card) => placedMap[card.id] === 'kewajiban');
  const sortedCount = ROOM2_CONTENT.cards.length - remainingCards.length;
  const progressPercent = Math.round((sortedCount / ROOM2_CONTENT.cards.length) * 100);

  function handleTabKeyDown(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const nextTab = subPage === 1 ? 2 : 1;
      setSubPage(nextTab);
      (nextTab === 1 ? tab1Ref : tab2Ref).current?.focus();
    }
  }

  function evaluatePlacement(cardId, targetCategory) {
    const card = ROOM2_CONTENT.cards.find((c) => c.id === cardId);
    if (!card || placedMap[cardId]) return;

    if (card.category === targetCategory) {
      const nextPlaced = { ...placedMap, [cardId]: targetCategory };
      setPlacedMap(nextPlaced);
      setSelectedCardId(null);
      setFeedback({ type: 'success', text: card.feedbackCorrect });

      const allDone = ROOM2_CONTENT.cards.every((c) => Boolean(nextPlaced[c.id]));
      if (allDone) {
        onComplete();
      } else {
        onPlaySound('correct');
      }
    } else {
      setFeedback({ type: 'error', text: card.feedbackWrong });
      onPlaySound('wrong');
    }
  }

  function detectZoneAtPoint(clientX, clientY) {
    const checkRect = (el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    };
    if (checkRect(hakZoneRef.current)) return 'hak';
    if (checkRect(kewajibanZoneRef.current)) return 'kewajiban';
    return null;
  }

  function handleCardPointerDown(event, card) {
    // Allow direct Hak/Kewajiban buttons to trigger placement immediately without starting drag
    if (event.target.closest('button[data-direct-sort="true"]')) return;
    if (event.button !== undefined && event.button !== 0) return;

    suppressNextClickRef.current = false;
    dragOriginRef.current = {
      card,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
    };
    if (event.currentTarget.setPointerCapture) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic events in tests may not carry an active pointer id.
      }
    }
  }

  function handleCardPointerMove(event) {
    const origin = dragOriginRef.current;
    if (!origin || origin.pointerId !== event.pointerId) return;

    const dx = event.clientX - origin.startX;
    const dy = event.clientY - origin.startY;
    if (!origin.dragging && Math.hypot(dx, dy) > 8) {
      origin.dragging = true;
      setSelectedCardId(origin.card.id);
    }

    if (origin.dragging) {
      setDragState({
        card: origin.card,
        x: event.clientX,
        y: event.clientY,
      });
      setHoverZone(detectZoneAtPoint(event.clientX, event.clientY));
    }
  }

  function handleCardPointerUp(event) {
    const origin = dragOriginRef.current;
    if (!origin || origin.pointerId !== event.pointerId) return;

    if (origin.dragging) {
      suppressNextClickRef.current = true;
      setTimeout(() => {
        suppressNextClickRef.current = false;
      }, 0);
      const target = detectZoneAtPoint(event.clientX, event.clientY);
      if (target) {
        evaluatePlacement(origin.card.id, target);
      }
    }
    dragOriginRef.current = null;
    setDragState(null);
    setHoverZone(null);
  }

  function handleCardPointerCancel() {
    suppressNextClickRef.current = false;
    dragOriginRef.current = null;
    setDragState(null);
    setHoverZone(null);
  }

  function handleResetBoard() {
    setPlacedMap({});
    setSelectedCardId(null);
    setFeedback({ type: '', text: '' });
    onPlaySound('click');
  }

  const canAdvanceRoom = isCompleted || demoUnlockAll;
  const selectedCard = ROOM2_CONTENT.cards.find((c) => c.id === selectedCardId) ?? null;

  return (
    <section className="animate-screen-enter game-stage pt-18 sm:pt-20 pb-4 px-3 sm:px-6 lg:px-8">
      {/* Full-screen sunny Indonesian yard & home backdrop */}
      <img
        src={SCENE_ASSETS.room2}
        width="1280"
        height="720"
        alt=""
        className="game-backdrop-img"
      />
      <div aria-hidden="true" className="fixed inset-0 bg-ink/20 pointer-events-none z-0" />

      <div className="relative z-10 w-full flex-1 flex flex-col justify-between gap-4">
        {/* Top Wood Ribbon & Game Stage Switch */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="game-ribbon">
            <span className="px-2 py-0.5 rounded-lg bg-gold text-ink text-xs font-extrabold">
              POS 2
            </span>
            <h1 className="font-display font-extrabold text-base sm:text-xl text-white m-0">
              Ruang 2: Mengenal Hak (Sortir Kartu)
            </h1>
          </div>

          <div
            role="tablist"
            aria-label="Sub-halaman Ruang 2"
            onKeyDown={handleTabKeyDown}
            className="flex flex-wrap gap-2"
          >
            <button
              ref={tab1Ref}
              type="button"
              role="tab"
              id="r2-tab-1"
              aria-selected={subPage === 1}
              aria-controls="r2-panel-1"
              tabIndex={subPage === 1 ? 0 : -1}
              onClick={() => {
                setSubPage(1);
                onPlaySound('click');
              }}
              className={`story-btn text-sm px-4 py-2 ${
                subPage === 1 ? 'story-btn-gold' : 'story-btn-paper'
              }`}
            >
              1. Pengantar Misi
            </button>
            <button
              ref={tab2Ref}
              type="button"
              role="tab"
              id="r2-tab-2"
              aria-selected={subPage === 2}
              aria-controls="r2-panel-2"
              tabIndex={subPage === 2 ? 0 : -1}
              onClick={() => {
                setSubPage(2);
                onPlaySound('click');
              }}
              className={`story-btn text-sm px-4 py-2 ${
                subPage === 2 ? 'story-btn-gold' : 'story-btn-paper'
              }`}
            >
              2. Papan Sortir
            </button>
          </div>
        </div>

        {/* Stage 1: Game Mission Briefing */}
        {subPage === 1 && (
          <div
            id="r2-panel-1"
            role="tabpanel"
            aria-labelledby="r2-tab-1"
            className="flex-1 flex flex-col justify-center max-w-5xl w-full mx-auto"
          >
            <div className="game-board-wood p-5 sm:p-7 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={SCENE_ASSETS.mascot}
                      width="60"
                      height="60"
                      alt=""
                      className="w-15 h-15 rounded-full object-cover border-[3px] border-ink bg-gold-wash shrink-0"
                    />
                    <div>
                      <h2 className="story-heading-page font-extrabold m-0">
                        {ROOM2_CONTENT.introHeading}
                      </h2>
                      <p className="text-sm font-bold text-meadow m-0">
                        Misi Taman Hak: Pilah 6 Kartu Kegiatan!
                      </p>
                    </div>
                  </div>

                  <p className="story-body font-semibold text-ink m-0">{ROOM2_CONTENT.introBody}</p>
                  <ol className="space-y-2 pl-5 m-0 story-body text-ink">
                    {ROOM2_CONTENT.howToSteps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>

                  <button
                    type="button"
                    onClick={() => {
                      setSubPage(2);
                      onPlaySound('click');
                    }}
                    className="story-btn story-btn-gold text-base sm:text-lg px-6 py-3"
                  >
                    <span>Mulai Sortir Kartu</span>
                    <NextIcon className="w-5 h-5 shrink-0" />
                  </button>
                </div>

                <div className="lg:col-span-5 space-y-3.5">
                  <div className="p-4 rounded-2xl bg-sky-wash border-[2.5px] border-sky flex items-center gap-3.5 shadow-[0_4px_0_#155e95]">
                    <img
                      src="/assets/cards/card-love.jpg"
                      width="72"
                      height="72"
                      alt=""
                      className="w-18 h-18 rounded-xl object-cover border-2 border-ink shrink-0"
                    />
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-ink m-0">
                        Kotak Hak
                      </h3>
                      <p className="text-sm text-ink-muted m-0 mt-0.5">
                        Sesuatu yang layak diterima anak: belajar, bermain, dan kasih sayang.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-meadow-wash border-[2.5px] border-meadow flex items-center gap-3.5 shadow-[0_4px_0_#186a42]">
                    <img
                      src="/assets/cards/card-piket.jpg"
                      width="72"
                      height="72"
                      alt=""
                      className="w-18 h-18 rounded-xl object-cover border-2 border-ink shrink-0"
                    />
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-ink m-0">
                        Kotak Kewajiban
                      </h3>
                      <p className="text-sm text-ink-muted m-0 mt-0.5">
                        Tanggung jawab harian: piket kelas, merapikan buku, dan membuang sampah.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: Full-Screen Interactive Sorting Table */}
        {subPage === 2 && (
          <div
            id="r2-panel-2"
            role="tabpanel"
            aria-labelledby="r2-tab-2"
            className="flex-1 space-y-4"
          >
            {/* Top Game Score Bar & Live Mascot Reaction */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
              <div className="lg:col-span-5 bg-parchment/95 border-[3px] border-ink rounded-2xl px-4 py-3 shadow-[0_4px_0_#14261c] flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-44 space-y-1.5">
                  <div className="flex items-center justify-between text-sm font-extrabold text-ink">
                    <span>Progres Pilahan</span>
                    <span>
                      {sortedCount} dari {ROOM2_CONTENT.cards.length} kartu
                    </span>
                  </div>
                  <div className="h-3.5 w-full rounded-full bg-locked-bg border-2 border-ink overflow-hidden">
                    <div
                      className="h-full bg-meadow transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {sortedCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetBoard}
                    className="story-btn story-btn-paper text-xs py-1.5 px-3"
                  >
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
                  src={SCENE_ASSETS.mascot}
                  width="46"
                  height="46"
                  alt=""
                  className="w-11 h-11 rounded-full object-cover border-2 border-ink bg-white shrink-0"
                />
                <div className="flex items-start gap-2 min-w-0">
                  {feedback.type === 'error' && <AlertIcon className="w-5 h-5 shrink-0 mt-0.5" />}
                  {feedback.type === 'success' && (
                    <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                  )}
                  <span>
                    {feedback.text ||
                      'Seret kartu ke Kotak Hak atau Kotak Kewajiban, atau ketuk kartu lalu pilih kotaknya!'}
                  </span>
                </div>
              </div>
            </div>

            {/* Full-Width Park Game Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
              {/* Unsorted Board-Game Card Deck */}
              <div className="lg:col-span-5 game-board-wood p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display font-extrabold text-lg text-ink m-0">
                    Dek Kartu ({remainingCards.length} tersisa)
                  </h2>
                  {selectedCard && (
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-gold border-2 border-ink text-ink">
                      Ketuk kotak tujuan
                    </span>
                  )}
                </div>

                {remainingCards.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-meadow-wash border-2 border-meadow text-center space-y-2">
                    <CheckCircleIcon className="w-10 h-10 text-meadow mx-auto" />
                    <p className="font-display font-extrabold text-lg text-ink m-0">
                      Semua 6 kartu sudah terpilah dengan tepat!
                    </p>
                    <p className="text-sm font-semibold text-ink-muted m-0">
                      Kunci Ruang 3 sudah terbuka. Lanjutkan ke Ruang 3 atau ulangi latihan sortir.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2.5 p-0 m-0 list-none">
                    {remainingCards.map((card) => {
                      const isSelected = selectedCardId === card.id;
                      const isDraggingThis = dragState?.card.id === card.id;

                      return (
                        <li key={card.id}>
                          <div
                            onPointerDown={(e) => handleCardPointerDown(e, card)}
                            onPointerMove={handleCardPointerMove}
                            onPointerUp={handleCardPointerUp}
                            onPointerCancel={handleCardPointerCancel}
                            style={{ touchAction: 'none' }}
                            className={`rounded-2xl border-[2.5px] p-3 transition-colors select-none cursor-grab active:cursor-grabbing ${
                              isDraggingThis
                                ? 'opacity-40 bg-gold-wash border-ink border-dashed'
                                : isSelected
                                ? 'bg-gold-wash border-ink shadow-[0_4px_0_#14261c]'
                                : 'bg-white border-ink shadow-[0_3px_0_#14261c] hover:bg-gold-wash/40'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={card.imageSrc}
                                width="72"
                                height="72"
                                alt=""
                                draggable={false}
                                className="w-18 h-18 rounded-xl object-cover border-2 border-ink bg-parchment shrink-0 pointer-events-none"
                              />
                              <div className="min-w-0 flex-1 space-y-2">
                                <button
                                  type="button"
                                  aria-pressed={isSelected}
                                  onClick={() => {
                                    if (suppressNextClickRef.current) {
                                      suppressNextClickRef.current = false;
                                      return;
                                    }
                                    setSelectedCardId((prev) =>
                                      prev === card.id ? null : card.id
                                    );
                                    onPlaySound('click');
                                  }}
                                  className="text-left w-full p-0 bg-transparent border-0 font-bold text-sm sm:text-base text-ink leading-snug cursor-grab active:cursor-grabbing"
                                >
                                  {card.text}
                                </button>

                                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                  <button
                                    type="button"
                                    data-direct-sort="true"
                                    aria-label={`Masukkan "${card.text}" ke Hak`}
                                    onClick={() => evaluatePlacement(card.id, 'hak')}
                                    className="story-btn story-btn-blue text-xs sm:text-sm py-1.5 px-3"
                                  >
                                    Hak
                                  </button>
                                  <button
                                    type="button"
                                    data-direct-sort="true"
                                    aria-label={`Masukkan "${card.text}" ke Kewajiban`}
                                    onClick={() => evaluatePlacement(card.id, 'kewajiban')}
                                    className="story-btn story-btn-green text-xs sm:text-sm py-1.5 px-3"
                                  >
                                    Kewajiban
                                  </button>
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

              {/* Twin Wooden-Trimmed Game Target Chests */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Chest 1: Kotak Hak */}
                <div
                  ref={hakZoneRef}
                  data-drop-zone="hak"
                  className={`rounded-3xl border-[4px] p-4 space-y-3 min-h-80 transition-all ${
                    hoverZone === 'hak'
                      ? 'bg-sky-wash border-sky border-dashed scale-[1.01] shadow-[0_0_0_4px_#f2b705]'
                      : 'bg-sky-wash/95 border-sky shadow-[0_6px_0_#0f4873]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b-2 border-sky/40">
                    <h3 className="font-display font-extrabold text-xl text-ink m-0">Kotak Hak</h3>
                    <span className="px-3 py-0.5 rounded-xl bg-sky text-white border-2 border-ink text-xs font-extrabold">
                      {hakCards.length}/3
                    </span>
                  </div>

                  {selectedCard && (
                    <button
                      type="button"
                      onClick={() => evaluatePlacement(selectedCard.id, 'hak')}
                      className="story-btn story-btn-blue w-full text-sm"
                    >
                      Letakkan Kartu Terpilih di Sini
                    </button>
                  )}

                  {hoverZone === 'hak' && (
                    <p className="text-sm font-extrabold text-sky bg-white border-2 border-sky rounded-xl px-3 py-2 text-center m-0">
                      Lepaskan kartu di Kotak Hak!
                    </p>
                  )}

                  {hakCards.length === 0 ? (
                    <p className="text-sm font-semibold text-ink-muted bg-white/95 border-2 border-dashed border-sky/60 rounded-2xl p-5 text-center m-0">
                      Belum ada kartu di kotak Hak. Seret kartu ke sini atau pilih tombol Hak pada
                      kartu.
                    </p>
                  ) : (
                    <ul className="space-y-2.5 p-0 m-0 list-none">
                      {hakCards.map((card) => (
                        <li
                          key={card.id}
                          className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border-2 border-ink shadow-[0_3px_0_#14261c] text-ink"
                        >
                          <img
                            src={card.imageSrc}
                            width="52"
                            height="52"
                            alt=""
                            className="w-13 h-13 rounded-xl object-cover border-2 border-ink shrink-0"
                          />
                          <span className="text-sm font-bold flex-1 leading-snug">{card.text}</span>
                          <CheckCircleIcon className="w-5 h-5 text-sky shrink-0" />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Chest 2: Kotak Kewajiban */}
                <div
                  ref={kewajibanZoneRef}
                  data-drop-zone="kewajiban"
                  className={`rounded-3xl border-[4px] p-4 space-y-3 min-h-80 transition-all ${
                    hoverZone === 'kewajiban'
                      ? 'bg-meadow-wash border-meadow border-dashed scale-[1.01] shadow-[0_0_0_4px_#f2b705]'
                      : 'bg-meadow-wash/95 border-meadow shadow-[0_6px_0_#125232]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b-2 border-meadow/40">
                    <h3 className="font-display font-extrabold text-xl text-ink m-0">
                      Kotak Kewajiban
                    </h3>
                    <span className="px-3 py-0.5 rounded-xl bg-meadow text-white border-2 border-ink text-xs font-extrabold">
                      {kewajibanCards.length}/3
                    </span>
                  </div>

                  {selectedCard && (
                    <button
                      type="button"
                      onClick={() => evaluatePlacement(selectedCard.id, 'kewajiban')}
                      className="story-btn story-btn-green w-full text-sm"
                    >
                      Letakkan Kartu Terpilih di Sini
                    </button>
                  )}

                  {hoverZone === 'kewajiban' && (
                    <p className="text-sm font-extrabold text-meadow bg-white border-2 border-meadow rounded-xl px-3 py-2 text-center m-0">
                      Lepaskan kartu di Kotak Kewajiban!
                    </p>
                  )}

                  {kewajibanCards.length === 0 ? (
                    <p className="text-sm font-semibold text-ink-muted bg-white/95 border-2 border-dashed border-meadow/60 rounded-2xl p-5 text-center m-0">
                      Belum ada kartu di kotak Kewajiban. Seret kartu ke sini atau pilih tombol
                      Kewajiban pada kartu.
                    </p>
                  ) : (
                    <ul className="space-y-2.5 p-0 m-0 list-none">
                      {kewajibanCards.map((card) => (
                        <li
                          key={card.id}
                          className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border-2 border-ink shadow-[0_3px_0_#14261c] text-ink"
                        >
                          <img
                            src={card.imageSrc}
                            width="52"
                            height="52"
                            alt=""
                            className="w-13 h-13 rounded-xl object-cover border-2 border-ink shrink-0"
                          />
                          <span className="text-sm font-bold flex-1 leading-snug">{card.text}</span>
                          <CheckCircleIcon className="w-5 h-5 text-meadow shrink-0" />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <RoomFooterNav
          onGoMap={onGoMap}
          onBack={() => {
            if (subPage === 2) {
              setSubPage(1);
              onPlaySound('click');
            } else {
              onGoMap();
            }
          }}
          backLabel={subPage === 2 ? 'Kembali ke Pengantar' : 'Kembali'}
          onNext={
            subPage === 1
              ? () => {
                  setSubPage(2);
                  onPlaySound('click');
                }
              : canAdvanceRoom
              ? onGoNextRoom
              : undefined
          }
          nextLabel={subPage === 1 ? 'Lanjut ke Sortir Kartu' : 'Lanjut ke Ruang 3'}
          nextVariant={subPage === 1 ? 'gold' : 'green'}
          lockedHint={
            subPage === 2 && !canAdvanceRoom
              ? 'Pilah semua 6 kartu ke kotak yang benar untuk membuka kunci Ruang 3.'
              : ''
          }
        />
      </div>

      {/* Floating illustrated drag preview following mouse/touch pointer */}
      {dragState && (
        <div
          aria-hidden="true"
          style={{
            left: `${dragState.x}px`,
            top: `${dragState.y}px`,
          }}
          className="fixed z-50 -translate-x-1/2 -translate-y-1/2 rotate-2 pointer-events-none w-72 p-3 rounded-2xl bg-gold-wash border-[3px] border-ink shadow-[0_8px_0_#14261c] flex items-center gap-3"
        >
          <img
            src={dragState.card.imageSrc}
            width="56"
            height="56"
            alt=""
            className="w-14 h-14 rounded-xl object-cover border-2 border-ink bg-white shrink-0"
          />
          <span className="text-sm font-extrabold text-ink leading-snug">
            {dragState.card.text}
          </span>
        </div>
      )}
    </section>
  );
}
