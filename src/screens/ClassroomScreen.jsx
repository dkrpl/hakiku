import React, { useCallback, useEffect, useState } from 'react';
import { ROOM_NUMBERS, SCENES } from '../data/defaultContent';
import { buildCanvaEmbedUrl } from '../data/contentLoader';
import { HakikuCrest } from '../components/illustrations/StoryArt';
import { ChallengeScreen } from './ChallengeScreen';
import { CheckCircleIcon, CloseIcon, VolumeOffIcon, VolumeOnIcon } from '../components/icons/StoryIcons';
import { HOTSPOTS, PAGE_COUNT, SLIDE_H, SLIDE_W } from '../data/canvaHotspots';

const PROGRESS_KEY = 'hakiku-hybrid:kelas-selesai';
const PAGE_KEY = 'hakiku-hybrid:kelas-halaman';

// Canva menaruh bilah kontrolnya di bawah slide bila ada ruang. Iframe dibuat lebih tinggi
// (ruang FRAME_GAP di atas dan bawah slide) lalu dipotong, sehingga yang terlihat hanya slide.
export const FRAME_GAP = 90;

/** Ukuran slide 16:9 terbesar yang muat di layar. */
export function computeSlideSize(vw, vh) {
  const width = Math.max(320, Math.min(vw, (vh * SLIDE_W) / SLIDE_H));
  return { width: Math.round(width), height: Math.round((width * SLIDE_H) / SLIDE_W) };
}

function useSlideSize() {
  const read = () => computeSlideSize(window.innerWidth, window.innerHeight);
  const [size, setSize] = useState(read);
  useEffect(() => {
    const onResize = () => setSize(read());
    window.addEventListener('resize', onResize);
    document.addEventListener('fullscreenchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('fullscreenchange', onResize);
    };
  }, []);
  return size;
}

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

function readPage() {
  try {
    const n = Number.parseInt(window.sessionStorage.getItem(PAGE_KEY) || '1', 10);
    return n >= 1 && n <= PAGE_COUNT ? n : 1;
  } catch {
    return 1;
  }
}

function savePage(n) {
  try {
    window.sessionStorage.setItem(PAGE_KEY, String(n));
  } catch {
    // Abaikan jika penyimpanan browser diblokir.
  }
}

/**
 * MODE KELAS (halaman utama web).
 * Slide Canva tampil DI DALAM web dalam layar penuh. Web yang mengatur perpindahan slide:
 * - seluruh kotak tombol di slide bisa diketuk (lapisan tombol transparan di atas Canva),
 * - ketukan di luar tombol diabaikan, jadi siswa tidak berpindah slide tanpa sengaja,
 * - tombol "Mulai Tantangan" di slide langsung membuka tantangan di atas Canva (tanpa pindah tab).
 * Guru bisa memakai tombol panah kiri/kanan (atau clicker presentasi) untuk pindah slide.
 */
export function ClassroomScreen({ content, onPlaySound, muted, onToggleSound }) {
  const embedUrl = buildCanvaEmbedUrl(content.settings);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(readProgress);
  const [activeRoom, setActiveRoom] = useState(null);
  const [full, setFull] = useState(isFullscreen);
  const [page, setPage] = useState(readPage);
  const [notice, setNotice] = useState('');
  const slide = useSlideSize();

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

  const goToPage = useCallback((n) => {
    const target = Math.min(PAGE_COUNT, Math.max(1, n));
    setPage(target);
    savePage(target);
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(''), 2200);
    return () => clearTimeout(t);
  }, [notice]);

  // Guru: panah kiri/kanan, PageUp/PageDown (clicker presentasi) untuk pindah slide.
  useEffect(() => {
    if (!started || activeRoom) return undefined;
    const onKey = (e) => {
      if (['ArrowRight', 'PageDown'].includes(e.key)) goToPage(page + 1);
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) goToPage(page - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [started, activeRoom, page, goToPage]);

  function start(fresh) {
    onPlaySound('click');
    if (fresh) {
      setDone([]);
      saveProgress([]);
      goToPage(1);
    }
    enterFullscreen();
    setStarted(true);
  }

  function handleHotspot(spot) {
    if (spot.room) {
      openChallenge(spot.room);
      return;
    }
    if (spot.to === page) {
      onPlaySound('wrong');
      setNotice('🔒 Ruang ini masih terkunci. Selesaikan ruang sebelumnya dulu ya!');
      return;
    }
    onPlaySound('click');
    goToPage(spot.to);
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
                <button type="button" onClick={() => start(page === 1 && done.length === 0)} className="story-btn story-btn-gold text-xl sm:text-2xl px-8 py-4">
                  ▶ {page > 1 || done.length > 0 ? `Lanjutkan (Slide ${page})` : 'Mulai Petualangan'}
                </button>
                {(page > 1 || done.length > 0) && (
                  <button type="button" onClick={() => start(true)} className="story-btn story-btn-paper text-lg px-6 py-4">
                    Mulai dari Awal
                  </button>
                )}
              </div>
              <p className="text-sm font-bold text-ink-muted m-0">
                Layar akan menjadi penuh. Siswa cukup mengetuk tombol-tombol di slide.
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
    <div className="fixed inset-0 bg-[#0e1512] flex items-center justify-center overflow-hidden">
      <div
        className="relative overflow-hidden"
        style={{ width: `${slide.width}px`, height: `${slide.height}px` }}
        data-testid="slide-area"
      >
        <iframe
          src={`${embedUrl}#${page}`}
          title="Slide HAKIKU di Canva"
          tabIndex={-1}
          className="canva-frame"
          style={{ width: `${slide.width}px`, height: `${slide.height + 2 * FRAME_GAP}px`, top: `-${FRAME_GAP}px` }}
          referrerPolicy="strict-origin-when-cross-origin"
        />
        {/* Lapisan penangkap ketukan: hanya kotak tombol yang aktif. */}
        <div className="absolute inset-0 z-10" aria-label={`Slide ${page} dari ${PAGE_COUNT}`} role="group">
          {(HOTSPOTS[page] || []).map((spot, i) => (
            <button
              key={`${page}-${i}`}
              type="button"
              onClick={() => handleHotspot(spot)}
              aria-label={spot.room ? `Mulai Tantangan Ruang ${spot.room}` : `Buka slide ${spot.to}`}
              className="slide-hotspot"
              style={{
                left: `${(spot.x / SLIDE_W) * 100}%`,
                top: `${(spot.y / SLIDE_H) * 100}%`,
                width: `${(spot.w / SLIDE_W) * 100}%`,
                height: `${(spot.h / SLIDE_H) * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="fixed top-2 left-2 z-30 flex gap-1.5 opacity-70 hover:opacity-100 focus-within:opacity-100">
        {!full && (
          <button type="button" onClick={enterFullscreen} className="story-btn story-btn-paper px-2.5 text-sm">
            ⛶ <span>Layar Penuh</span>
          </button>
        )}
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={!muted}
          aria-label={muted ? 'Nyalakan suara' : 'Matikan suara'}
          className="story-btn story-btn-paper px-2.5"
        >
          {muted ? <VolumeOffIcon className="w-5 h-5" /> : <VolumeOnIcon className="w-5 h-5" />}
        </button>
      </div>

      {notice && (
        <div role="status" className="fixed bottom-6 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
          <p className="story-panel m-0 px-5 py-3 font-display font-extrabold text-lg text-ink animate-bubble-in">{notice}</p>
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
