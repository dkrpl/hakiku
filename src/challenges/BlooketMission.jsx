import React, { useState } from 'react';
import { SCENES } from '../data/defaultContent';
import { CheckCircleIcon, ExternalLinkIcon } from '../components/icons/StoryIcons';

/**
 * Misi Blooket: dibuka di tab baru (Blooket tidak bisa disematkan di halaman lain).
 * Guru menekan "Misi Blooket Selesai" setelah permainan kelas berakhir.
 */
export function BlooketMission({ blooketUrl, onDone, onPlaySound }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="game-board-wood p-5 sm:p-6 space-y-4 max-w-3xl w-full mx-auto">
      <div className="flex items-center gap-3">
        <img
          src={SCENES.mascot}
          width="56"
          height="56"
          alt=""
          className="w-14 h-14 rounded-full object-cover border-[3px] border-ink bg-gold-wash shrink-0"
        />
        <div>
          <h2 className="story-heading-page font-extrabold m-0">Misi Blooket</h2>
          <p className="text-sm font-bold text-meadow m-0">Kuis sudah beres! Sekarang main bersama satu kelas.</p>
        </div>
      </div>

      <ol className="list-decimal space-y-2 pl-6 m-0 story-body font-semibold text-ink">
        <li>Guru menekan tombol <strong>Mulai Misi Blooket</strong>. Permainan terbuka di tab baru.</li>
        <li>Semua siswa ikut bermain dan menjawab soal di Blooket.</li>
        <li>Setelah permainan selesai, kembali ke tab ini lalu tekan <strong>Misi Blooket Selesai</strong>.</li>
      </ol>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={blooketUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setOpened(true);
            onPlaySound('click');
          }}
          className="story-btn story-btn-gold text-base sm:text-lg px-6 py-3.5"
        >
          <span>Mulai Misi Blooket</span>
          <ExternalLinkIcon className="w-5 h-5 shrink-0" />
        </a>
        <button type="button" onClick={onDone} className="story-btn story-btn-green text-base sm:text-lg px-6 py-3.5">
          <CheckCircleIcon className="w-5 h-5 shrink-0" />
          <span>Misi Blooket Selesai</span>
        </button>
      </div>

      {!opened && (
        <p className="text-xs font-bold text-ink-muted m-0">
          Butuh internet. Tautan Blooket diatur guru di Google Sheets (tab Pengaturan).
        </p>
      )}
    </div>
  );
}
