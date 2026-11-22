import React, { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_BLOOKET_URL,
  DEFAULT_SECRET_CODE,
  DEFAULT_TEACHER_PIN,
  DEFAULT_YOUTUBE_URL,
} from '../data/hakikuData';
import { parseYoutubeEmbedUrl, validateHttpUrl } from '../utils/storage';
import {
  AlertIcon,
  CheckCircleIcon,
  CloseIcon,
  GearIcon,
  ResetIcon,
} from './icons/StoryIcons';

export function TeacherModeModal({
  isOpen,
  teacherSettings,
  onClose,
  onToggleDemoUnlockAll,
  onUpdateTeacherSettings,
  onResetProgress,
  onPlaySound,
}) {
  const dialogRef = useRef(null);
  const pinInputRef = useRef(null);
  const demoSwitchRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState('');

  const [blooketInput, setBlooketInput] = useState(teacherSettings.blooketUrl);
  const [blooketStatus, setBlooketStatus] = useState({ type: '', text: '' });

  const [youtubeInput, setYoutubeInput] = useState(teacherSettings.youtubeUrl);
  const [youtubeStatus, setYoutubeStatus] = useState({ type: '', text: '' });

  const [secretInput, setSecretInput] = useState(teacherSettings.secretCode);
  const [secretStatus, setSecretStatus] = useState({ type: '', text: '' });

  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetDoneNotice, setResetDoneNotice] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setBlooketInput(teacherSettings.blooketUrl);
    setYoutubeInput(teacherSettings.youtubeUrl);
    setSecretInput(teacherSettings.secretCode);
    setBlooketStatus({ type: '', text: '' });
    setYoutubeStatus({ type: '', text: '' });
    setSecretStatus({ type: '', text: '' });
    setConfirmingReset(false);
    setResetDoneNotice('');
    // Re-initialize form drafts only when opening the modal so save/reset notices stay visible.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsUnlocked(false);
      setPinValue('');
      setPinError('');
      return undefined;
    }

    const previousFocus = document.activeElement;
    setTimeout(() => pinInputRef.current?.focus(), 0);

    function handleKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isUnlocked) {
      demoSwitchRef.current?.focus();
    }
  }, [isOpen, isUnlocked]);

  if (!isOpen) return null;

  function handlePinSubmit(event) {
    event.preventDefault();
    if (pinValue.trim() === DEFAULT_TEACHER_PIN) {
      setPinError('');
      setIsUnlocked(true);
      onPlaySound('correct');
      return;
    }
    setPinError('PIN salah. Masukkan 4 digit PIN Mode Guru yang benar.');
    onPlaySound('wrong');
    pinInputRef.current?.focus();
  }

  function handleKeypadDigit(digit) {
    if (pinValue.length >= 4) return;
    setPinError('');
    setPinValue((prev) => prev + digit);
    onPlaySound('click');
  }

  function handleKeypadBackspace() {
    setPinError('');
    setPinValue((prev) => prev.slice(0, -1));
    onPlaySound('click');
  }

  function handleSaveBlooket(event) {
    event.preventDefault();
    const result = validateHttpUrl(blooketInput);
    if (!result.valid) {
      setBlooketStatus({ type: 'error', text: result.error });
      onPlaySound('wrong');
      return;
    }
    onUpdateTeacherSettings({ blooketUrl: result.url });
    setBlooketInput(result.url);
    setBlooketStatus({
      type: 'success',
      text: 'URL Misi Blooket disimpan dan langsung aktif di Ruang 5.',
    });
    onPlaySound('correct');
  }

  function handleResetBlooket() {
    onUpdateTeacherSettings({ blooketUrl: DEFAULT_BLOOKET_URL });
    setBlooketInput(DEFAULT_BLOOKET_URL);
    setBlooketStatus({ type: 'success', text: 'URL Blooket dikembalikan ke alamat default.' });
    onPlaySound('click');
  }

  function handleSaveYoutube(event) {
    event.preventDefault();
    const parsed = parseYoutubeEmbedUrl(youtubeInput);
    if (!parsed.valid) {
      setYoutubeStatus({ type: 'error', text: parsed.error });
      onPlaySound('wrong');
      return;
    }
    onUpdateTeacherSettings({ youtubeUrl: parsed.watchUrl });
    setYoutubeInput(parsed.watchUrl);
    setYoutubeStatus({
      type: 'success',
      text: 'Video YouTube Ruang 1 berhasil diperbarui.',
    });
    onPlaySound('correct');
  }

  function handleResetYoutube() {
    onUpdateTeacherSettings({ youtubeUrl: DEFAULT_YOUTUBE_URL });
    setYoutubeInput(DEFAULT_YOUTUBE_URL);
    setYoutubeStatus({ type: 'success', text: 'Video Ruang 1 dikembalikan ke sampel default.' });
    onPlaySound('click');
  }

  function handleSaveSecret(event) {
    event.preventDefault();
    const cleaned = secretInput.trim().toUpperCase();
    if (!cleaned) {
      setSecretStatus({ type: 'error', text: 'Kode rahasia tidak boleh kosong.' });
      onPlaySound('wrong');
      return;
    }
    onUpdateTeacherSettings({ secretCode: cleaned });
    setSecretInput(cleaned);
    setSecretStatus({
      type: 'success',
      text: `Kode rahasia Ruang 5 diperbarui menjadi ${cleaned}.`,
    });
    onPlaySound('correct');
  }

  function handleConfirmReset() {
    onResetProgress();
    setConfirmingReset(false);
    setResetDoneNotice('Progres direset. Ruang 2 sampai 5 kini terkunci kembali.');
    onPlaySound('click');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-ink/60 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="teacher-modal-title"
        className="story-panel max-w-xl w-full p-5 sm:p-7 my-auto max-h-[92dvh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3 mb-5 pb-3 border-b-2 border-ink-border">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-sky-wash border-2 border-sky text-sky shrink-0">
              <GearIcon className="w-5 h-5" />
            </span>
            <div>
              <h2 id="teacher-modal-title" className="story-heading-section m-0">
                Mode Guru Mini
              </h2>
              <p className="text-sm text-ink-muted m-0">
                Pengaturan lokal untuk presentasi, sidang, dan kendali kelas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Mode Guru"
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl border-2 border-ink-border bg-white text-ink hover:bg-gold-wash shrink-0"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {!isUnlocked ? (
          <form onSubmit={handlePinSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="teacher-pin-input" className="block font-bold text-ink mb-1.5">
                Masukkan PIN 4 Digit Guru
              </label>
              <input
                ref={pinInputRef}
                id="teacher-pin-input"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                value={pinValue}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPinValue(digitsOnly);
                  setPinError('');
                }}
                aria-invalid={Boolean(pinError)}
                aria-describedby="teacher-pin-hint teacher-pin-error"
                placeholder="4 digit angka"
                className="w-full min-h-12 px-4 py-2.5 rounded-xl border-2 border-ink-border bg-white text-xl font-extrabold tracking-[0.35em] text-center text-ink"
              />
              <p id="teacher-pin-hint" className="text-sm text-ink-muted mt-1.5">
                Catatan uji prototype: PIN demo default adalah <strong>{DEFAULT_TEACHER_PIN}</strong>.
              </p>
              {pinError && (
                <p
                  id="teacher-pin-error"
                  role="alert"
                  className="mt-2 flex items-center gap-2 text-sm font-bold text-crimson-ink bg-crimson-wash border-2 border-crimson rounded-xl px-3 py-2"
                >
                  <AlertIcon className="w-4 h-4 shrink-0" />
                  <span>{pinError}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2" aria-label="Papan angka layar sentuh">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadDigit(digit)}
                  className="story-btn story-btn-paper text-lg py-2.5"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className="story-btn story-btn-paper text-sm py-2.5"
              >
                Hapus
              </button>
              <button
                type="button"
                onClick={() => handleKeypadDigit('0')}
                className="story-btn story-btn-paper text-lg py-2.5"
              >
                0
              </button>
              <button type="submit" className="story-btn story-btn-gold text-sm py-2.5">
                Masuk
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Switch Mode Demo Sidang */}
            <section className="p-4 rounded-xl bg-gold-wash border-2 border-ink-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-bold text-lg text-ink m-0">Mode Demo Sidang</h3>
                <p className="text-sm text-ink-muted m-0 mt-0.5">
                  Buka seluruh gembok Ruang 1 sampai 5 dan pratinjau Halaman Akhir secara instan.
                </p>
              </div>
              <button
                ref={demoSwitchRef}
                type="button"
                role="switch"
                aria-checked={teacherSettings.demoUnlockAll}
                onClick={() => {
                  onToggleDemoUnlockAll(!teacherSettings.demoUnlockAll);
                  onPlaySound('click');
                }}
                className={`story-btn shrink-0 text-sm px-4 ${
                  teacherSettings.demoUnlockAll ? 'story-btn-green' : 'story-btn-paper'
                }`}
              >
                <span>{teacherSettings.demoUnlockAll ? 'Aktif (Terbuka)' : 'Nonaktif'}</span>
              </button>
            </section>

            {/* Form URL Blooket */}
            <form onSubmit={handleSaveBlooket} noValidate className="space-y-2.5">
              <label htmlFor="blooket-url-input" className="block font-bold text-ink">
                URL Misi Blooket (Ruang 5)
              </label>
              <input
                id="blooket-url-input"
                type="url"
                value={blooketInput}
                onChange={(e) => {
                  setBlooketInput(e.target.value);
                  setBlooketStatus({ type: '', text: '' });
                }}
                aria-invalid={blooketStatus.type === 'error'}
                placeholder="https://play.blooket.com/play?id=..."
                className="w-full min-h-12 px-3.5 py-2 rounded-xl border-2 border-ink-border bg-white text-ink text-sm sm:text-base"
              />
              <div className="flex flex-wrap gap-2">
                <button type="submit" className="story-btn story-btn-blue text-sm">
                  Simpan URL Blooket
                </button>
                <button
                  type="button"
                  onClick={handleResetBlooket}
                  className="story-btn story-btn-paper text-sm"
                >
                  Kembalikan Default
                </button>
              </div>
              {blooketStatus.text && (
                <p
                  role={blooketStatus.type === 'error' ? 'alert' : 'status'}
                  className={`flex items-center gap-2 text-sm font-bold rounded-xl px-3 py-2 border-2 ${
                    blooketStatus.type === 'error'
                      ? 'text-crimson-ink bg-crimson-wash border-crimson'
                      : 'text-meadow bg-meadow-wash border-meadow'
                  }`}
                >
                  {blooketStatus.type === 'error' ? (
                    <AlertIcon className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircleIcon className="w-4 h-4 shrink-0" />
                  )}
                  <span>{blooketStatus.text}</span>
                </p>
              )}
            </form>

            {/* Form URL Video YouTube */}
            <form onSubmit={handleSaveYoutube} noValidate className="space-y-2.5 pt-4 border-t-2 border-ink-border/40">
              <label htmlFor="youtube-url-input" className="block font-bold text-ink">
                URL Video YouTube Sampel (Ruang 1)
              </label>
              <input
                id="youtube-url-input"
                type="text"
                value={youtubeInput}
                onChange={(e) => {
                  setYoutubeInput(e.target.value);
                  setYoutubeStatus({ type: '', text: '' });
                }}
                aria-invalid={youtubeStatus.type === 'error'}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full min-h-12 px-3.5 py-2 rounded-xl border-2 border-ink-border bg-white text-ink text-sm sm:text-base"
              />
              <div className="flex flex-wrap gap-2">
                <button type="submit" className="story-btn story-btn-blue text-sm">
                  Simpan Video YouTube
                </button>
                <button
                  type="button"
                  onClick={handleResetYoutube}
                  className="story-btn story-btn-paper text-sm"
                >
                  Kembalikan Default
                </button>
              </div>
              {youtubeStatus.text && (
                <p
                  role={youtubeStatus.type === 'error' ? 'alert' : 'status'}
                  className={`flex items-center gap-2 text-sm font-bold rounded-xl px-3 py-2 border-2 ${
                    youtubeStatus.type === 'error'
                      ? 'text-crimson-ink bg-crimson-wash border-crimson'
                      : 'text-meadow bg-meadow-wash border-meadow'
                  }`}
                >
                  {youtubeStatus.type === 'error' ? (
                    <AlertIcon className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircleIcon className="w-4 h-4 shrink-0" />
                  )}
                  <span>{youtubeStatus.text}</span>
                </p>
              )}
            </form>

            {/* Form Kode Rahasia */}
            <form onSubmit={handleSaveSecret} noValidate className="space-y-2.5 pt-4 border-t-2 border-ink-border/40">
              <label htmlFor="teacher-secret-input" className="block font-bold text-ink">
                Kode Rahasia Gerbang Akhir (Ruang 5)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="teacher-secret-input"
                  type="text"
                  value={secretInput}
                  onChange={(e) => {
                    setSecretInput(e.target.value);
                    setSecretStatus({ type: '', text: '' });
                  }}
                  aria-invalid={secretStatus.type === 'error'}
                  placeholder={DEFAULT_SECRET_CODE}
                  className="flex-1 min-h-12 px-3.5 py-2 rounded-xl border-2 border-ink-border bg-white text-ink font-bold uppercase"
                />
                <button type="submit" className="story-btn story-btn-paper text-sm shrink-0">
                  Simpan Kode
                </button>
              </div>
              {secretStatus.text && (
                <p
                  role={secretStatus.type === 'error' ? 'alert' : 'status'}
                  className={`flex items-center gap-2 text-sm font-bold rounded-xl px-3 py-2 border-2 ${
                    secretStatus.type === 'error'
                      ? 'text-crimson-ink bg-crimson-wash border-crimson'
                      : 'text-meadow bg-meadow-wash border-meadow'
                  }`}
                >
                  {secretStatus.type === 'error' ? (
                    <AlertIcon className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircleIcon className="w-4 h-4 shrink-0" />
                  )}
                  <span>{secretStatus.text}</span>
                </p>
              )}
            </form>

            {/* Reset Progres 2-langkah */}
            <section className="pt-4 border-t-2 border-ink-border space-y-3">
              <div>
                <h3 className="font-display font-bold text-lg text-ink m-0">Reset Progres Siswa</h3>
                <p className="text-sm text-ink-muted m-0">
                  Mengunci kembali Ruang 2 sampai 5 dan mematikan Mode Demo Sidang. Tautan Blooket
                  tetap tersimpan.
                </p>
              </div>

              {!confirmingReset ? (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmingReset(true);
                    setResetDoneNotice('');
                    onPlaySound('click');
                  }}
                  className="story-btn story-btn-danger text-sm"
                >
                  <ResetIcon className="w-4 h-4 shrink-0" />
                  <span>Reset Progres</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-crimson-wash border-2 border-crimson space-y-3">
                  <p className="text-sm font-bold text-crimson-ink m-0">
                    Yakin ingin mengunci kembali Ruang 2 sampai 5?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmReset}
                      className="story-btn story-btn-danger text-sm"
                    >
                      Ya, Kunci Ulang Ruang 2-5
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingReset(false)}
                      className="story-btn story-btn-paper text-sm"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {resetDoneNotice && (
                <p
                  role="status"
                  className="flex items-center gap-2 text-sm font-bold text-meadow bg-meadow-wash border-2 border-meadow rounded-xl px-3 py-2"
                >
                  <CheckCircleIcon className="w-4 h-4 shrink-0" />
                  <span>{resetDoneNotice}</span>
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
