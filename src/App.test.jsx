import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { ROOM2_CONTENT } from './data/hakikuData';
import { STORAGE_KEY } from './utils/storage';

describe('HAKIKU Prototype End-to-End Flows', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('navigates from Intro to World Map and blocks entering locked Rooms 2-5', async () => {
    const user = userEvent.setup();
    render(<App />);

    // PT-01 Intro screen with hero image and specific primary CTA
    expect(screen.getByRole('heading', { level: 1, name: /HAKIKU/i })).toBeInTheDocument();
    const heroImg = screen.getByRole('img', { name: /peta petualangan/i });
    expect(heroImg).toHaveAttribute('src', '/assets/scenes/intro-world.jpg');

    await user.click(screen.getByRole('button', { name: /Mulai Petualangan/i }));

    // PT-02 World Map: Room 1 open, Room 2 locked
    expect(screen.getByRole('heading', { level: 1, name: /Peta Dunia HAKIKU/i })).toBeInTheDocument();
    const room2Button = screen.getByRole('button', { name: /Ruang 2/i });
    expect(room2Button).toHaveAttribute('aria-disabled', 'true');

    await user.click(room2Button);

    // Clicking locked room keeps user on World Map and shows guidance message
    expect(screen.getByRole('heading', { level: 1, name: /Peta Dunia HAKIKU/i })).toBeInTheDocument();
    expect(screen.getByText(/Ruang 2 masih terkunci/i)).toBeInTheDocument();
  });

  it('completes Room 1 quiz (handling wrong attempt first) to unlock Room 2 and persist progress', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Mulai Petualangan/i }));
    await user.click(screen.getByRole('button', { name: /Ruang 1/i }));

    // Sub-page 1 shows reading content and YouTube iframe
    expect(screen.getByRole('heading', { level: 1, name: /Mengenal Hak dan Kewajiban/i })).toBeInTheDocument();
    expect(screen.getByTitle(/Video Sampel/i)).toBeInTheDocument();

    // Go to Sub-page 2 via consistent Lanjut button
    await user.click(screen.getByRole('button', { name: /Lanjut ke Kuis/i }));

    // Interactive A/B/C Quiz Challenge: wrong tile on Soal 1 gives instant mascot coaching without unlocking
    await user.click(screen.getByRole('button', { name: /Datang tepat waktu sebelum bel masuk/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/hak adalah sesuatu yang kamu terima/i);
    expect(screen.queryByRole('dialog', { name: /Kunci Ruang 2 Ditemukan/i })).not.toBeInTheDocument();

    // Correct tile on Soal 1 -> Lanjut ke Soal 2 -> Correct tile on Soal 2 unlocks Room 2
    await user.click(
      screen.getByRole('button', { name: /Mendapat penjelasan pelajaran dan bimbingan dari guru/i })
    );
    await user.click(screen.getByRole('button', { name: /Lanjut ke Soal 2/i }));
    await user.click(
      screen.getByRole('button', { name: /Ikut menjaga kebersihan kelas/i })
    );

    const unlockDialog = screen.getByRole('dialog', { name: /Kunci Ruang 2 Ditemukan/i });
    expect(unlockDialog).toBeInTheDocument();

    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(persisted.completedRooms.room1).toBe(true);
  });

  it('sorts all 6 cards in Room 2 (Hak vs Kewajiban), rejects wrong category, and unlocks Room 3', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ completedRooms: { room1: true } })
    );
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Lanjutkan Petualangan/i }));
    await user.click(screen.getByRole('button', { name: /Ruang 2/i }));
    await user.click(screen.getByRole('button', { name: /Lanjut ke Sortir Kartu/i }));

    // Empty state shown initially in both drop zones
    expect(screen.getByText(/Belum ada kartu di kotak Hak/i)).toBeInTheDocument();
    expect(screen.getByText(/Belum ada kartu di kotak Kewajiban/i)).toBeInTheDocument();

    // Try putting a Hak card into Kewajiban -> shows wrong feedback, keeps card available
    const firstCard = ROOM2_CONTENT.cards[0];
    const wrongBtn = screen.getByRole('button', {
      name: new RegExp(`Masukkan "${firstCard.text}" ke Kewajiban`, 'i'),
    });
    await user.click(wrongBtn);
    expect(screen.getByText(firstCard.feedbackWrong)).toBeInTheDocument();

    // Sort card 1 using tap-select + dropzone button (WCAG touch flow), rest via direct buttons
    const card1Btn = screen.getByRole('button', { name: firstCard.text });
    await user.click(card1Btn);
    expect(card1Btn).toHaveAttribute('aria-pressed', 'true');
    const hakZoneHeading = screen.getByRole('heading', { name: /Kotak Hak/i });
    const hakZone = hakZoneHeading.closest('[data-drop-zone="hak"]');
    await user.click(within(hakZone).getByRole('button', { name: /Letakkan Kartu Terpilih di Sini/i }));

    for (const card of ROOM2_CONTENT.cards.slice(1)) {
      const targetName = card.category === 'hak' ? 'Hak' : 'Kewajiban';
      const btn = screen.getByRole('button', {
        name: new RegExp(`Masukkan "${card.text}" ke ${targetName}`, 'i'),
      });
      await user.click(btn);
    }

    expect(screen.getByRole('dialog', { name: /Kunci Ruang 3 Ditemukan/i })).toBeInTheDocument();
  });

  it('supports Mode Guru PIN 1234, Demo Mode unlock + redirect on disable, Blooket URL update, and 2-step Reset', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Mulai Petualangan/i }));
    await user.click(screen.getByRole('button', { name: /Buka Mode Guru/i }));

    const dialog = screen.getByRole('dialog', { name: /Mode Guru Mini/i });

    // Wrong PIN shows alert
    await user.type(within(dialog).getByLabelText(/Masukkan PIN 4 Digit Guru/i), '9999');
    await user.click(within(dialog).getByRole('button', { name: /Masuk/i }));
    expect(within(dialog).getByRole('alert')).toHaveTextContent(/PIN salah/i);

    // Correct PIN 1234 unlocks controls
    const pinInput = within(dialog).getByLabelText(/Masukkan PIN 4 Digit Guru/i);
    await user.clear(pinInput);
    await user.type(pinInput, '1234');
    await user.click(within(dialog).getByRole('button', { name: /Masuk/i }));

    // Enable Demo Mode Sidang
    const demoSwitch = within(dialog).getByRole('switch');
    expect(demoSwitch).toHaveAttribute('aria-checked', 'false');
    await user.click(demoSwitch);
    expect(demoSwitch).toHaveAttribute('aria-checked', 'true');

    // Update Blooket URL
    const blooketInput = within(dialog).getByLabelText(/URL Misi Blooket/i);
    await user.clear(blooketInput);
    await user.type(blooketInput, 'https://play.blooket.com/play?id=777888');
    await user.click(within(dialog).getByRole('button', { name: /Simpan URL Blooket/i }));

    // Close modal via Escape
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /Mode Guru Mini/i })).not.toBeInTheDocument();

    // Enter Room 5 directly thanks to Demo Mode and verify updated Blooket URL on Sub-page 2
    await user.click(screen.getByRole('button', { name: /Ruang 5/i }));
    await user.click(screen.getByRole('button', { name: /Lanjut ke Misi Blooket/i }));

    const blooketLink = screen.getByRole('link', { name: /Mulai Misi Blooket/i });
    expect(blooketLink).toHaveAttribute('href', 'https://play.blooket.com/play?id=777888');
    expect(blooketLink).toHaveAttribute('target', '_blank');

    // Turn off Demo Mode from top banner while inside un-earned Room 5 -> redirects to World Map
    await user.click(screen.getByRole('button', { name: /Matikan Demo/i }));
    expect(screen.getByRole('heading', { level: 1, name: /Peta Dunia HAKIKU/i })).toBeInTheDocument();
    expect(screen.getByText(/Mode Demo Sidang dimatikan/i)).toBeInTheDocument();

    // Re-open Mode Guru, verify Reset Progres 2-step confirmation
    await user.click(screen.getByRole('button', { name: /Buka Mode Guru/i }));
    const dialog2 = screen.getByRole('dialog', { name: /Mode Guru Mini/i });
    await user.type(within(dialog2).getByLabelText(/Masukkan PIN 4 Digit Guru/i), '1234');
    await user.click(within(dialog2).getByRole('button', { name: /Masuk/i }));
    await user.click(within(dialog2).getByRole('button', { name: /^Reset Progres$/i }));
    await user.click(within(dialog2).getByRole('button', { name: /Ya, Kunci Ulang Ruang 2-5/i }));
    expect(within(dialog2).getByText(/Progres direset/i)).toBeInTheDocument();
  });

  it('completes Room 3 and Room 4 demo placeholders and opens Finale via Room 5 secret code HAKIKU', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ completedRooms: { room1: true, room2: true } })
    );
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Lanjutkan Petualangan/i }));

    // Room 3 Demo
    await user.click(screen.getByRole('button', { name: /Ruang 3/i }));
    await user.click(screen.getByRole('button', { name: /Lanjut ke Simulasi/i }));
    await user.click(screen.getByRole('button', { name: /Selesaikan Tantangan \(Demo\)/i }));
    await user.click(screen.getByRole('button', { name: /Masuk Ruang 4/i }));

    // Room 4 Demo
    await user.click(screen.getByRole('button', { name: /Lanjut ke Simulasi/i }));
    await user.click(screen.getByRole('button', { name: /Selesaikan Tantangan \(Demo\)/i }));
    await user.click(screen.getByRole('button', { name: /Masuk Ruang 5/i }));

    // Room 5 Mission & Secret Code
    await user.click(screen.getByRole('button', { name: /Lanjut ke Misi Blooket/i }));
    const codeInput = screen.getByLabelText(/Kode Rahasia Misi/i);

    // Wrong code shows alert
    await user.type(codeInput, 'SALAH');
    await user.click(screen.getByRole('button', { name: /Buka Gerbang Akhir/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/Kode rahasia belum tepat/i);

    // Valid code (lowercase with spaces) opens Finale
    await user.clear(codeInput);
    await user.type(codeInput, ' hakiku ');
    await user.click(screen.getByRole('button', { name: /Buka Gerbang Akhir/i }));

    expect(screen.getByRole('heading', { level: 1, name: /Petualangan Selesai/i })).toBeInTheDocument();
    expect(screen.getByText(/5 dari 5 ruang telah dituntaskan/i)).toBeInTheDocument();
  });

  it('toggles audio mute button and persists preference', async () => {
    const user = userEvent.setup();
    render(<App />);

    const audioBtn = screen.getByRole('button', { name: /Matikan efek suara/i });
    expect(audioBtn).toHaveAttribute('aria-pressed', 'false');

    await user.click(audioBtn);
    expect(screen.getByRole('button', { name: /Aktifkan efek suara/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );

    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(saved.audioMuted).toBe(true);
  });

  it('keeps keyboard focus inside TeacherModeModal after unlocking PIN and saving settings', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Buka Mode Guru/i }));
    const dialog = screen.getByRole('dialog', { name: /Mode Guru Mini/i });

    await user.type(within(dialog).getByLabelText(/Masukkan PIN 4 Digit Guru/i), '1234');
    await user.click(within(dialog).getByRole('button', { name: /Masuk/i }));

    // Focus must stay inside the unlocked modal panel, never drop to document.body
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).not.toBe(document.body);

    // Saving a setting must NOT steal focus back to the header trigger button
    await user.click(within(dialog).getByRole('button', { name: /Simpan URL Blooket/i }));
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('allows tap-selecting the next card in Room 2 immediately after a pointer drag', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ completedRooms: { room1: true } })
    );
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Lanjutkan Petualangan/i }));
    await user.click(screen.getByRole('button', { name: /Ruang 2/i }));
    await user.click(screen.getByRole('button', { name: /Lanjut ke Sortir Kartu/i }));

    const firstCard = ROOM2_CONTENT.cards[0];
    const secondCard = ROOM2_CONTENT.cards[1];
    const firstCardContainer = screen
      .getByRole('button', { name: firstCard.text })
      .closest('div.rounded-2xl');

    // Simulate a real pointer drag gesture (jsdom MouseEvent preserves clientX/clientY)
    const dispatchPointer = (type, x, y) => {
      const evt = new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 });
      Object.defineProperty(evt, 'pointerId', { value: 1 });
      fireEvent(firstCardContainer, evt);
    };
    dispatchPointer('pointerdown', 20, 20);
    dispatchPointer('pointermove', 65, 20);
    dispatchPointer('pointerup', 65, 20);

    // Clicking the second card immediately afterward must toggle selection on the first click
    const secondCardBtn = screen.getByRole('button', { name: secondCard.text });
    await user.click(secondCardBtn);
    expect(secondCardBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not leak a custom teacher secret code in Room 5 error alert', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedRooms: { room1: true, room2: true, room3: true, room4: true },
        teacherSettings: { secretCode: 'MERDEKA' },
      })
    );
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Lanjutkan Petualangan/i }));
    await user.click(screen.getByRole('button', { name: /Ruang 5/i }));
    await user.click(screen.getByRole('button', { name: /Lanjut ke Misi Blooket/i }));

    await user.type(screen.getByLabelText(/Kode Rahasia Misi/i), 'SALAH');
    await user.click(screen.getByRole('button', { name: /Buka Gerbang Akhir/i }));

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/Kode rahasia belum tepat/i);
    expect(alert).not.toHaveTextContent(/MERDEKA/i);
  });

  it('exposes complete ARIA tabpanel semantics and moves focus on ArrowRight in Room 5', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ teacherSettings: { demoUnlockAll: true } })
    );
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Mulai Petualangan/i }));
    await user.click(screen.getByRole('button', { name: /Ruang 5/i }));

    const tab1 = screen.getByRole('tab', { name: /1\. Kuis Pemanasan/i });
    const tab2 = screen.getByRole('tab', { name: /2\. Misi Blooket/i });
    expect(tab1).toHaveAttribute('aria-controls');
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();

    tab1.focus();
    await user.keyboard('{ArrowRight}');
    expect(tab2).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tab2);
  });
});
