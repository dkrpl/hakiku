import React, { useEffect, useRef, useState } from 'react';
import { ROOM1_CONTENT, SCENE_ASSETS } from '../data/hakikuData';
import { parseYoutubeEmbedUrl } from '../utils/storage';
import { RoomFooterNav } from '../components/RoomFooterNav';
import {
  AlertIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  NextIcon,
  ResetIcon,
} from '../components/icons/StoryIcons';

const OPTION_BADGES = [
  { letter: 'A', cls: 'bg-sky text-white' },
  { letter: 'B', cls: 'bg-gold text-ink' },
  { letter: 'C', cls: 'bg-meadow text-white' },
];

export function Room1Screen({
  youtubeUrl,
  isCompleted,
  demoUnlockAll,
  onComplete,
  onGoMap,
  onGoNextRoom,
  onPlaySound,
}) {
  const [subPage, setSubPage] = useState(1);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoReloadKey, setVideoReloadKey] = useState(0);

  // Interactive step-by-step Quiz Master Challenge state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [attemptState, setAttemptState] = useState('idle'); // 'idle' | 'wrong' | 'correct'
  const tab1Ref = useRef(null);
  const tab2Ref = useRef(null);

  const parsedVideo = parseYoutubeEmbedUrl(youtubeUrl);
  const questions = ROOM1_CONTENT.quizQuestions;
  const activeQuestion = questions[questionIndex];

  useEffect(() => {
    setVideoLoaded(false);
  }, [youtubeUrl, videoReloadKey]);

  function handleTabKeyDown(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const nextTab = subPage === 1 ? 2 : 1;
      setSubPage(nextTab);
      (nextTab === 1 ? tab1Ref : tab2Ref).current?.focus();
    }
  }

  function handleAnswerClick(optionId) {
    setSelectedOption(optionId);
    if (optionId === activeQuestion.correctOptionId) {
      setAttemptState('correct');
      if (questionIndex === questions.length - 1) {
        onComplete();
      } else {
        onPlaySound('correct');
      }
    } else {
      setAttemptState('wrong');
      onPlaySound('wrong');
    }
  }

  function handleNextQuestion() {
    setQuestionIndex((idx) => Math.min(idx + 1, questions.length - 1));
    setSelectedOption('');
    setAttemptState('idle');
    onPlaySound('click');
  }

  function handleRestartQuiz() {
    setQuestionIndex(0);
    setSelectedOption('');
    setAttemptState('idle');
    onPlaySound('click');
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [subPage]);

  const canAdvanceRoom = isCompleted || demoUnlockAll;

  return (
    <section className="animate-screen-enter game-stage pt-18 sm:pt-20 pb-4 px-3 sm:px-6 lg:px-8">
      {/* Full-screen illustrated Indonesian SD classroom background */}
      <img
        src={SCENE_ASSETS.room1}
        width="1280"
        height="720"
        alt=""
        className="game-backdrop-img"
      />
      <div aria-hidden="true" className="fixed inset-0 bg-ink/25 pointer-events-none z-0" />

      <div className="relative z-10 w-full flex-1 flex flex-col justify-between gap-4">
        {/* Top In-World Room Ribbon + Stage Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="game-ribbon">
            <span className="px-2 py-0.5 rounded-lg bg-gold text-ink text-xs font-extrabold">
              POS 1
            </span>
            <h1 className="font-display font-extrabold text-base sm:text-xl text-white m-0">
              Ruang 1: Mengenal Hak dan Kewajiban
            </h1>
          </div>

          <div
            role="tablist"
            aria-label="Sub-halaman Ruang 1"
            onKeyDown={handleTabKeyDown}
            className="flex flex-wrap gap-2"
          >
            <button
              ref={tab1Ref}
              type="button"
              role="tab"
              id="r1-tab-1"
              aria-selected={subPage === 1}
              aria-controls="r1-panel-1"
              tabIndex={subPage === 1 ? 0 : -1}
              onClick={() => {
                setSubPage(1);
                onPlaySound('click');
              }}
              className={`story-btn text-sm px-4 py-2 ${
                subPage === 1 ? 'story-btn-gold' : 'story-btn-paper'
              }`}
            >
              1. Papan Materi & Video
            </button>
            <button
              ref={tab2Ref}
              type="button"
              role="tab"
              id="r1-tab-2"
              aria-selected={subPage === 2}
              aria-controls="r1-panel-2"
              tabIndex={subPage === 2 ? 0 : -1}
              onClick={() => {
                setSubPage(2);
                onPlaySound('click');
              }}
              className={`story-btn text-sm px-4 py-2 ${
                subPage === 2 ? 'story-btn-gold' : 'story-btn-paper'
              }`}
            >
              2. Tantangan Kuis
            </button>
          </div>
        </div>

        {/* Stage 1: Full-width Wooden Classroom Chalkboard */}
        {subPage === 1 && (
          <div
            id="r1-panel-1"
            role="tabpanel"
            aria-labelledby="r1-tab-1"
            className="flex-1 flex flex-col justify-center"
          >
            <div className="game-chalkboard p-4 sm:p-6 lg:p-7 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-center">
                {/* Left Chalkboard Notes: Pinned Concept Posters */}
                <div className="lg:col-span-5 space-y-3.5">
                  <p className="font-display font-bold text-lg sm:text-xl text-gold-wash m-0">
                    Catatan Papan Tulis Kelas
                  </p>

                  {ROOM1_CONTENT.concepts.map((item) => (
                    <article
                      key={item.id}
                      className={`p-4 rounded-2xl border-[2.5px] border-ink shadow-[0_4px_0_#14261c] text-ink ${
                        item.tone === 'sky' ? 'bg-sky-wash' : 'bg-meadow-wash'
                      }`}
                    >
                      <h2 className="font-display font-extrabold text-xl text-ink m-0 mb-1">
                        {item.term}
                      </h2>
                      <p className="text-sm sm:text-base font-semibold text-ink m-0 mb-2">
                        {item.definition}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-ink-muted bg-white border-2 border-ink-border/60 rounded-xl px-3 py-1.5 m-0">
                        {item.example}
                      </p>
                    </article>
                  ))}

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-parchment border-2 border-ink text-ink">
                    <img
                      src={SCENE_ASSETS.mascot}
                      width="48"
                      height="48"
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border-2 border-ink bg-gold-wash shrink-0"
                    />
                    <p className="text-xs sm:text-sm font-bold m-0">{ROOM1_CONTENT.balanceNote}</p>
                  </div>
                </div>

                {/* Right Chalkboard Screen: YouTube Video Player */}
                <div className="lg:col-span-7 space-y-3">
                  <div>
                    <h2 className="font-display font-extrabold text-lg sm:text-2xl text-gold-wash m-0">
                      {ROOM1_CONTENT.videoTitle}
                    </h2>
                    <p className="text-sm text-white/95 m-0 mt-1">{ROOM1_CONTENT.videoCaption}</p>
                  </div>

                  {parsedVideo.valid ? (
                    <div className="space-y-3">
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-[3px] border-ink bg-ink shadow-[0_5px_0_#14261c]">
                        {!videoLoaded && (
                          <div
                            role="status"
                            className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center p-4 text-center bg-sky-wash text-ink"
                          >
                            <p className="font-display font-bold text-base sm:text-lg m-0">
                              Memuat video pembelajaran YouTube...
                            </p>
                            <p className="text-sm text-ink-muted m-0 mt-1">
                              Jika video belum tampil di jaringan kelas, buka lewat tautan cadangan
                              di bawah.
                            </p>
                          </div>
                        )}
                        <iframe
                          key={`${parsedVideo.videoId}-${videoReloadKey}`}
                          src={parsedVideo.embedUrl}
                          title={ROOM1_CONTENT.videoTitle}
                          width="560"
                          height="315"
                          onLoad={() => setVideoLoaded(true)}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0 relative z-10"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setVideoReloadKey((n) => n + 1);
                            onPlaySound('click');
                          }}
                          className="story-btn story-btn-paper text-sm py-2 px-3.5"
                        >
                          <ResetIcon className="w-4 h-4 shrink-0" />
                          <span>Muat Ulang Video</span>
                        </button>

                        <a
                          href={parsedVideo.watchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="story-btn story-btn-gold text-sm py-2 px-3.5"
                        >
                          <span>Buka di YouTube</span>
                          <ExternalLinkIcon className="w-4 h-4 shrink-0" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div
                      role="alert"
                      className="aspect-video rounded-2xl border-2 border-crimson bg-crimson-wash p-5 flex flex-col items-center justify-center text-center gap-2 text-ink"
                    >
                      <AlertIcon className="w-8 h-8 text-crimson-ink" />
                      <p className="font-bold text-crimson-ink m-0">
                        Tautan video YouTube belum valid atau kosong.
                      </p>
                      <p className="text-sm text-ink-muted m-0">
                        Buka Mode Guru di pojok kanan atas untuk memasukkan link video YouTube baru
                        atau kembalikan video sampel default.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: Interactive 1-Question-at-a-Time Quiz Master Game Board */}
        {subPage === 2 && (
          <div
            id="r1-panel-2"
            role="tabpanel"
            aria-labelledby="r1-tab-2"
            className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto"
          >
            <div className="game-board-wood p-4 sm:p-5 space-y-3.5">
              {/* Game Challenge Header & Question Counter */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b-2 border-ink-border/40">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-xl bg-sky text-white font-display font-extrabold text-sm border-2 border-ink">
                    Soal {questionIndex + 1} dari {questions.length}
                  </span>
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-meadow-wash border-2 border-meadow text-meadow text-xs sm:text-sm font-extrabold">
                      <CheckCircleIcon className="w-4 h-4 shrink-0" />
                      <span>Kunci Ruang 2 Terbuka</span>
                    </span>
                  )}
                </div>

                {questionIndex > 0 && (
                  <button
                    type="button"
                    onClick={handleRestartQuiz}
                    className="story-btn story-btn-paper text-xs sm:text-sm py-1.5 px-3"
                  >
                    <ResetIcon className="w-4 h-4 shrink-0" />
                    <span>Ulangi Soal 1</span>
                  </button>
                )}
              </div>

              {/* Big Smartboard-Readable Question Plate */}
              <div className="game-chalkboard p-3.5 sm:p-4">
                <h2 className="font-display font-extrabold text-lg sm:text-2xl text-gold-wash m-0 leading-snug">
                  {activeQuestion.prompt}
                </h2>
              </div>

              {/* Tactile A / B / C Game Answer Tiles */}
              <div className="grid grid-cols-1 gap-2.5">
                {activeQuestion.options.map((opt, idx) => {
                  const badge = OPTION_BADGES[idx] || OPTION_BADGES[0];
                  const isPicked = selectedOption === opt.id;
                  const showCorrect = isPicked && attemptState === 'correct';
                  const showWrong = isPicked && attemptState === 'wrong';

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleAnswerClick(opt.id)}
                      className={`w-full text-left p-3 sm:p-3.5 rounded-2xl border-[3px] shadow-[0_4px_0_#14261c] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 flex items-center gap-3 min-h-14 ${
                        showCorrect
                          ? 'bg-meadow-wash border-meadow text-ink'
                          : showWrong
                          ? 'bg-crimson-wash border-crimson text-ink'
                          : 'bg-white border-ink text-ink hover:bg-gold-wash/60'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border-2 border-ink font-display font-extrabold text-base shrink-0 ${badge.cls}`}
                      >
                        {badge.letter}
                      </span>
                      <span className="story-body font-extrabold flex-1">{opt.label}</span>
                      {showCorrect && (
                        <CheckCircleIcon className="w-6 h-6 text-meadow shrink-0" />
                      )}
                      {showWrong && <AlertIcon className="w-6 h-6 text-crimson shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Live Mascot Coaching / Celebration Dialogue */}
              <div
                role={attemptState === 'wrong' ? 'alert' : 'status'}
                aria-live="polite"
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border-[2.5px] ${
                  attemptState === 'correct'
                    ? 'bg-meadow-wash border-meadow text-ink'
                    : attemptState === 'wrong'
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
                    {attemptState === 'correct'
                      ? activeQuestion.correctHint
                      : attemptState === 'wrong'
                      ? activeQuestion.wrongHint
                      : 'Pilih kartu jawaban A, B, atau C yang paling tepat untuk membuka kunci Ruang 2!'}
                  </p>
                </div>

                {attemptState === 'correct' && questionIndex < questions.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="story-btn story-btn-gold text-sm sm:text-base shrink-0"
                  >
                    <span>Lanjut ke Soal 2</span>
                    <NextIcon className="w-5 h-5 shrink-0" />
                  </button>
                )}
              </div>
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
          backLabel={subPage === 2 ? 'Kembali ke Papan Materi' : 'Kembali'}
          onNext={
            subPage === 1
              ? () => {
                  setSubPage(2);
                  onPlaySound('click');
                }
              : canAdvanceRoom
              ? onGoNextRoom
              : undefined
          }
          nextLabel={subPage === 1 ? 'Lanjut ke Kuis' : 'Lanjut ke Ruang 2'}
          nextVariant={subPage === 1 ? 'gold' : 'green'}
          lockedHint={
            subPage === 2 && !canAdvanceRoom
              ? 'Jawab kedua soal kuis dengan tepat untuk menemukan kunci Ruang 2.'
              : ''
          }
        />
      </div>
    </section>
  );
}
