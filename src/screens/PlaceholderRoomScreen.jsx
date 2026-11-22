import React, { useRef, useState } from 'react';
import { PLACEHOLDER_ROOMS, SCENE_ASSETS } from '../data/hakikuData';
import { RoomFooterNav } from '../components/RoomFooterNav';
import { CheckCircleIcon, KeyIcon } from '../components/icons/StoryIcons';

export function PlaceholderRoomScreen({
  roomKey,
  isCompleted,
  demoUnlockAll,
  onComplete,
  onGoMap,
  onGoNextRoom,
  onPlaySound,
}) {
  const config = PLACEHOLDER_ROOMS[roomKey];
  const [subPage, setSubPage] = useState(1);
  const tab1Ref = useRef(null);
  const tab2Ref = useRef(null);

  function handleTabKeyDown(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const nextTab = subPage === 1 ? 2 : 1;
      setSubPage(nextTab);
      (nextTab === 1 ? tab1Ref : tab2Ref).current?.focus();
    }
  }

  const canAdvanceRoom = isCompleted || demoUnlockAll;
  const tab1Id = `${roomKey}-tab-1`;
  const tab2Id = `${roomKey}-tab-2`;
  const panel1Id = `${roomKey}-panel-1`;
  const panel2Id = `${roomKey}-panel-2`;

  return (
    <section className="animate-screen-enter game-stage pt-18 sm:pt-20 pb-4 px-3 sm:px-6 lg:px-8">
      {/* Full-screen vivid piket classroom (R3) or community village (R4) world */}
      <img
        src={config.sceneImage}
        width="1280"
        height="720"
        alt={config.sceneAlt}
        className="game-backdrop-img"
      />
      <div aria-hidden="true" className="fixed inset-0 bg-ink/20 pointer-events-none z-0" />

      <div className="relative z-10 w-full flex-1 flex flex-col justify-between gap-4">
        {/* Top Wood Ribbon & Stage Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="game-ribbon">
              <span className="px-2 py-0.5 rounded-lg bg-gold text-ink text-xs font-extrabold">
                POS {config.roomNumber}
              </span>
              <h1 className="font-display font-extrabold text-base sm:text-xl text-white m-0">
                {config.title}
              </h1>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-sky-wash border-2 border-ink text-sky text-xs font-extrabold shadow-[0_3px_0_#14261c]">
              {config.badgeLabel}
            </span>
          </div>

          <div
            role="tablist"
            aria-label={`Sub-halaman Ruang ${config.roomNumber}`}
            onKeyDown={handleTabKeyDown}
            className="flex flex-wrap gap-2"
          >
            <button
              ref={tab1Ref}
              type="button"
              role="tab"
              id={tab1Id}
              aria-selected={subPage === 1}
              aria-controls={panel1Id}
              tabIndex={subPage === 1 ? 0 : -1}
              onClick={() => {
                setSubPage(1);
                onPlaySound('click');
              }}
              className={`story-btn text-sm px-4 py-2 ${
                subPage === 1 ? 'story-btn-gold' : 'story-btn-paper'
              }`}
            >
              1. Kerangka Materi
            </button>
            <button
              ref={tab2Ref}
              type="button"
              role="tab"
              id={tab2Id}
              aria-selected={subPage === 2}
              aria-controls={panel2Id}
              tabIndex={subPage === 2 ? 0 : -1}
              onClick={() => {
                setSubPage(2);
                onPlaySound('click');
              }}
              className={`story-btn text-sm px-4 py-2 ${
                subPage === 2 ? 'story-btn-gold' : 'story-btn-paper'
              }`}
            >
              2. Simulasi Demo
            </button>
          </div>
        </div>

        {/* Floating Wooden Quest Board leaving rich game scene breathing around it */}
        <div className="flex-1 flex flex-col justify-end sm:justify-center max-w-5xl w-full mx-auto">
          {subPage === 1 && (
            <div
              id={panel1Id}
              role="tabpanel"
              aria-labelledby={tab1Id}
              className="game-board-wood p-5 sm:p-7 space-y-5"
            >
              <div className="flex items-center gap-3">
                <img
                  src={SCENE_ASSETS.mascot}
                  width="54"
                  height="54"
                  alt=""
                  className="w-13 h-13 rounded-full object-cover border-2 border-ink bg-gold-wash shrink-0"
                />
                <p className="story-body font-bold text-ink m-0">{config.overview}</p>
              </div>

              <div
                className={`grid grid-cols-1 gap-4 ${
                  config.sections.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
                }`}
              >
                {config.sections.map((section) => (
                  <article
                    key={section.heading}
                    className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-dashed border-ink space-y-2 shadow-[0_3px_0_#6f634f]"
                  >
                    <span className="inline-block px-2.5 py-0.5 rounded-lg bg-sky-wash border border-sky text-sky text-xs font-extrabold">
                      {section.artSlot}
                    </span>
                    <h2 className="font-display font-extrabold text-lg text-ink m-0">
                      {section.heading}
                    </h2>
                    <p className="text-sm font-semibold text-ink-muted m-0">
                      {section.placeholderNote}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}

          {subPage === 2 && (
            <div
              id={panel2Id}
              role="tabpanel"
              aria-labelledby={tab2Id}
              className="game-board-wood p-5 sm:p-7 max-w-2xl mx-auto w-full space-y-4 text-center"
            >
              <div className="flex justify-center">
                <img
                  src={SCENE_ASSETS.mascot}
                  width="76"
                  height="76"
                  alt=""
                  className="w-19 h-19 rounded-full object-cover border-[3px] border-ink bg-gold-wash"
                />
              </div>

              {isCompleted && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-meadow-wash border-2 border-meadow text-meadow text-sm font-extrabold">
                  <CheckCircleIcon className="w-4 h-4 shrink-0" />
                  <span>Kunci Ruang {config.nextRoomNumber} Sudah Terbuka</span>
                </span>
              )}

              <h2 className="story-heading-page font-extrabold m-0">{config.challengeHeading}</h2>
              <p className="story-body font-semibold text-ink-muted m-0">
                {config.challengeDescription}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onComplete}
                  className="story-btn story-btn-gold text-base sm:text-lg px-7 py-3.5"
                >
                  <KeyIcon className="w-5 h-5 shrink-0" />
                  <span>{config.demoButtonLabel}</span>
                </button>
              </div>
            </div>
          )}
        </div>

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
          backLabel={subPage === 2 ? 'Kembali ke Kerangka' : 'Kembali'}
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
          nextLabel={
            subPage === 1 ? 'Lanjut ke Simulasi' : `Lanjut ke Ruang ${config.nextRoomNumber}`
          }
          nextVariant={subPage === 1 ? 'gold' : 'green'}
          lockedHint={
            subPage === 2 && !canAdvanceRoom
              ? `Klik "${config.demoButtonLabel}" di atas untuk membuka kunci Ruang ${config.nextRoomNumber}.`
              : ''
          }
        />
      </div>
    </section>
  );
}
