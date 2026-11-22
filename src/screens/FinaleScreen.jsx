import React, { useState } from 'react';
import { ROOMS_META, SCENE_ASSETS } from '../data/hakikuData';
import { countCompletedRooms } from '../utils/storage';
import {
  CheckCircleIcon,
  KeyIcon,
  LockIcon,
  MapIcon,
  ResetIcon,
} from '../components/icons/StoryIcons';

export function FinaleScreen({ appState, onGoMap, onRestartAdventure, onPlaySound }) {
  const [confirmRestart, setConfirmRestart] = useState(false);
  const completedCount = countCompletedRooms(appState);

  return (
    <section className="animate-screen-enter game-stage pt-18 sm:pt-20 pb-5 px-3 sm:px-6 lg:px-8">
      {/* Full-screen joyful victory party scene inspired by "We Did It!" */}
      <img
        src={SCENE_ASSETS.finale}
        width="1280"
        height="720"
        alt="Tiga siswa SD Indonesia melompat gembira merayakan keberhasilan petualangan di bawah bendera pesta warna-warni"
        className="game-backdrop-img"
      />

      <div className="relative z-10 w-full flex-1 flex flex-col justify-between gap-6">
        {/* Top Victory Ribbon cleanly in upper sky above the jumping children */}
        <div className="flex justify-center pt-1 sm:pt-2">
          <div className="game-board-wood px-6 sm:px-9 py-4 text-center max-w-2xl bg-parchment/95">
            <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gold border-2 border-ink text-xs sm:text-sm font-extrabold text-ink mb-2">
              <KeyIcon className="w-4 h-4 shrink-0" />
              <span>
                {completedCount} dari {ROOMS_META.length} ruang telah dituntaskan
              </span>
            </p>
            <h1 className="story-heading-hero font-extrabold m-0">Petualangan Selesai!</h1>
            <p className="text-sm sm:text-base font-bold text-ink-muted m-0 mt-1.5">
              {completedCount === ROOMS_META.length
                ? 'Hore! Kamu menuntaskan seluruh 5 pos di Dunia HAKIKU dan memahami keseimbangan hak serta kewajiban!'
                : 'Berikut catatan nyata status 5 pos petualangan pada sesi ini.'}
            </p>
          </div>
        </div>

        {/* Bottom Floating 5-Key Badge Board + Action Controls */}
        <div className="max-w-5xl w-full mx-auto game-board-wood p-4 sm:p-6 bg-parchment/95 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {ROOMS_META.map((room) => {
              const done = Boolean(appState.completedRooms[room.id]);
              return (
                <div
                  key={room.id}
                  className={`p-3 rounded-2xl border-2 flex flex-col justify-between gap-2 ${
                    done
                      ? 'bg-meadow-wash border-meadow text-ink'
                      : 'bg-locked-bg border-ink-border text-locked-ink'
                  }`}
                >
                  <span className="text-xs font-extrabold text-ink-muted">POS {room.number}</span>
                  <span className="font-display font-extrabold text-sm leading-tight">
                    {room.title}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold">
                    {done ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 text-meadow shrink-0" />
                        <span className="text-meadow">Selesai</span>
                      </>
                    ) : (
                      <>
                        <LockIcon className="w-4 h-4 shrink-0" />
                        <span>
                          {appState.teacherSettings.demoUnlockAll
                            ? 'Belum selesai (Demo)'
                            : 'Belum selesai'}
                        </span>
                      </>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={onGoMap}
              className="story-btn story-btn-gold w-full sm:w-auto text-base"
            >
              <MapIcon className="w-5 h-5 shrink-0" />
              <span>Kembali ke Peta Dunia</span>
            </button>

            {!confirmRestart ? (
              <button
                type="button"
                onClick={() => {
                  setConfirmRestart(true);
                  onPlaySound('click');
                }}
                className="story-btn story-btn-paper w-full sm:w-auto text-base"
              >
                <ResetIcon className="w-5 h-5 shrink-0" />
                <span>Ulangi Petualangan</span>
              </button>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2 p-2.5 rounded-xl bg-crimson-wash border-2 border-crimson">
                <span className="text-sm font-bold text-crimson-ink px-1">
                  Kunci ulang Ruang 2 sampai 5?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmRestart(false);
                    onRestartAdventure();
                  }}
                  className="story-btn story-btn-danger text-sm py-2 px-3"
                >
                  Ya, Ulangi
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRestart(false)}
                  className="story-btn story-btn-paper text-sm py-2 px-3"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
