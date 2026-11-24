import React, { useCallback, useEffect, useState } from 'react';
import { ROOM_NUMBERS, SCENES } from '../data/defaultContent';
import { buildCanvaEmbedUrl } from '../data/contentLoader';
import { HakikuCrest } from '../components/illustrations/StoryArt';
import { ChallengeScreen } from './ChallengeScreen';
import { CheckCircleIcon, CloseIcon, VolumeOffIcon, VolumeOnIcon } from '../components/icons/StoryIcons';

const PROGRESS_KEY = 'hakiku-hybrid:kelas-selesai';

function readProgress() {
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(PROGRESS_KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((n) => ROOM_NUMBERS.includes(n)) : [];
  } catch {
    return [];
  }
}

function saveProgress(list) {
  try {
    window.sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(list));
  } catch {
    // Abaikan jika penyimpanan browser diblokir.
  }
}

function isFullscreen() {
  return Boolean(typeof document !== 'undefined' && (document.fullscreenElement || document.webkitFullscreenElement));
}

function enterFullscreen() {
  const el = document.documentElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (!req) return;
  try {
    const p = req.call(el);
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch {
    // Browser menolak layar penuh: aplikasi tetap jalan seperti biasa.
  }
}

/**
 * MODE KELAS (halaman utama web).
 * Canva tampil DI DALAM web, dan tantangan muncul sebagai jendela di atas Canva.
 * Tidak pernah pindah tab, sehingga layar penuh tidak hilang dan slide Canva tetap di posisinya.
 */
export function ClassroomScreen({ content, onPlaySound, muted, onToggleSound }) {
  const embedUrl = buildCanvaEmbedUrl(content.settings);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(readProgress);
  const [activeRoom, setActiveRoom] = useState(null);
  const [full, setFull] = useState(isFullscreen);

  useEffect(() => {
    const onChange = () => setFull(isFullscreen());
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, []);

  useEffect(() => {
    document.title = activeRoom ? `Ruang ${activeRoom} - HAKIKU` : 'HAKIKU - Dunia Petualangan Hak dan Kewajibanku';
  }, [activeRoom]);

  const nextRoom = ROOM_NUMBERS.find((n) => !done.includes(n)) ?? null;

  function start(fresh) {
    onPlaySound('click');
    if (fresh) {
      setDone([]);
      saveProgress([]);
    }
    enterFullscreen();
    setStarted(true);
  }

  function openChallenge(n) {
    onPlaySound('click');
    setActiveRoom(n);
  }

  const closeChallenge = useCallback(() => setActiveRoom(null), []);

  const markDone = useCallback((n) => {
    setDone((prev) => {
      if (prev.includes(n)) return prev;
      const next = [...prev, n].sort((a, b) => a - b);
      saveProgress(next);
      return next;
    });
  }, []);

  if (!started) {
    return (
      <section className="game-stage items-center justify-center p-4 sm:p-8">
        <img src={SCENES.home} width="1280" height="720" alt="" className="game-backdrop-img" />
        <div aria-hidden="true" className="fixed inset-0 bg-ink/35 pointer-events-none z-0" />
        <div className="relative z-10 story-panel max-w-2xl w-full p-6 sm:p-10 text-center space-y-5 animate-screen-enter">
          <HakikuCrest className="w-24 h-24 mx-auto" />
          <div className="space-y-1">
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-ink m-0">HAKIKU</h1>
            <p className="story-body font-bold text-ink m-0">Dunia Petualangan Hak dan Kewajibanku</p>
          </div>

          {embedUrl ? (
            <>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button type="button" onClick={() => start(done.length === 0)} className="story-btn story-btn-gold text-xl sm:text-2xl px-8 py-4">
                  ▶ {done.length > 0 ? `Lanjutkan (Ruang ${nextRoom ?? 5})` : 'Mulai Petualangan'}
                </button>
                {done.length > 0 && (
                  <button type="button" onClick={() => start(true)} className="story-btn story-btn-paper text-lg px-6 py-4">
                    Mulai dari Awal
                  </button>
                )}
              </div>
              <p className="text-sm font-bold text-ink-muted m-0">
                Layar akan menjadi penuh. Tantangan dibuka lewat tombol <strong>🎮 Tantangan</strong> di pojok kanan atas.
              </p>
            </>
          ) : (
            <p role="alert" className="story-body font-bold text-ink m-0">
              Link Canva belum diisi. Isi <strong>link_canva</strong> di tab Pengaturan pada Google Sheets.
            </p>
          )}

          <a href="?guru=1" className="inline-block text-sm font-extrabold text-sky underline">
            Halaman guru (daftar tantangan &amp; kode pintu)
          </a>
        </div>
      </section>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0e1512]">
      <iframe
        src={embedUrl}
        title="Slide HAKIKU di Canva"
        className="canva-frame"
        referrerPolicy="strict-origin-when-cross-origin"
      />

      <div className="fixed top-3 left-3 z-30 flex gap-2">
        {!full && (
          <button type="button" onClick={enterFullscreen} className="story-btn story-btn-paper px-3 text-sm">
            ⛶ <span>Layar Penuh</span>
          </button>
        )}
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={!muted}
          aria-label={muted ? 'Nyalakan suara' : 'Matikan suara'}
          className="story-btn story-btn-paper px-3"
        >
          {muted ? <VolumeOffIcon className="w-5 h-5" /> : <VolumeOnIcon className="w-5 h-5" />}
        </button>
      </div>

      {!activeRoom && (
        <div className="fixed top-3 right-3 z-30">
          {nextRoom ? (
            <button type="button" onClick={() => openChallenge(nextRoom)} className="story-btn story-btn-gold challenge-fab font-display font-extrabold">
              🎮 Tantangan Ruang {nextRoom}
            </button>
          ) : (
            <button type="button" onClick={() => openChallenge(5)} className="story-btn story-btn-green challenge-fab font-display font-extrabold">
              🏆 Semua Pintu Terbuka
            </button>
          )}
        </div>
      )}

      {activeRoom && (
        <div role="dialog" aria-modal="true" aria-label={`Tantangan Ruang ${activeRoom}`} className="fixed inset-0 z-40 overflow-y-auto">
          <div className="fixed top-0 inset-x-0 z-50 px-3 py-2 bg-parchment/95 border-b-[3px] border-ink flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto" aria-label="Pilih ruang">
              {ROOM_NUMBERS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => openChallenge(n)}
                  aria-pressed={n === activeRoom}
                  aria-label={`Ruang ${n}${done.includes(n) ? ' (selesai)' : ''}`}
                  className={`story-btn px-3 text-sm ${n === activeRoom ? 'story-btn-gold' : 'story-btn-paper'}`}
                >
                  {done.includes(n) && <CheckCircleIcon className="w-4 h-4" />}
                  {n}
                </button>
              ))}
            </div>
            <button type="button" onClick={closeChallenge} className="story-btn story-btn-paper px-3 text-sm shrink-0">
              <CloseIcon className="w-5 h-5" />
              <span>Kembali ke Canva</span>
            </button>
          </div>
          <ChallengeScreen
            key={activeRoom}
            room={content.rooms[activeRoom]}
            settings={content.settings}
            onPlaySound={onPlaySound}
            embedded
            onReturn={closeChallenge}
            onCodeShown={markDone}
          />
        </div>
      )}
    </div>
  );
}
