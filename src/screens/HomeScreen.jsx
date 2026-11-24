import React, { useState } from 'react';
import { ROOM_NUMBERS, SCENES } from '../data/defaultContent';
import { AlertIcon, CheckCircleIcon, ExternalLinkIcon, KeyIcon } from '../components/icons/StoryIcons';

const SOURCE_LABEL = {
  sheets: { text: 'Data dari Google Sheets', tone: 'ok' },
  cache: { text: 'Data tersimpan terakhir dari Google Sheets (offline)', tone: 'warn' },
  bawaan: { text: 'Data bawaan aplikasi', tone: 'info' },
};

function roomLink(n) {
  if (typeof window === 'undefined') return `?ruang=${n}`;
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('ruang', String(n));
  return url.toString();
}

/**
 * Halaman guru: daftar link tantangan untuk ditempel ke tombol di Canva,
 * status sumber data, dan kode pintu (disembunyikan secara bawaan).
 */
export function HomeScreen({ content, loadInfo, onPlaySound }) {
  const [showCodes, setShowCodes] = useState(false);
  const [copied, setCopied] = useState(null);
  const source = SOURCE_LABEL[loadInfo.source] || SOURCE_LABEL.bawaan;

  async function copyLink(n) {
    try {
      await navigator.clipboard.writeText(roomLink(n));
      setCopied(n);
      onPlaySound('click');
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(-1);
    }
  }

  return (
    <section className="game-stage pt-18 sm:pt-20 pb-6 px-3 sm:px-6 lg:px-8">
      <img src={SCENES.home} width="1280" height="720" alt="" className="game-backdrop-img" />
      <div aria-hidden="true" className="fixed inset-0 bg-ink/35 pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl w-full mx-auto space-y-4">
        <div className="story-panel p-5 sm:p-6 space-y-3">
          <h1 className="story-heading-page font-extrabold m-0">Daftar Tantangan HAKIKU</h1>
          <p className="story-body text-ink m-0">
            Halaman ini untuk guru. Untuk pembelajaran di kelas, pakai <strong>Mode Kelas</strong>: Canva tampil di
            dalam web dalam layar penuh, dan siswa membuka tantangan lewat tombol <strong>🎮 Tantangan</strong> tanpa
            pindah tab. Link per ruang di bawah tetap bisa dipakai bila tantangan ingin dibuka terpisah.
          </p>
          <a href="./" className="story-btn story-btn-gold self-start inline-flex text-base px-5 py-2.5">
            ▶ Mode Kelas (layar penuh)
          </a>

          <div
            role="status"
            className={`flex items-start gap-2 px-3 py-2 rounded-xl border-2 text-sm font-extrabold ${
              source.tone === 'ok'
                ? 'bg-meadow-wash border-meadow text-meadow'
                : source.tone === 'warn'
                ? 'bg-gold-wash border-ink text-amber-ink'
                : 'bg-sky-wash border-sky text-sky'
            }`}
          >
            {source.tone === 'ok' ? (
              <CheckCircleIcon className="w-5 h-5 shrink-0" />
            ) : (
              <AlertIcon className="w-5 h-5 shrink-0" />
            )}
            <div className="space-y-1">
              <p className="m-0">{source.text}</p>
              {loadInfo.error && <p className="m-0 font-bold">Catatan: {loadInfo.error}</p>}
            </div>
          </div>

          {loadInfo.warnings.length > 0 && (
            <details className="rounded-xl border-2 border-ink bg-white px-3 py-2">
              <summary className="font-extrabold text-sm text-crimson-ink">
                {loadInfo.warnings.length} isian di Google Sheets perlu dicek
              </summary>
              <ul className="mt-2 mb-1 pl-5 space-y-1 text-sm text-ink">
                {loadInfo.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </details>
          )}
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 p-0 m-0 list-none">
          {ROOM_NUMBERS.map((n) => {
            const room = content.rooms[n];
            return (
              <li key={n} className="game-board-wood p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-extrabold text-wood m-0">RUANG {n}</p>
                    <h2 className="font-display font-extrabold text-xl text-ink m-0">{room.title}</h2>
                    <p className="text-sm font-bold text-ink-muted m-0">
                      {room.type === 'sortir'
                        ? `Sortir ${room.cards.length} kartu: ${room.leftLabel} / ${room.rightLabel}`
                        : `Kuis ${room.questions.length} soal`}
                      {room.showBlooket ? ' + Misi Blooket' : ''}
                    </p>
                  </div>
                  {showCodes && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-chalkboard text-gold font-display font-extrabold border-2 border-ink">
                      <KeyIcon className="w-4 h-4" />
                      {room.doorCode}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={`?ruang=${n}`} className="story-btn story-btn-green text-sm">
                    <span>Buka</span>
                    <ExternalLinkIcon className="w-4 h-4 shrink-0" />
                  </a>
                  <button type="button" onClick={() => copyLink(n)} className="story-btn story-btn-paper text-sm">
                    {copied === n ? 'Link tersalin!' : 'Salin link'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="story-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm font-bold text-ink m-0">
            Kode pintu harus sama dengan tombol kode yang benar di Canva. Tampilkan hanya saat menyiapkan Canva.
          </p>
          <button
            type="button"
            onClick={() => setShowCodes((v) => !v)}
            aria-pressed={showCodes}
            className="story-btn story-btn-wood text-sm shrink-0"
          >
            {showCodes ? 'Sembunyikan kode pintu' : 'Tampilkan kode pintu'}
          </button>
        </div>
        {copied === -1 && (
          <p role="alert" className="text-sm font-extrabold text-white m-0">
            Browser menolak menyalin otomatis. Klik kanan tombol Buka lalu pilih "Salin alamat link".
          </p>
        )}
      </div>
    </section>
  );
}
