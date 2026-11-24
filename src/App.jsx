import React, { useCallback, useEffect, useState } from 'react';
import { loadContent } from './data/contentLoader';
import { ROOM_NUMBERS, getDefaultContent } from './data/defaultContent';
import { soundFx } from './utils/sound';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TopBar } from './components/TopBar';
import { HomeScreen } from './screens/HomeScreen';
import { ChallengeScreen } from './screens/ChallengeScreen';
import { ClassroomScreen } from './screens/ClassroomScreen';
import { HakikuCrest } from './components/illustrations/StoryArt';

const MUTE_KEY = 'hakiku-hybrid:muted';

// Membaca nomor ruang dari ?ruang=2 (atau #ruang=2 sebagai cadangan).
export function readRoomFromLocation(loc = window.location) {
  const fromSearch = new URLSearchParams(loc.search).get('ruang');
  const fromHash = new URLSearchParams(String(loc.hash || '').replace(/^#/, '')).get('ruang');
  const n = Number.parseInt(fromSearch ?? fromHash ?? '', 10);
  return ROOM_NUMBERS.includes(n) ? n : null;
}

// ?guru=1 membuka halaman guru (daftar tantangan). Tanpa parameter: Mode Kelas.
export function readTeacherMode(loc = window.location) {
  return new URLSearchParams(loc.search).has('guru');
}

function readMuted() {
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export default function App({ loader = loadContent }) {
  const [roomNumber] = useState(() => readRoomFromLocation());
  const [teacherMode] = useState(() => readTeacherMode());
  const classroomMode = !roomNumber && !teacherMode;
  const [muted, setMuted] = useState(readMuted);
  const [loadInfo, setLoadInfo] = useState({ status: 'loading', content: null, source: '', warnings: [], error: '' });

  useEffect(() => {
    let active = true;
    loader()
      .then((result) => {
        if (active) setLoadInfo({ status: 'ready', ...result });
      })
      .catch(() => {
        if (active) {
          setLoadInfo({ status: 'ready', content: getDefaultContent(), source: 'bawaan', warnings: [], error: '' });
        }
      });
    return () => {
      active = false;
    };
  }, [loader]);

  useEffect(() => {
    if (classroomMode) return;
    const room = loadInfo.content?.rooms[roomNumber];
    document.title = room ? `Ruang ${room.number}: ${room.title} - HAKIKU` : 'Daftar Tantangan - HAKIKU';
  }, [loadInfo.content, roomNumber, classroomMode]);

  const playSound = useCallback(
    (kind) => {
      const fn =
        { correct: soundFx.playCorrect, wrong: soundFx.playWrong, unlock: soundFx.playUnlock, victory: soundFx.playVictory }[
          kind
        ] || soundFx.playClick;
      fn(muted);
    },
    [muted]
  );

  function toggleSound() {
    setMuted((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(MUTE_KEY, next ? '1' : '0');
      } catch {
        // Abaikan jika penyimpanan browser diblokir.
      }
      if (!next) soundFx.playClick(false);
      return next;
    });
  }

  return (
    <ErrorBoundary onRecover={() => window.location.reload()}>
      <div className="min-h-dvh flex flex-col bg-parchment text-ink">
        {!classroomMode && <TopBar muted={muted} onToggleSound={toggleSound} />}
        <main id="main-content" className="flex-1 w-full">
          {loadInfo.status === 'loading' ? (
            <div role="status" className="min-h-dvh flex flex-col items-center justify-center gap-3 p-6 text-center">
              <HakikuCrest className="w-16 h-16 animate-pulse" />
              <p className="font-display font-extrabold text-xl text-ink m-0">Menyiapkan tantangan…</p>
            </div>
          ) : classroomMode ? (
            <ClassroomScreen
              content={loadInfo.content}
              onPlaySound={playSound}
              muted={muted}
              onToggleSound={toggleSound}
            />
          ) : roomNumber ? (
            <ChallengeScreen
              room={loadInfo.content.rooms[roomNumber]}
              settings={loadInfo.content.settings}
              onPlaySound={playSound}
            />
          ) : (
            <HomeScreen content={loadInfo.content} loadInfo={loadInfo} onPlaySound={playSound} />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
