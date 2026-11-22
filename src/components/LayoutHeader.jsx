import React from 'react';
import { HakikuCrest } from './illustrations/StoryArt';
import {
  GearIcon,
  KeyIcon,
  MapIcon,
  VolumeOffIcon,
  VolumeOnIcon,
} from './icons/StoryIcons';

export function LayoutHeader({
  currentView,
  completedRooms,
  completedCount,
  totalRooms,
  audioMuted,
  demoUnlockAll,
  onGoIntro,
  onGoMap,
  onToggleAudio,
  onOpenTeacherMode,
  onDisableDemoMode,
}) {
  const showMapButton = currentView !== 'intro' && currentView !== 'map';
  const roomSlots = [1, 2, 3, 4, 5];

  return (
    <header className="fixed top-0 inset-x-0 z-30 pointer-events-none">
      <div className="w-full px-3 sm:px-5 pt-2.5 pb-1.5 flex items-center justify-between gap-2">
        {/* Left HUD Cluster: Game Brand Crest + Map Button */}
        <div className="flex items-center gap-2 min-w-0 shrink-0 pointer-events-auto">
          <button
            type="button"
            onClick={onGoIntro}
            className="story-btn story-btn-blue px-2 sm:px-3 py-1.5 min-h-11"
            aria-label="HAKIKU - Kembali ke Halaman Pembuka"
          >
            <HakikuCrest className="w-8 h-8 shrink-0" />
            <span className={`${showMapButton ? 'hidden sm:inline' : 'inline'} font-display font-extrabold text-base sm:text-lg text-white`}>
              HAKIKU
            </span>
          </button>

          {showMapButton && (
            <button
              type="button"
              onClick={onGoMap}
              className="story-btn story-btn-gold text-sm px-2.5 sm:px-3.5 py-2 shrink-0"
            >
              <MapIcon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Peta Dunia</span>
              <span className="sm:hidden">Peta</span>
            </button>
          )}
        </div>

        {/* Right HUD Cluster: 5-Key Progress Plaque + Sound + Mode Guru */}
        <nav
          aria-label="Kontrol aplikasi"
          className="flex items-center gap-1.5 sm:gap-2 shrink-0 pointer-events-auto"
        >
          <div
            role="status"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-11 rounded-2xl bg-gold border-[2.5px] border-ink text-xs sm:text-sm font-extrabold text-ink whitespace-nowrap shadow-[0_4px_0_#14261c]"
            aria-label={`Progres kunci: ${completedCount} dari ${totalRooms} kunci terkumpul`}
          >
            <KeyIcon className="w-4 h-4 shrink-0 text-ink" />
            <span>
              {completedCount}/{totalRooms}
            </span>
            <span className="hidden lg:inline">Kunci</span>
            <span aria-hidden="true" className="hidden md:inline-flex items-center gap-1 ml-1">
              {roomSlots.map((num) => (
                <span
                  key={num}
                  className={`w-2.5 h-2.5 rounded-full border border-ink ${
                    completedRooms?.[`room${num}`] ? 'bg-meadow' : 'bg-parchment'
                  }`}
                />
              ))}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleAudio}
            aria-pressed={audioMuted}
            aria-label={audioMuted ? 'Aktifkan efek suara' : 'Matikan efek suara'}
            className="story-btn story-btn-paper px-2.5 sm:px-3 py-2 text-sm"
          >
            {audioMuted ? (
              <VolumeOffIcon className="w-5 h-5 shrink-0" />
            ) : (
              <VolumeOnIcon className="w-5 h-5 shrink-0" />
            )}
            <span className="hidden lg:inline">{audioMuted ? 'Suara Mati' : 'Suara'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenTeacherMode}
            aria-label="Buka Mode Guru"
            className="story-btn story-btn-green px-2.5 sm:px-3.5 py-2 text-sm"
          >
            <GearIcon className="w-5 h-5 shrink-0" />
            <span className="hidden sm:inline">Mode Guru</span>
          </button>
        </nav>
      </div>

      {demoUnlockAll && (
        <div className="px-3 sm:px-5 pb-1.5 flex justify-center pointer-events-none">
          <div
            role="status"
            className="pointer-events-auto inline-flex flex-wrap items-center justify-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-gold-wash border-[2.5px] border-ink shadow-[0_4px_0_#14261c] text-xs sm:text-sm"
          >
            <p className="font-extrabold text-ink m-0">
              Mode Demo Sidang Aktif: seluruh ruangan (1 sampai 5) dan Halaman Akhir terbuka.
            </p>
            <button
              type="button"
              onClick={onDisableDemoMode}
              className="story-btn story-btn-paper text-xs py-1 px-3 min-h-11"
            >
              Matikan Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
