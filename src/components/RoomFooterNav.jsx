import React from 'react';
import { BackIcon, MapIcon, NextIcon } from './icons/StoryIcons';

export function RoomFooterNav({
  onGoMap,
  onBack,
  backLabel = 'Kembali',
  onNext,
  nextLabel = 'Lanjut',
  nextVariant = 'gold',
  lockedHint = '',
}) {
  const nextStyle = nextVariant === 'green' ? 'story-btn-green' : 'story-btn-gold';

  return (
    <nav
      aria-label="Navigasi ruangan"
      className="relative z-20 w-full mt-4 pt-3 pb-2"
    >
      <div className="bg-parchment/95 border-[3px] border-ink rounded-2xl px-3.5 sm:px-5 py-3 shadow-[0_5px_0_#14261c] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onGoMap}
            className="story-btn story-btn-paper text-sm sm:text-base"
          >
            <MapIcon className="w-5 h-5 shrink-0" />
            <span>Beranda (Peta)</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="story-btn story-btn-paper text-sm sm:text-base"
          >
            <BackIcon className="w-5 h-5 shrink-0" />
            <span>{backLabel}</span>
          </button>
        </div>

        <div className="sm:text-right">
          {onNext ? (
            <button
              type="button"
              onClick={onNext}
              className={`story-btn ${nextStyle} w-full sm:w-auto text-sm sm:text-base`}
            >
              <span>{nextLabel}</span>
              <NextIcon className="w-5 h-5 shrink-0" />
            </button>
          ) : (
            lockedHint && (
              <p className="text-xs sm:text-sm font-extrabold text-ink bg-gold-wash border-2 border-ink rounded-xl px-3.5 py-2 m-0">
                {lockedHint}
              </p>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
