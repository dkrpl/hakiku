import React, { useEffect, useRef, useState } from 'react';
import { DEFAULT_SECRET_CODE, ROOM5_CONTENT, SCENE_ASSETS } from '../data/hakikuData';
import { matchesSecretCode } from '../utils/storage';
import { RoomFooterNav } from '../components/RoomFooterNav';
import {
  AlertIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  KeyIcon,
  NextIcon,
} from '../components/icons/StoryIcons';

const OPTION_BADGES = [
  { letter: 'A', cls: 'bg-sky text-white' },
  { letter: 'B', cls: 'bg-gold text-ink' },
  { letter: 'C', cls: 'bg-meadow text-white' },
];

export function Room5Screen({
  blooketUrl,
  expectedSecretCode,
  isCompleted,
  demoUnlockAll,
  onCompleteRoom5,
  onGoMap,
  onOpenFinale,
  onPlaySound,
}) {
  const [subPage, setSubPage] = useState(1);
  const [warmupChoice, setWarmupChoice] = useState('');
  const [warmupState, setWarmupState] = useState('idle'); // 'idle' | 'wrong' | 'correct'

  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const secretInputRef = useRef(null);
  const tab1Ref = useRef(null);
  const tab2Ref = useRef(null);

  const warmup = ROOM5_CONTENT.warmupQuestion;

  function handleTabKeyDown(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const nextTab = subPage === 1 ? 2 : 1;
      setSubPage(nextTab);
      (nextTab === 1 ? tab1Ref : tab2Ref).current?.focus();
    }
  }

  function handleWarmupAnswer(optionId) {
    setWarmupChoice(optionId);
    if (optionId === warmup.correctOptionId) {
      setWarmupState('correct');
      onPlaySound('correct');
    } else {
      setWarmupState('wrong');
      onPlaySound('wrong');
    }
  }

  function handleSecretSubmit(event) {
    event.preventDefault();
    if (!codeInput.trim()) {
      setCodeError('Masukkan kode rahasia dari guru terlebih dahulu.');
      onPlaySound('wrong');
      secretInputRef.current?.focus();
      return;
    }
    if (!matchesSecretCode(codeInput, expectedSecretCode)) {
      setCodeError('Kode rahasia belum tepat. Periksa kembali kode yang diberikan guru.');
      onPlaySound('wrong');
      secretInputRef.current?.focus();
      return;
    }
    setCodeError('');
    onCompleteRoom5();
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [subPage]);

  const canOpenFinale = isCompleted || demoUnlockAll;

  return (
    <section className="animate-screen-enter game-stage pt-18 sm:pt-20 pb-4 px-3 sm:px-6 lg:px-8">
      {/* Full-screen golden hilltop adventure tower world */}
      <img
        src={SCENE_ASSETS.room5}
        width="1280"
        height="720"
        alt=""
        className="game-backdrop-img"
      />
      <div aria-hidden="true" className="fixed inset-0 bg-ink/20 pointer-events-none z-0" />

      <div className="relative z-10 w-full flex-1 flex flex-col justify-between gap-2.5">
        {/* Top Wood Ribbon & Stage Switch */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="game-ribbon">
            <span className="px-2 py-0.5 rounded-lg bg-gold text-ink text-xs font-extrabold">
              POS 5
            </span>
            <h1 className="font-display font-extrabold text-base sm:text-xl text-white m-0">
              Ruang 5: Tantangan HAKIKU
            </h1>
          </div>

          <div
            role="tablist"
            aria-label="Sub-halaman Ruang 5"
            onKeyDown={handleTabKeyDown}
            className="flex flex-wrap gap-2"
          >
            <button
              ref={tab1Ref}
              type="button"
              role="tab"
              id="r5-tab-1"
              aria-selected={subPage === 1}
              aria-controls="r5-panel-1"
              tabIndex={subPage === 1 ? 0 : -1}
              onClick={() => {
                setSubPage(1);
                onPlaySound('click');
              }}
              className={`story-btn text-sm px-4 py-2 ${
                subPage === 1 ? 'story-btn-gold' : 'story-btn-paper'
              }`}
            >
              1. Kuis Pemanasan
            </button>
            <button
              ref={tab2Ref}
              type="button"
              role="tab"
              id="r5-tab-2"
              aria-selected={subPage === 2}
              aria-controls="r5-panel-2"
              tabIndex={subPage === 2 ? 0 : -1}
              onClick={() => {
                setSubPage(2);
                onPlaySound('click');
              }}
              className={`story-btn text-sm px-4 py-2 ${
                subPage === 2 ? 'story-btn-gold' : 'story-btn-paper'
              }`}
            >
              2. Misi Blooket
            </button>
          </div>
        </div>

        {/* Stage 1: Game Quiz Challenge A/B/C */}
        {subPage === 1 && (
          <div
            id="r5-panel-1"
            role="tabpanel"
            aria-labelledby="r5-tab-1"
            className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto"
          >
            <div className="game-board-wood p-3.5 sm:p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="story-heading-section font-extrabold m-0">
                  {ROOM5_CONTENT.warmupHeading}
                </h2>
                <span className="px-3 py-1 rounded-xl bg-gold text-ink border-2 border-ink text-xs font-extrabold">
                  Tantangan Menara
                </span>
              </div>

              <div className="game-chalkboard p-3 sm:p-3.5">
                <p className="font-display font-extrabold text-base sm:text-xl text-gold-wash m-0 leading-snug">
                  {warmup.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {warmup.options.map((opt, idx) => {
                  const badge = OPTION_BADGES[idx] || OPTION_BADGES[0];
                  const isPicked = warmupChoice === opt.id;
                  const showCorrect = isPicked && warmupState === 'correct';
                  const showWrong = isPicked && warmupState === 'wrong';

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleWarmupAnswer(opt.id)}
                      className={`w-full text-left p-2.5 sm:p-3 rounded-2xl border-[3px] shadow-[0_3px_0_#14261c] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 flex items-center gap-3 min-h-12 ${
                        showCorrect
                          ? 'bg-meadow-wash border-meadow text-ink'
                          : showWrong
                          ? 'bg-crimson-wash border-crimson text-ink'
                          : 'bg-white border-ink text-ink hover:bg-gold-wash/60'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border-2 border-ink font-display font-extrabold text-sm shrink-0 ${badge.cls}`}
                      >
                        {badge.letter}
                      </span>
                      <span className="story-body font-extrabold flex-1">{opt.label}</span>
                      {showCorrect && <CheckCircleIcon className="w-6 h-6 text-meadow shrink-0" />}
                      {showWrong && <AlertIcon className="w-6 h-6 text-crimson shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div
                role={warmupState === 'wrong' ? 'alert' : 'status'}
                aria-live="polite"
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2.5 rounded-2xl border-[2.5px] ${
                  warmupState === 'correct'
                    ? 'bg-meadow-wash border-meadow text-ink'
                    : warmupState === 'wrong'
                    ? 'bg-crimson-wash border-crimson text-crimson-ink'
                    : 'bg-gold-wash border-ink text-ink'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={SCENE_ASSETS.mascot}
                    width="46"
                    height="46"
                    alt=""
                    className="w-11 h-11 rounded-full object-cover border-2 border-ink bg-white shrink-0"
                  />
                  <p className="text-sm sm:text-base font-extrabold m-0">
                    {warmupState === 'correct'
                      ? warmup.correctHint
                      : warmupState === 'wrong'
                      ? warmup.wrongHint
                      : 'Pilih jawaban A, B, atau C, lalu bersiap menuju Misi Blooket bersama kelas!'}
                  </p>
                </div>

                {warmupState === 'correct' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSubPage(2);
                      onPlaySound('click');
                    }}
                    className="story-btn story-btn-gold text-sm shrink-0"
                  >
                    <span>Ke Misi Blooket</span>
                    <NextIcon className="w-4 h-4 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: Twin Adventure Boards (Blooket Mission + Secret Code Vault) */}
        {subPage === 2 && (
          <div
            id="r5-panel-2"
            role="tabpanel"
            aria-labelledby="r5-tab-2"
            className="flex-1 flex flex-col justify-center max-w-6xl w-full mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-7 game-board-wood p-5 sm:p-6 bg-sky-wash flex flex-col justify-between gap-4">
                <div className="space-y-4">
                  <h2 className="story-heading-page font-extrabold m-0">
                    {ROOM5_CONTENT.missionHeading}
                  </h2>

                  <ol className="space-y-2 pl-5 m-0 story-body font-semibold text-ink">
                    {ROOM5_CONTENT.missionSteps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>

                  <div className="p-3.5 rounded-2xl bg-white border-2 border-ink space-y-1">
                    <p className="text-xs font-extrabold text-ink-muted m-0">
                      Tautan Blooket Aktif (dapat diubah lewat Mode Guru):
                    </p>
                    <p className="text-sm font-extrabold text-sky break-all m-0">{blooketUrl}</p>
                  </div>
                </div>

                <div>
                  <a
                    href={blooketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onPlaySound('click')}
                    className="story-btn story-btn-gold text-base sm:text-lg px-6 py-3.5 w-full sm:w-auto"
                  >
                    <span>Mulai Misi Blooket (Tab Baru)</span>
                    <ExternalLinkIcon className="w-5 h-5 shrink-0" />
                  </a>
                </div>
              </div>

              <form
                onSubmit={handleSecretSubmit}
                noValidate
                className="lg:col-span-5 game-board-wood p-5 sm:p-6 bg-gold-wash flex flex-col justify-between gap-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={SCENE_ASSETS.mascot}
                      width="56"
                      height="56"
                      alt=""
                      className="w-14 h-14 rounded-full object-cover border-2 border-ink bg-white shrink-0"
                    />
                    <div>
                      <h2 className="font-display font-extrabold text-xl text-ink m-0 flex items-center gap-1.5">
                        <KeyIcon className="w-5 h-5 text-ink shrink-0" />
                        <span>Gerbang Kode Rahasia</span>
                      </h2>
                      <p className="text-xs font-bold text-ink-muted m-0">
                        Masukkan kode untuk membuka perayaan akhir
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="secret-code-input" className="block font-extrabold text-ink">
                      Kode Rahasia Misi
                    </label>
                    <input
                      ref={secretInputRef}
                      id="secret-code-input"
                      type="text"
                      autoComplete="off"
                      value={codeInput}
                      onChange={(e) => {
                        setCodeInput(e.target.value);
                        setCodeError('');
                      }}
                      aria-invalid={Boolean(codeError)}
                      aria-describedby="secret-code-hint secret-code-error"
                      placeholder="Ketik kode rahasia..."
                      className="w-full min-h-13 px-4 py-2.5 rounded-2xl border-[2.5px] border-ink bg-white text-lg font-extrabold tracking-widest uppercase text-ink"
                    />
                    <p id="secret-code-hint" className="text-sm font-semibold text-ink-muted m-0">
                      Petunjuk uji prototype: kode default adalah{' '}
                      <strong>{DEFAULT_SECRET_CODE}</strong> (kecuali diubah di Mode Guru).
                    </p>
                  </div>

                  {codeError && (
                    <p
                      id="secret-code-error"
                      role="alert"
                      className="flex items-start gap-2 text-sm font-bold text-crimson-ink bg-crimson-wash border-2 border-crimson rounded-xl px-3.5 py-2.5 m-0"
                    >
                      <AlertIcon className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{codeError}</span>
                    </p>
                  )}
                </div>

                <button type="submit" className="story-btn story-btn-green w-full text-base py-3.5">
                  <span>Buka Gerbang Akhir</span>
                  <NextIcon className="w-5 h-5 shrink-0" />
                </button>
              </form>
            </div>
          </div>
        )}

        <RoomFooterNav
          onGoMap={onGoMap}
          onBack={() => {
            if (subPage === 2) {
              setSubPage(1);
              onPlaySound('click');
            } else {
              onGoMap();
            }
          }}
          backLabel={subPage === 2 ? 'Kembali ke Pemanasan' : 'Kembali'}
          onNext={
            subPage === 1
              ? () => {
                  setSubPage(2);
                  onPlaySound('click');
                }
              : canOpenFinale
              ? onOpenFinale
              : undefined
          }
          nextLabel={subPage === 1 ? 'Lanjut ke Misi Blooket' : 'Buka Halaman Akhir'}
          nextVariant={subPage === 1 ? 'gold' : 'green'}
          lockedHint={
            subPage === 2 && !canOpenFinale
              ? 'Masukkan Kode Rahasia yang benar untuk membuka Halaman Akhir.'
              : ''
          }
        />
      </div>
    </section>
  );
}
