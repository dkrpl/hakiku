import React, { useCallback, useState } from 'react';
import { SCENES } from '../data/defaultContent';
import { QuizChallenge } from '../challenges/QuizChallenge';
import { SortChallenge } from '../challenges/SortChallenge';
import { BlooketMission } from '../challenges/BlooketMission';
import { DoorCodePanel } from '../challenges/DoorCodePanel';
import { UnlockGate } from '../challenges/UnlockGate';
import { starsFromMistakes } from '../components/GameFx';
import { KeyIcon } from '../components/icons/StoryIcons';

export function ChallengeScreen({ room, settings, onPlaySound }) {
  const [stage, setStage] = useState('challenge'); // challenge | blooket | gate | code
  const [attempt, setAttempt] = useState(0);
  const [stars, setStars] = useState(3);

  function handleChallengeDone(mistakes = 0) {
    setStars(starsFromMistakes(mistakes));
    if (room.showBlooket) {
      onPlaySound('correct');
      setStage('blooket');
    } else {
      onPlaySound('victory');
      setStage('gate');
    }
  }

  function handleBlooketDone() {
    onPlaySound('victory');
    setStage('gate');
  }

  const handleGateOpened = useCallback(() => setStage('code'), []);

  function handleRestart() {
    onPlaySound('click');
    setAttempt((n) => n + 1);
    setStage('challenge');
  }

  return (
    <section className="game-stage pt-18 sm:pt-20 pb-6 px-3 sm:px-6 lg:px-8">
      <img src={SCENES[room.number]} width="1280" height="720" alt="" className="game-backdrop-img" />
      <div aria-hidden="true" className="fixed inset-0 bg-ink/25 pointer-events-none z-0" />

      <div className="relative z-10 w-full flex-1 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="game-ribbon self-start">
            <span className="px-2 py-0.5 rounded-lg bg-gold text-ink text-xs font-extrabold">RUANG {room.number}</span>
            <h1 className="font-display font-extrabold text-base sm:text-xl text-white m-0">{room.title}</h1>
          </div>
          {stage === 'challenge' && (
            <div className="inline-flex items-center gap-2 self-start md:self-auto px-3 py-1.5 rounded-xl bg-parchment border-2 border-ink text-sm font-extrabold text-ink shadow-[0_3px_0_#14261c]">
              <KeyIcon className="w-5 h-5 shrink-0" />
              <span>Selesaikan untuk mendapat kode pintu</span>
            </div>
          )}
        </div>

        {stage === 'challenge' && (
          <>
            <div className="max-w-5xl w-full mx-auto bg-parchment/95 border-[3px] border-ink rounded-2xl px-4 py-3 shadow-[0_4px_0_#14261c]">
              <p className="story-body font-bold text-ink m-0">{room.instruction}</p>
            </div>
            <div className="flex-1 flex flex-col justify-center" key={attempt}>
              {room.type === 'sortir' ? (
                <SortChallenge
                  cards={room.cards}
                  leftLabel={room.leftLabel}
                  rightLabel={room.rightLabel}
                  onComplete={handleChallengeDone}
                  onPlaySound={onPlaySound}
                />
              ) : (
                <QuizChallenge questions={room.questions} onComplete={handleChallengeDone} onPlaySound={onPlaySound} />
              )}
            </div>
          </>
        )}

        {stage === 'blooket' && (
          <div className="flex-1 flex flex-col justify-center">
            <BlooketMission blooketUrl={settings.blooketUrl} onDone={handleBlooketDone} onPlaySound={onPlaySound} />
          </div>
        )}

        {stage === 'gate' && (
          <div className="flex-1 flex flex-col justify-center">
            <UnlockGate stars={stars} onOpened={handleGateOpened} onPlaySound={onPlaySound} />
          </div>
        )}

        {stage === 'code' && (
          <div className="flex-1 flex flex-col justify-center">
            <DoorCodePanel
              roomNumber={room.number}
              doorCode={room.doorCode}
              isFinal={room.number === 5}
              stars={stars}
              returnUrl={settings.canvaUrl}
              returnSeconds={settings.returnSeconds}
              onRestart={handleRestart}
            />
          </div>
        )}
      </div>
    </section>
  );
}
