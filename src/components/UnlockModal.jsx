import React, { useEffect, useRef } from 'react';
import { SCENE_ASSETS } from '../data/hakikuData';
import { CloseIcon, MapIcon, NextIcon } from './icons/StoryIcons';

export function UnlockModal({
  isOpen,
  unlockedRoomNumber,
  unlockedRoomTitle,
  completedRoomNumber,
  onClose,
  onGoNextRoom,
  onGoMap,
}) {
  const dialogRef = useRef(null);
  const primaryBtnRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousFocus = document.activeElement;
    primaryBtnRef.current?.focus();

    function handleKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="unlock-modal-title"
        className="story-panel max-w-md w-full p-6 sm:p-7 relative text-center"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup pemberitahuan kunci"
          className="absolute top-3 right-3 inline-flex items-center justify-center w-11 h-11 rounded-xl border-2 border-ink-border bg-white text-ink hover:bg-gold-wash"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="animate-key-pop relative">
            <img
              src={SCENE_ASSETS.mascot}
              width="120"
              height="120"
              alt="Pemandu HAKIKU memegang kunci emas"
              className="w-28 h-28 rounded-full object-cover border-[3px] border-ink shadow-[0_4px_0_#14261c] bg-gold-wash"
            />
          </div>
        </div>

        <p className="inline-block px-3 py-1 rounded-lg bg-meadow-wash border-2 border-meadow text-meadow font-extrabold text-sm mb-2">
          Ruang {completedRoomNumber} Selesai
        </p>

        <h2 id="unlock-modal-title" className="story-heading-page mb-2">
          Kunci Ruang {unlockedRoomNumber} Ditemukan!
        </h2>

        <p className="story-body text-ink-muted mb-6">
          Gembok menuju <strong>Ruang {unlockedRoomNumber}: {unlockedRoomTitle}</strong> kini sudah
          terbuka. Kamu bisa langsung melanjutkan petualangan atau melihat Peta Dunia.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            ref={primaryBtnRef}
            type="button"
            onClick={onGoNextRoom}
            className="story-btn story-btn-gold w-full sm:w-auto"
          >
            <span>Masuk Ruang {unlockedRoomNumber}</span>
            <NextIcon className="w-5 h-5 shrink-0" />
          </button>

          <button
            type="button"
            onClick={onGoMap}
            className="story-btn story-btn-paper w-full sm:w-auto"
          >
            <MapIcon className="w-5 h-5 shrink-0" />
            <span>Lihat Peta Dunia</span>
          </button>
        </div>
      </div>
    </div>
  );
}
