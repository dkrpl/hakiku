import React, { useState } from 'react';
import { AlertIcon, CheckCircleIcon, NextIcon, ResetIcon } from '../components/icons/StoryIcons';
import { Confetti, MascotBubble, ProgressDots } from '../components/GameFx';

const OPTION_BADGES = {
  a: { letter: 'A', cls: 'bg-sky text-white' },
  b: { letter: 'B', cls: 'bg-gold text-ink' },
  c: { letter: 'C', cls: 'bg-meadow text-white' },
  d: { letter: 'D', cls: 'bg-wood text-white' },
};

const CHEERS = ['Hebat!', 'Keren!', 'Mantap!', 'Luar biasa!', 'Pintar!'];

/**
 * Kuis pilihan ganda satu soal per layar.
 * Jawaban salah: kartu bergetar dan maskot memberi petunjuk (pilihan itu dicoret).
 * Jawaban benar: konfeti, combo beruntun, lalu lanjut. Jumlah kesalahan dikirim ke onComplete.
 */
export function QuizChallenge({ questions, onComplete, onPlaySound }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState('');
  const [state, setState] = useState('idle'); // idle | wrong | correct
  const [crossed, setCrossed] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [missedThis, setMissedThis] = useState(false);
  const [burst, setBurst] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  function handleAnswer(optionId) {
    if (state === 'correct' || crossed.includes(optionId)) return;
    setPicked(optionId);
    if (optionId === question.answer) {
      setState('correct');
      setStreak((s) => (missedThis ? 1 : s + 1));
      setBurst((b) => b + 1);
      if (isLast) {
        onComplete(mistakes);
      } else {
        onPlaySound('correct');
      }
    } else {
      setState('wrong');
      setCrossed((c) => [...c, optionId]);
      setMistakes((m) => m + 1);
      setMissedThis(true);
      setStreak(0);
      setShakeKey((k) => k + 1);
      onPlaySound('wrong');
    }
  }

  function handleNext() {
    setIndex((i) => Math.min(i + 1, questions.length - 1));
    setPicked('');
    setState('idle');
    setCrossed([]);
    setMissedThis(false);
    onPlaySound('click');
  }

  function handleRestart() {
    setIndex(0);
    setPicked('');
    setState('idle');
    setCrossed([]);
    setMistakes(0);
    setStreak(0);
    setMissedThis(false);
    onPlaySound('click');
  }

  const bubbleText =
    state === 'correct'
      ? `${CHEERS[index % CHEERS.length]} ${question.correctHint}`
      : state === 'wrong'
      ? question.wrongHint
      : 'Baca soalnya baik-baik, lalu ketuk jawaban yang paling tepat!';

  return (
    <div className="relative max-w-4xl w-full mx-auto">
      <Confetti burstKey={burst} pieces={28} />
      <div key={shakeKey} className={`game-board-wood p-4 sm:p-5 space-y-3.5 ${shakeKey ? 'animate-shake' : ''}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b-2 border-ink-border/40">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-sky text-white font-display font-extrabold text-sm border-2 border-ink">
              Soal {index + 1} dari {questions.length}
            </span>
            <ProgressDots total={questions.length} current={index} doneCount={index + (state === 'correct' ? 1 : 0)} />
          </div>
          <div className="flex items-center gap-2">
            {streak >= 2 && (
              <span key={streak} className="animate-bubble-in px-3 py-1 rounded-xl bg-crimson text-white font-display font-extrabold text-sm border-2 border-ink">
                🔥 Benar beruntun ×{streak}
              </span>
            )}
            {index > 0 && (
              <button type="button" onClick={handleRestart} className="story-btn story-btn-paper text-xs sm:text-sm py-1.5 px-3">
                <ResetIcon className="w-4 h-4 shrink-0" />
                <span>Ulangi dari Soal 1</span>
              </button>
            )}
          </div>
        </div>

        <div key={question.id} className="game-chalkboard p-3.5 sm:p-4 animate-screen-enter">
          <h2 className="font-display font-extrabold text-lg sm:text-2xl text-gold-wash m-0 leading-snug">{question.prompt}</h2>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {question.options.map((opt, i) => {
            const badge = OPTION_BADGES[opt.id] || OPTION_BADGES.a;
            const isPicked = picked === opt.id;
            const isCrossed = crossed.includes(opt.id);
            const showCorrect = isPicked && state === 'correct';
            const showWrong = isCrossed;
            return (
              <button
                key={`${question.id}-${opt.id}`}
                type="button"
                onClick={() => handleAnswer(opt.id)}
                aria-pressed={isPicked}
                aria-disabled={isCrossed || undefined}
                style={{ animationDelay: `${i * 0.07}s` }}
                className={`answer-card animate-option-in w-full text-left p-3 sm:p-3.5 rounded-2xl border-[3px] shadow-[0_4px_0_#14261c] transition-transform flex items-center gap-3 min-h-14 ${
                  showCorrect
                    ? 'bg-meadow-wash border-meadow text-ink scale-[1.02]'
                    : showWrong
                    ? 'bg-crimson-wash border-crimson text-ink opacity-70 line-through decoration-crimson decoration-2'
                    : 'bg-white border-ink text-ink hover:-translate-y-0.5 hover:bg-gold-wash/60 active:translate-y-0.5'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border-2 border-ink font-display font-extrabold text-base shrink-0 ${badge.cls}`}
                >
                  {badge.letter}
                </span>
                <span className="story-body font-extrabold flex-1">{opt.label}</span>
                {showCorrect && <CheckCircleIcon className="w-7 h-7 text-meadow shrink-0 animate-star-pop" />}
                {showWrong && <AlertIcon className="w-6 h-6 text-crimson shrink-0" />}
              </button>
            );
          })}
        </div>

        <div
          role={state === 'wrong' ? 'alert' : 'status'}
          aria-live="polite"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <MascotBubble text={bubbleText} tone={state} />
          {state === 'correct' && !isLast && (
            <button type="button" onClick={handleNext} className="story-btn story-btn-gold text-sm sm:text-base shrink-0 animate-bubble-in">
              <span>Lanjut ke Soal {index + 2}</span>
              <NextIcon className="w-5 h-5 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
