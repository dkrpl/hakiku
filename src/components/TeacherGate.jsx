import React, { useEffect, useRef, useState } from 'react';
import { LockIcon } from './icons/StoryIcons';

const UNLOCK_KEY = 'hakiku-hybrid:guru-terbuka';
const MAX_TRIES = 3;
const LOCKOUT_SECONDS = 30;

export function isTeacherUnlocked() {
  try {
    return window.sessionStorage.getItem(UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
}

export function setTeacherUnlocked(on) {
  try {
    if (on) window.sessionStorage.setItem(UNLOCK_KEY, '1');
    else window.sessionStorage.removeItem(UNLOCK_KEY);
  } catch {
    // abaikan
  }
}

/**
 * Kotak PIN guru dengan tombol angka besar (mudah di smartboard).
 * Salah 3 kali → dikunci 30 detik supaya siswa tidak menebak-nebak.
 */
export function TeacherPinDialog({ pin, onSuccess, onCancel, asPage = false }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [tries, setTries] = useState(0);
  const [lockLeft, setLockLeft] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const headingRef = useRef(null);
  const length = String(pin).length;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    if (lockLeft <= 0) return undefined;
    const t = setTimeout(() => setLockLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [lockLeft]);

  function check(next) {
    if (next.length < length) return;
    if (next === String(pin)) {
      setTeacherUnlocked(true);
      onSuccess();
      return;
    }
    const n = tries + 1;
    setTries(n);
    setValue('');
    setShakeKey((k) => k + 1);
    if (n >= MAX_TRIES) {
      setTries(0);
      setLockLeft(LOCKOUT_SECONDS);
      setError(`PIN salah ${MAX_TRIES} kali. Coba lagi setelah ${LOCKOUT_SECONDS} detik.`);
    } else {
      setError('PIN salah. Halaman ini khusus guru.');
    }
  }

  function press(d) {
    if (lockLeft > 0) return;
    setError('');
    const next = (value + d).slice(0, length);
    setValue(next);
    check(next);
  }

  function onKeyDown(e) {
    if (/^\d$/.test(e.key)) press(e.key);
    else if (e.key === 'Backspace') setValue((v) => v.slice(0, -1));
    else if (e.key === 'Escape' && onCancel) onCancel();
  }

  const locked = lockLeft > 0;

  const panel = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-title"
      onKeyDown={onKeyDown}
      className="story-panel max-w-sm w-full p-6 sm:p-7 text-center space-y-4 animate-screen-enter"
    >
      <div className="flex justify-center">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold border-[3px] border-ink">
          <LockIcon className="w-7 h-7" />
        </span>
      </div>
      <h2 id="pin-title" ref={headingRef} tabIndex={-1} className="font-display font-extrabold text-2xl text-ink m-0 focus:outline-none">
        Khusus Guru
      </h2>
      <p className="text-sm font-bold text-ink-muted m-0">Masukkan PIN guru untuk membuka halaman guru.</p>

      <div key={shakeKey} className={`flex justify-center gap-2 ${shakeKey ? 'animate-shake' : ''}`} aria-label={`${value.length} dari ${length} angka terisi`} role="img">
        {Array.from({ length }, (_, i) => (
          <span
            key={i}
            className={`w-4 h-4 rounded-full border-[3px] border-ink ${i < value.length ? 'bg-ink' : 'bg-transparent'}`}
          />
        ))}
      </div>

      {(error || locked) && (
        <p role="alert" className="text-sm font-extrabold text-red-700 m-0">
          {locked ? `Terkunci. Coba lagi dalam ${lockLeft} detik.` : error}
        </p>
      )}

      <div className="grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} type="button" disabled={locked} onClick={() => press(d)} className="story-btn story-btn-paper text-2xl font-display font-extrabold py-3 disabled:opacity-40">
            {d}
          </button>
        ))}
        <button type="button" onClick={() => setValue((v) => v.slice(0, -1))} aria-label="Hapus satu angka" className="story-btn story-btn-paper text-xl py-3">
          ⌫
        </button>
        <button type="button" disabled={locked} onClick={() => press('0')} className="story-btn story-btn-paper text-2xl font-display font-extrabold py-3 disabled:opacity-40">
          0
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} aria-label="Batal" className="story-btn story-btn-paper text-xl py-3">
            ✕
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );

  if (asPage) return panel;
  return <div className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4">{panel}</div>;
}
