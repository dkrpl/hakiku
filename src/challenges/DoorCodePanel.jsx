import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoldenKeyArt } from '../components/illustrations/StoryArt';
import { ResetIcon } from '../components/icons/StoryIcons';
import { StarRow } from '../components/GameFx';

const ROLL_MS = 1300;

/** Satu digit kode yang "berputar" seperti mesin angka lalu berhenti di angka aslinya. */
function RollingDigit({ digit, delay, rolling }) {
  const [shown, setShown] = useState(rolling ? '0' : digit);

  useEffect(() => {
    if (!rolling) {
      setShown(digit);
      return undefined;
    }
    let n = 0;
    const spin = setInterval(() => {
      n = (n + 1) % 10;
      setShown(String(n));
    }, 70);
    const stop = setTimeout(() => {
      clearInterval(spin);
      setShown(digit);
    }, ROLL_MS * 0.55 + delay);
    return () => {
      clearInterval(spin);
      clearTimeout(stop);
    };
  }, [digit, delay, rolling]);

  const settled = shown === digit;
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center w-16 h-20 sm:w-24 sm:h-28 rounded-2xl bg-chalkboard text-gold font-display font-extrabold text-5xl sm:text-6xl border-[4px] border-wood shadow-[0_6px_0_#4a2608] ${
        settled && rolling ? 'animate-star-pop' : ''
      }`}
    >
      {shown}
    </span>
  );
}

/**
 * Kode pintu + kembali otomatis ke Canva.
 * - Digit berputar lalu berhenti (mudah diingat dan seru).
 * - Hitung mundur, lalu halaman kembali ke Canva sendiri:
 *   bila guru mengisi link Canva di Pengaturan → pindah ke link itu,
 *   bila tidak → tab tantangan ditutup sehingga slide Canva terlihat lagi.
 * - Bila browser menolak menutup tab, muncul layar besar berisi kode + petunjuk menutup tab.
 */
export function DoorCodePanel({
  roomNumber,
  doorCode,
  isFinal,
  stars = 3,
  returnUrl = '',
  returnSeconds = 15,
  onRestart,
}) {
  const headingRef = useRef(null);
  const [rolling, setRolling] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(returnSeconds);
  const [paused, setPaused] = useState(false);
  const [closeFailed, setCloseFailed] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const digits = String(doorCode).split('');
  const doorName = isFinal ? 'Pintu Terakhir' : `Pintu Ruang ${roomNumber}`;

  useEffect(() => {
    headingRef.current?.focus();
    const t = setTimeout(() => setRolling(false), ROLL_MS + digits.length * 120);
    return () => clearTimeout(t);
  }, [digits.length]);

  const goBackToCanva = useCallback(() => {
    setLeaving(true);
    if (returnUrl) {
      window.location.assign(returnUrl);
      return;
    }
    try {
      window.close();
    } catch {
      // abaikan, ditangani di bawah
    }
    setTimeout(() => setCloseFailed(true), 400);
  }, [returnUrl]);

  useEffect(() => {
    if (rolling || paused || leaving || returnSeconds <= 0) return undefined;
    if (secondsLeft <= 0) {
      goBackToCanva();
      return undefined;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [rolling, paused, leaving, secondsLeft, returnSeconds, goBackToCanva]);

  const ringPct = returnSeconds > 0 ? Math.max(0, secondsLeft / returnSeconds) : 0;

  return (
    <>
      <div className="story-panel max-w-2xl w-full mx-auto p-6 sm:p-8 text-center space-y-5 animate-screen-enter">
        <div className="flex justify-center items-center gap-4">
          <GoldenKeyArt className="w-20 h-20 sm:w-24 sm:h-24 animate-key-pop" />
          <StarRow stars={stars} size="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-extrabold text-meadow uppercase tracking-wide m-0">Kode berhasil didapat!</p>
          <h2 ref={headingRef} tabIndex={-1} className="story-heading-page font-extrabold m-0 focus:outline-none">
            Kode Pintu Ruang {roomNumber}
          </h2>
        </div>

        <div
          aria-label={`Kode pintu ${doorCode}`}
          role="img"
          className="flex justify-center gap-2 sm:gap-3 flex-wrap"
          data-testid="door-code"
        >
          {digits.map((d, i) => (
            <RollingDigit key={`${d}-${i}`} digit={d} delay={i * 160} rolling={rolling} />
          ))}
        </div>

        <p className="story-body font-bold text-ink m-0">
          {returnUrl ? (
            <>
              Hafalkan kodenya! Sebentar lagi kamu kembali ke Canva di <strong>{doorName}</strong>. Pilih angka{' '}
              <strong>{doorCode}</strong> di sana.
            </>
          ) : (
            <>
              Hafalkan kodenya! Di Canva, tekan <strong>Sudah Dapat Kode</strong>, lalu pilih angka <strong>{doorCode}</strong> di{' '}
              <strong>{doorName}</strong>.
            </>
          )}
        </p>

        {!rolling && returnSeconds > 0 && !leaving && (
          <div className="flex items-center justify-center gap-3" role="status" aria-live="polite">
            <span
              className="countdown-ring"
              style={{ '--pct': ringPct }}
              aria-hidden="true"
            >
              <span>{secondsLeft}</span>
            </span>
            <p className="text-sm sm:text-base font-extrabold text-ink m-0 text-left">
              {paused ? 'Hitung mundur dijeda. Tekan Lanjutkan bila sudah hafal.' : `Kembali ke Canva otomatis dalam ${secondsLeft} detik…`}
            </p>
          </div>
        )}

        {leaving && returnUrl && (
          <p role="status" className="text-base font-extrabold text-meadow m-0">Membuka Canva… tunggu sebentar ya.</p>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button type="button" onClick={goBackToCanva} className="story-btn story-btn-gold text-base sm:text-lg px-6 py-3">
            Kembali ke Canva Sekarang
          </button>
          {!rolling && returnSeconds > 0 && (
            <button type="button" onClick={() => setPaused((p) => !p)} className="story-btn story-btn-paper text-base px-5 py-3">
              {paused ? 'Lanjutkan Hitung Mundur' : 'Tunggu, Aku Belum Hafal'}
            </button>
          )}
          <button type="button" onClick={onRestart} className="story-btn story-btn-paper text-base px-5 py-3">
            <ResetIcon className="w-5 h-5 shrink-0" />
            <span>Ulangi Tantangan</span>
          </button>
        </div>
      </div>

      {closeFailed && (
        <div role="alertdialog" aria-labelledby="close-tab-title" className="fixed inset-0 z-50 bg-ink/85 flex flex-col items-center justify-center p-6 text-center">
          <div className="close-tab-arrow" aria-hidden="true">⬆</div>
          <div className="story-panel max-w-xl w-full p-6 sm:p-8 space-y-4">
            <h2 id="close-tab-title" className="story-heading-page font-extrabold m-0">
              Tutup tab ini untuk kembali ke Canva
            </h2>
            <p className="story-body font-bold m-0">
              Tekan tanda <strong>✕</strong> pada tab di bagian atas layar. Slide Canva akan terlihat lagi.
            </p>
            <div className="flex justify-center gap-2" aria-label={`Kode pintu ${doorCode}`} role="img">
              {digits.map((d, i) => (
                <span
                  key={`f-${i}`}
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-14 h-16 rounded-xl bg-chalkboard text-gold font-display font-extrabold text-4xl border-[3px] border-wood"
                >
                  {d}
                </span>
              ))}
            </div>
            <p className="text-sm font-extrabold text-ink-muted m-0">
              Di Canva: tekan Sudah Dapat Kode, lalu pilih {doorCode} di {doorName}.
            </p>
            <button type="button" onClick={() => { setCloseFailed(false); setLeaving(false); setPaused(true); }} className="story-btn story-btn-paper">
              Tetap di Halaman Ini
            </button>
          </div>
        </div>
      )}
    </>
  );
}
