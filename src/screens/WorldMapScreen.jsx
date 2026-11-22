import React from 'react';
import { ROOMS_META, SCENE_ASSETS } from '../data/hakikuData';
import { isFinaleAccessible, isRoomUnlocked } from '../utils/storage';
import {
  AlertIcon,
  CheckCircleIcon,
  KeyIcon,
  LockIcon,
  NextIcon,
} from '../components/icons/StoryIcons';

function MapHotspotButton({ room, unlocked, completed, demoUnlockAll, onSelect }) {
  const titleId = `room-node-title-${room.number}`;
  const descId = `room-node-desc-${room.number}`;

  let statusText = 'Terkunci';
  let sealClasses = 'bg-locked-bg text-locked-ink border-ink-border';
  let bubbleClasses = 'bg-locked-bg/95 border-ink-border text-locked-ink';
  let StatusIcon = LockIcon;

  if (completed) {
    statusText = 'Selesai';
    sealClasses = 'bg-meadow text-white border-ink';
    bubbleClasses = 'bg-white border-meadow text-ink hover:bg-meadow-wash';
    StatusIcon = CheckCircleIcon;
  } else if (unlocked) {
    statusText = demoUnlockAll && room.number > 1 ? 'Terbuka (Demo)' : 'Terbuka';
    sealClasses = 'bg-gold text-ink border-ink';
    bubbleClasses = 'bg-white border-ink text-ink hover:bg-gold-wash';
    StatusIcon = KeyIcon;
  }

  return (
    <button
      type="button"
      aria-labelledby={titleId}
      aria-describedby={descId}
      aria-disabled={!unlocked}
      onClick={() => onSelect(room, unlocked)}
      style={{ '--pin-x': room.mapPin.x, '--pin-y': room.mapPin.y }}
      className={`map-hotspot group w-full md:w-auto text-left rounded-2xl border-[3px] px-3 py-2.5 shadow-[0_5px_0_#14261c] transition-transform flex items-center gap-2.5 min-h-14 ${bubbleClasses} ${
        unlocked ? 'hover:-translate-y-1 active:translate-y-0.5' : 'opacity-95'
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 font-display font-extrabold text-base shrink-0 ${sealClasses}`}
      >
        <StatusIcon className="w-5 h-5 shrink-0" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold text-ink-muted leading-none mb-0.5">
          <span>POS {room.number}</span>
          <span>•</span>
          <span>{statusText}</span>
          {room.isDemoPlaceholder && (
            <span className="px-1.5 py-0.5 rounded bg-sky-wash border border-sky text-sky">
              Demo
            </span>
          )}
        </span>
        <span
          id={titleId}
          className="block font-display font-extrabold text-sm sm:text-base text-ink leading-tight"
        >
          Ruang {room.number}: {room.title}
        </span>
        <span id={descId} className="block md:hidden text-xs text-ink-muted mt-0.5">
          {room.summary}
        </span>
      </span>

      {unlocked && <NextIcon className="w-4 h-4 shrink-0 text-ink" />}

      {/* Speech-bubble pointer tail visible on full-screen illustrated map (tablet/desktop) */}
      <span
        aria-hidden="true"
        className={`hidden md:block absolute left-1/2 -bottom-2.5 -translate-x-1/2 w-4 h-4 rotate-45 border-r-[3px] border-b-[3px] ${
          completed
            ? 'bg-white border-meadow'
            : unlocked
            ? 'bg-white border-ink'
            : 'bg-locked-bg border-ink-border'
        }`}
      />
    </button>
  );
}

export function WorldMapScreen({
  appState,
  mapNotice,
  onClearMapNotice,
  onEnterRoom,
  onBlockedRoomClick,
  onOpenFinale,
}) {
  const finaleOpen = isFinaleAccessible(appState);
  const demoUnlockAll = appState.teacherSettings.demoUnlockAll;

  function handleSelectRoom(room, unlocked) {
    if (!unlocked) {
      onBlockedRoomClick(room);
      return;
    }
    onEnterRoom(room.number);
  }

  return (
    <section className="animate-screen-enter game-stage pt-16 sm:pt-18 md:pt-0">
      {/* Full-screen interactive illustrated world map container */}
      <div className="relative flex-1 w-full md:min-h-dvh flex flex-col justify-between">
        {/* Background full-bleed map image: fills 100% viewport on md+, crisp 16:9 showcase at top on mobile */}
        <img
          src={SCENE_ASSETS.worldMap}
          width="1280"
          height="720"
          alt="Peta dunia petualangan HAKIKU dengan lima bangunan: Sekolah Desa, Taman Hak, Balai Kewajiban, Jembatan Lingkungan, dan Menara Tantangan"
          className="w-full h-auto md:fixed md:inset-0 md:w-full md:h-full md:object-cover block z-0 pointer-events-none"
        />

        {/* Floating title ribbon at top-center on desktop, compact banner on mobile */}
        <div className="relative z-20 px-3 sm:px-5 pt-3 md:pt-18 flex justify-center pointer-events-none">
          <div className="pointer-events-auto game-ribbon text-base sm:text-lg px-4 py-1.5">
            <h1 className="font-display font-extrabold text-base sm:text-lg text-white m-0">
              Peta Dunia HAKIKU
            </h1>
          </div>
        </div>

        {/* Single DOM set of 5 interactive room pins: absolute on full-screen map at md+, vertical game mission list on mobile */}
        <div className="relative z-10 flex-1 w-full px-3 sm:px-4 py-3 md:p-0 space-y-2.5 md:space-y-0 md:static bg-parchment md:bg-transparent">
          {ROOMS_META.map((room) => {
            const unlocked = isRoomUnlocked(appState, room.number);
            const completed = Boolean(appState.completedRooms[room.id]);

            return (
              <MapHotspotButton
                key={room.id}
                room={room}
                unlocked={unlocked}
                completed={completed}
                demoUnlockAll={demoUnlockAll}
                onSelect={handleSelectRoom}
              />
            );
          })}
        </div>

        {/* Bottom in-world game dock: Left = Mascot Dialogue / Alert, Right = Gerbang Akhir */}
        <div className="relative z-20 px-3 sm:px-5 pb-4 pt-2 flex flex-col lg:flex-row lg:items-end justify-between gap-3 bg-parchment md:bg-transparent pointer-events-none">
          {/* Mascot Dialogue Box */}
          <div
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl border-[3px] shadow-[0_5px_0_#14261c] max-w-xl ${
              mapNotice
                ? 'bg-crimson-wash border-crimson text-crimson-ink'
                : 'bg-parchment/95 border-ink text-ink'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={SCENE_ASSETS.mascot}
                width="54"
                height="54"
                alt="Pemandu petualangan HAKIKU"
                className="w-13 h-13 rounded-full object-cover border-2 border-ink bg-gold-wash shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-wide m-0 opacity-80">
                  {mapNotice ? 'Gembok Terkunci' : 'Pemandu HAKIKU'}
                </p>
                <p className="text-sm sm:text-base font-bold m-0 flex items-start gap-1.5">
                  {mapNotice && <AlertIcon className="w-4 h-4 shrink-0 mt-1" />}
                  <span>
                    {mapNotice ||
                      'Ketuk bangunan yang sudah terbuka untuk memulai misi dan membuka gembok berikutnya!'}
                  </span>
                </p>
              </div>
            </div>

            {mapNotice && (
              <button
                type="button"
                onClick={onClearMapNotice}
                className="text-xs sm:text-sm font-extrabold underline shrink-0 px-2 py-2 min-h-11"
              >
                Tutup
              </button>
            )}
          </div>

          {/* Gerbang Akhir Plaque */}
          <div
            className={`pointer-events-auto rounded-2xl border-[3px] px-4 py-3 shadow-[0_5px_0_#14261c] flex flex-col sm:flex-row sm:items-center gap-3 ${
              finaleOpen
                ? 'bg-gold-wash border-ink text-ink'
                : 'bg-parchment/95 border-ink text-ink'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border-2 shrink-0 ${
                  finaleOpen
                    ? 'bg-gold text-ink border-ink'
                    : 'bg-locked-bg text-locked-ink border-ink-border'
                }`}
              >
                {finaleOpen ? <KeyIcon className="w-5 h-5" /> : <LockIcon className="w-5 h-5" />}
              </span>
              <div>
                <h2 className="font-display font-extrabold text-sm sm:text-base text-ink m-0">
                  Gerbang Akhir
                </h2>
                <p className="text-xs font-bold text-ink-muted m-0">
                  {finaleOpen ? 'Siap dibuka sekarang!' : 'Selesaikan Ruang 5 dulu'}
                </p>
              </div>
            </div>

            {finaleOpen && (
              <button
                type="button"
                onClick={onOpenFinale}
                className="story-btn story-btn-gold text-sm shrink-0"
              >
                <span>
                  {demoUnlockAll && !appState.completedRooms.room5
                    ? 'Lihat Halaman Akhir (Demo)'
                    : 'Lihat Halaman Akhir'}
                </span>
                <NextIcon className="w-4 h-4 shrink-0" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
