import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ROOMS_META } from './data/hakikuData';
import {
  countCompletedRooms,
  isFinaleAccessible,
  isRoomUnlocked,
  loadState,
  saveState,
} from './utils/storage';
import { soundFx } from './utils/sound';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LayoutHeader } from './components/LayoutHeader';
import { UnlockModal } from './components/UnlockModal';
import { TeacherModeModal } from './components/TeacherModeModal';
import { IntroScreen } from './screens/IntroScreen';
import { WorldMapScreen } from './screens/WorldMapScreen';
import { Room1Screen } from './screens/Room1Screen';
import { Room2Screen } from './screens/Room2Screen';
import { PlaceholderRoomScreen } from './screens/PlaceholderRoomScreen';
import { Room5Screen } from './screens/Room5Screen';
import { FinaleScreen } from './screens/FinaleScreen';

const SCREEN_TITLES = {
  intro: 'HAKIKU - Dunia Petualangan Hak dan Kewajibanku',
  map: 'Peta Dunia - HAKIKU',
  room1: 'Ruang 1: Mengenal Hak dan Kewajiban - HAKIKU',
  room2: 'Ruang 2: Mengenal Hak - HAKIKU',
  room3: 'Ruang 3: Mengenal Kewajiban (Demo) - HAKIKU',
  room4: 'Ruang 4: Penerapan di Lingkungan (Demo) - HAKIKU',
  room5: 'Ruang 5: Tantangan HAKIKU - HAKIKU',
  finale: 'Petualangan Selesai - HAKIKU',
};

export default function App() {
  const initialLoad = useRef(null);
  if (initialLoad.current === null) {
    initialLoad.current = loadState();
  }

  const [appState, setAppState] = useState(initialLoad.current.state);
  const [storageWarning, setStorageWarning] = useState(initialLoad.current.storageError);
  const [currentView, setCurrentView] = useState('intro');
  const [mapNotice, setMapNotice] = useState('');
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [unlockCelebration, setUnlockCelebration] = useState(null);

  const mainRef = useRef(null);

  const persist = useCallback((nextState) => {
    const result = saveState(nextState);
    if (!result.ok) {
      setStorageWarning(true);
    }
  }, []);

  const updateAppState = useCallback(
    (updater) => {
      setAppState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const playSound = useCallback(
    (kind) => {
      const muted = appState.audioMuted;
      if (kind === 'correct') soundFx.playCorrect(muted);
      else if (kind === 'wrong') soundFx.playWrong(muted);
      else if (kind === 'unlock') soundFx.playUnlock(muted);
      else if (kind === 'victory') soundFx.playVictory(muted);
      else soundFx.playClick(muted);
    },
    [appState.audioMuted]
  );

  useEffect(() => {
    document.title = SCREEN_TITLES[currentView] || SCREEN_TITLES.intro;
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [currentView]);

  const navigateTo = useCallback((view) => {
    setCurrentView(view);
    if (view !== 'map') {
      setMapNotice('');
    }
  }, []);

  const handleEnterRoom = useCallback(
    (roomNumber) => {
      if (!isRoomUnlocked(appState, roomNumber)) {
        playSound('wrong');
        setMapNotice(
          `Ruang ${roomNumber} masih terkunci. Selesaikan Ruang ${roomNumber - 1} terlebih dahulu untuk membuka gemboknya.`
        );
        return;
      }
      playSound('click');
      navigateTo(`room${roomNumber}`);
    },
    [appState, navigateTo, playSound]
  );

  const handleBlockedRoomClick = useCallback(
    (room) => {
      playSound('wrong');
      const prevRoom = ROOMS_META.find((r) => r.number === room.number - 1);
      const prevLabel = prevRoom
        ? `Ruang ${prevRoom.number} (${prevRoom.title})`
        : `Ruang ${room.number - 1}`;
      setMapNotice(
        `Ruang ${room.number} masih terkunci. Selesaikan ${prevLabel} terlebih dahulu untuk menemukan kuncinya.`
      );
    },
    [playSound]
  );

  const handleCompleteRoom = useCallback(
    (roomNumber) => {
      const key = `room${roomNumber}`;
      updateAppState((prev) => ({
        ...prev,
        completedRooms: {
          ...prev.completedRooms,
          [key]: true,
        },
      }));
      playSound('unlock');

      const nextRoom = ROOMS_META.find((r) => r.number === roomNumber + 1);
      if (nextRoom) {
        setUnlockCelebration({
          completedRoomNumber: roomNumber,
          unlockedRoomNumber: nextRoom.number,
          unlockedRoomTitle: nextRoom.title,
        });
      }
    },
    [playSound, updateAppState]
  );

  const handleCompleteRoom5 = useCallback(() => {
    updateAppState((prev) => ({
      ...prev,
      completedRooms: {
        ...prev.completedRooms,
        room5: true,
      },
    }));
    playSound('victory');
    navigateTo('finale');
  }, [navigateTo, playSound, updateAppState]);

  const handleToggleAudio = useCallback(() => {
    updateAppState((prev) => {
      const nextMuted = !prev.audioMuted;
      if (!nextMuted) {
        soundFx.playClick(false);
      }
      return { ...prev, audioMuted: nextMuted };
    });
  }, [updateAppState]);

  const handleToggleDemoUnlockAll = useCallback(
    (nextDemoValue) => {
      const nextState = {
        ...appState,
        teacherSettings: {
          ...appState.teacherSettings,
          demoUnlockAll: nextDemoValue,
        },
      };
      setAppState(nextState);
      persist(nextState);

      if (!nextDemoValue) {
        // Guard: redirect back to World Map if currently viewing an un-earned room or finale
        const roomMatch = /^room([1-5])$/.exec(currentView);
        if (roomMatch) {
          const activeRoomNum = Number(roomMatch[1]);
          if (!isRoomUnlocked(nextState, activeRoomNum)) {
            setCurrentView('map');
            setMapNotice(
              'Mode Demo Sidang dimatikan. Kamu diarahkan kembali ke Peta Dunia karena ruangan sebelumnya belum selesai secara berurutan.'
            );
          }
        } else if (currentView === 'finale' && !isFinaleAccessible(nextState)) {
          setCurrentView('map');
          setMapNotice(
            'Mode Demo Sidang dimatikan. Selesaikan Ruang 5 untuk membuka kembali Halaman Akhir.'
          );
        }
      }
    },
    [appState, currentView, persist]
  );

  const handleUpdateTeacherSettings = useCallback(
    (patch) => {
      updateAppState((prev) => ({
        ...prev,
        teacherSettings: {
          ...prev.teacherSettings,
          ...patch,
        },
      }));
    },
    [updateAppState]
  );

  const handleResetProgress = useCallback(() => {
    updateAppState((prev) => ({
      ...prev,
      completedRooms: {
        room1: false,
        room2: false,
        room3: false,
        room4: false,
        room5: false,
      },
      teacherSettings: {
        ...prev.teacherSettings,
        demoUnlockAll: false,
      },
    }));
    setUnlockCelebration(null);
    if (currentView !== 'intro' && currentView !== 'map') {
      setCurrentView('map');
      setMapNotice('Progres telah direset. Ruang 2 sampai 5 terkunci kembali.');
    }
  }, [currentView, updateAppState]);

  const completedCount = countCompletedRooms(appState);

  return (
    <ErrorBoundary onRecover={() => setCurrentView('intro')}>
      <div className="min-h-dvh flex flex-col bg-parchment text-ink">
        <a href="#main-content" className="skip-link">
          Lewati ke konten utama
        </a>

        <LayoutHeader
          currentView={currentView}
          completedRooms={appState.completedRooms}
          completedCount={completedCount}
          totalRooms={ROOMS_META.length}
          audioMuted={appState.audioMuted}
          demoUnlockAll={appState.teacherSettings.demoUnlockAll}
          onGoIntro={() => {
            playSound('click');
            navigateTo('intro');
          }}
          onGoMap={() => {
            playSound('click');
            navigateTo('map');
          }}
          onToggleAudio={handleToggleAudio}
          onOpenTeacherMode={() => {
            playSound('click');
            setTeacherModalOpen(true);
          }}
          onDisableDemoMode={() => {
            playSound('click');
            handleToggleDemoUnlockAll(false);
          }}
        />

        {storageWarning && (
          <div
            role="status"
            className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-crimson-wash border-2 border-crimson rounded-xl px-4 py-2 text-center text-sm font-bold text-crimson-ink shadow-[0_4px_0_#b91c1c]"
          >
            Penyimpanan browser sedang terbatas. Progres tetap berjalan selama tab ini terbuka.
          </div>
        )}

        <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 w-full focus:outline-none">
          {currentView === 'intro' && (
            <IntroScreen
              completedCount={completedCount}
              totalRooms={ROOMS_META.length}
              onStart={() => {
                playSound('click');
                navigateTo('map');
              }}
            />
          )}

          {currentView === 'map' && (
            <WorldMapScreen
              appState={appState}
              mapNotice={mapNotice}
              onClearMapNotice={() => setMapNotice('')}
              onEnterRoom={handleEnterRoom}
              onBlockedRoomClick={handleBlockedRoomClick}
              onOpenFinale={() => {
                playSound('click');
                navigateTo('finale');
              }}
            />
          )}

          {currentView === 'room1' && (
            <Room1Screen
              youtubeUrl={appState.teacherSettings.youtubeUrl}
              isCompleted={appState.completedRooms.room1}
              demoUnlockAll={appState.teacherSettings.demoUnlockAll}
              onComplete={() => handleCompleteRoom(1)}
              onGoMap={() => {
                playSound('click');
                navigateTo('map');
              }}
              onGoNextRoom={() => handleEnterRoom(2)}
              onPlaySound={playSound}
            />
          )}

          {currentView === 'room2' && (
            <Room2Screen
              isCompleted={appState.completedRooms.room2}
              demoUnlockAll={appState.teacherSettings.demoUnlockAll}
              onComplete={() => handleCompleteRoom(2)}
              onGoMap={() => {
                playSound('click');
                navigateTo('map');
              }}
              onGoNextRoom={() => handleEnterRoom(3)}
              onPlaySound={playSound}
            />
          )}

          {currentView === 'room3' && (
            <PlaceholderRoomScreen
              key="room3"
              roomKey="room3"
              isCompleted={appState.completedRooms.room3}
              demoUnlockAll={appState.teacherSettings.demoUnlockAll}
              onComplete={() => handleCompleteRoom(3)}
              onGoMap={() => {
                playSound('click');
                navigateTo('map');
              }}
              onGoNextRoom={() => handleEnterRoom(4)}
              onPlaySound={playSound}
            />
          )}

          {currentView === 'room4' && (
            <PlaceholderRoomScreen
              key="room4"
              roomKey="room4"
              isCompleted={appState.completedRooms.room4}
              demoUnlockAll={appState.teacherSettings.demoUnlockAll}
              onComplete={() => handleCompleteRoom(4)}
              onGoMap={() => {
                playSound('click');
                navigateTo('map');
              }}
              onGoNextRoom={() => handleEnterRoom(5)}
              onPlaySound={playSound}
            />
          )}

          {currentView === 'room5' && (
            <Room5Screen
              blooketUrl={appState.teacherSettings.blooketUrl}
              expectedSecretCode={appState.teacherSettings.secretCode}
              isCompleted={appState.completedRooms.room5}
              demoUnlockAll={appState.teacherSettings.demoUnlockAll}
              onCompleteRoom5={handleCompleteRoom5}
              onGoMap={() => {
                playSound('click');
                navigateTo('map');
              }}
              onOpenFinale={() => {
                playSound('click');
                navigateTo('finale');
              }}
              onPlaySound={playSound}
            />
          )}

          {currentView === 'finale' && (
            <FinaleScreen
              appState={appState}
              onGoMap={() => {
                playSound('click');
                navigateTo('map');
              }}
              onRestartAdventure={() => {
                playSound('click');
                handleResetProgress();
                navigateTo('intro');
              }}
              onPlaySound={playSound}
            />
          )}
        </main>

        <UnlockModal
          isOpen={Boolean(unlockCelebration)}
          completedRoomNumber={unlockCelebration?.completedRoomNumber ?? 1}
          unlockedRoomNumber={unlockCelebration?.unlockedRoomNumber ?? 2}
          unlockedRoomTitle={unlockCelebration?.unlockedRoomTitle ?? ''}
          onClose={() => setUnlockCelebration(null)}
          onGoNextRoom={() => {
            const target = unlockCelebration?.unlockedRoomNumber;
            setUnlockCelebration(null);
            if (target) {
              playSound('click');
              navigateTo(`room${target}`);
            }
          }}
          onGoMap={() => {
            setUnlockCelebration(null);
            playSound('click');
            navigateTo('map');
          }}
        />

        <TeacherModeModal
          isOpen={teacherModalOpen}
          teacherSettings={appState.teacherSettings}
          onClose={() => setTeacherModalOpen(false)}
          onToggleDemoUnlockAll={handleToggleDemoUnlockAll}
          onUpdateTeacherSettings={handleUpdateTeacherSettings}
          onResetProgress={handleResetProgress}
          onPlaySound={playSound}
        />
      </div>
    </ErrorBoundary>
  );
}
