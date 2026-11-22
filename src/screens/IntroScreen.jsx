import React from 'react';
import { SCENE_ASSETS } from '../data/hakikuData';
import { KeyIcon, NextIcon } from '../components/icons/StoryIcons';

export function IntroScreen({ completedCount, totalRooms, onStart }) {
  const hasProgress = completedCount > 0;

  return (
    <section className="animate-screen-enter game-stage pt-18 sm:pt-20 pb-4 px-3 sm:px-6 lg:px-8">
      {/* Full-screen edge-to-edge illustrated game opening world */}
      <img
        src={SCENE_ASSETS.intro}
        width="1280"
        height="720"
        fetchPriority="high"
        alt="Ilustrasi peta petualangan buku cerita HAKIKU menampilkan dua siswa SD Indonesia berjalan ceria menuju gerbang sekolah desa"
        className="game-backdrop-img"
      />

      {/* Upper-left floating game title plaque kept clear of the walking children */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-between gap-4 py-2">
        <div className="max-w-md lg:max-w-lg mt-1 sm:mt-3">
          <div className="game-board-wood p-5 sm:p-6 space-y-3.5">
            <div className="flex items-center gap-3.5">
              <img
                src={SCENE_ASSETS.mascot}
                width="68"
                height="68"
                alt="Pemandu petualangan HAKIKU memegang kunci emas"
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-[3px] border-ink bg-gold-wash shrink-0"
              />
              <div>
                <h1 className="story-heading-hero font-extrabold tracking-tight text-ink m-0 leading-none">
                  HAKIKU
                </h1>
                <p className="font-display font-bold text-base sm:text-xl text-meadow m-0 mt-1">
                  Dunia Petualangan Hak dan Kewajibanku
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base font-bold text-ink m-0">
              Ayo masuk ke dunia petualangan <em>escape room</em>! Jelajahi 5 pos di desa, taman,
              dan sekolah untuk mengumpulkan semua kunci emas.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onStart}
                className="story-btn story-btn-gold text-lg sm:text-xl px-7 py-3.5 min-h-14 w-full sm:w-auto"
              >
                <span>{hasProgress ? 'Lanjutkan Petualangan' : 'Mulai Petualangan'}</span>
                <NextIcon className="w-6 h-6 shrink-0" />
              </button>

              {hasProgress && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-meadow-wash border-2 border-meadow text-sm font-extrabold text-meadow self-start sm:self-auto">
                  <KeyIcon className="w-4 h-4 shrink-0" />
                  <span>
                    {completedCount}/{totalRooms} Kunci
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom floating game info strip */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 rounded-2xl bg-parchment/95 border-[2.5px] border-ink shadow-[0_4px_0_#14261c] text-xs sm:text-sm font-extrabold text-ink">
            <span>5 Ruang Bergembok Otomatis</span>
            <span>Smartboard, Mouse & HP</span>
            <span>Mode Guru (PIN 1234)</span>
          </div>
          <span className="px-3.5 py-2 rounded-2xl bg-wood text-gold-wash border-[2.5px] border-ink shadow-[0_4px_0_#14261c] text-xs sm:text-sm font-extrabold">
            Prototype Demo v1.0
          </span>
        </div>
      </div>
    </section>
  );
}
