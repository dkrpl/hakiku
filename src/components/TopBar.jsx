import React from 'react';
import { HakikuCrest } from './illustrations/StoryArt';
import { VolumeOffIcon, VolumeOnIcon } from './icons/StoryIcons';

export function TopBar({ muted, onToggleSound }) {
  return (
    <header className="fixed top-0 inset-x-0 z-30 px-3 sm:px-6 lg:px-8 py-2.5 bg-parchment/95 border-b-[3px] border-ink">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <HakikuCrest className="w-10 h-10 shrink-0" />
          <div className="leading-tight">
            <p className="font-display font-extrabold text-lg sm:text-xl text-ink m-0">HAKIKU</p>
            <p className="text-xs font-bold text-ink-muted m-0">Tantangan Dunia Hak dan Kewajibanku</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={!muted}
          aria-label={muted ? 'Nyalakan suara' : 'Matikan suara'}
          className="story-btn story-btn-paper px-3"
        >
          {muted ? <VolumeOffIcon className="w-5 h-5" /> : <VolumeOnIcon className="w-5 h-5" />}
          <span className="hidden sm:inline">{muted ? 'Suara Mati' : 'Suara Nyala'}</span>
        </button>
      </div>
    </header>
  );
}
