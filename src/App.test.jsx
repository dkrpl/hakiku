import React from 'react';
import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { readRoomFromLocation } from './App';
import { getDefaultContent } from './data/defaultContent';

const loader = async () => ({ content: getDefaultContent(), source: 'bawaan', warnings: [], error: '' });

async function openPadlock(user) {
  for (let i = 0; i < 3; i += 1) {
    await user.click(await screen.findByRole('button', { name: /Buka gembok/ }));
  }
}

function goTo(search) {
  window.history.replaceState({}, '', `/${search}`);
}

describe('readRoomFromLocation', () => {
  it('membaca ?ruang= dan #ruang=, menolak nomor di luar 1-5', () => {
    expect(readRoomFromLocation({ search: '?ruang=3', hash: '' })).toBe(3);
    expect(readRoomFromLocation({ search: '', hash: '#ruang=5' })).toBe(5);
    expect(readRoomFromLocation({ search: '?ruang=9', hash: '' })).toBeNull();
  });
});

describe('Aplikasi HAKIKU hybrid', () => {
  beforeEach(() => window.localStorage.clear());

  it('menampilkan halaman guru dengan 5 tantangan dan kode tersembunyi', async () => {
    goTo('?guru=1');
    const user = userEvent.setup();
    render(<App loader={loader} />);
    expect(await screen.findByRole('heading', { name: 'Daftar Tantangan HAKIKU' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Buka/ })).toHaveLength(5);
    expect(screen.queryByText('274')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tampilkan kode pintu' }));
    expect(screen.getByText('274')).toBeInTheDocument();
  });

  it('Ruang 1: jawaban salah memberi petunjuk, semua benar memunculkan kode pintu', async () => {
    goTo('?ruang=1');
    const user = userEvent.setup();
    render(<App loader={loader} />);

    await user.click(await screen.findByRole('button', { name: /Datang tepat waktu/ }));
    expect(screen.getByRole('alert')).toHaveTextContent(/hak adalah sesuatu yang kamu terima/);

    await user.click(screen.getByRole('button', { name: /Mendapat penjelasan pelajaran/ }));
    await user.click(screen.getByRole('button', { name: /Lanjut ke Soal 2/ }));
    await user.click(screen.getByRole('button', { name: /Ikut menjaga kebersihan/ }));
    await user.click(screen.getByRole('button', { name: /Lanjut ke Soal 3/ }));
    await user.click(screen.getByRole('button', { name: /secara seimbang/ }));

    expect(screen.getByRole('img', { name: '2 dari 3 bintang' })).toBeInTheDocument();
    await openPadlock(user);
    expect(await screen.findByRole('heading', { name: 'Kode Pintu Ruang 1' }, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByTestId('door-code')).toHaveAccessibleName('Kode pintu 274');
  });

  it('Ruang 3: sortir kartu dengan label kotak dari data, lalu kode pintu muncul', async () => {
    goTo('?ruang=3');
    const user = userEvent.setup();
    render(<App loader={loader} />);
    await screen.findByRole('heading', { name: 'Mengenal Kewajiban' });

    // Salah kotak dulu
    await user.click(screen.getByRole('button', { name: /Masukkan "Melaksanakan piket kelas sesuai jadwal" ke Kewajiban di Rumah/ }));
    expect(screen.getByRole('alert')).toHaveTextContent(/dilakukan di sekolah/);

    const { rooms } = getDefaultContent();
    for (const card of rooms[3].cards) {
      const label = card.box === 'kiri' ? rooms[3].leftLabel : rooms[3].rightLabel;
      await user.click(screen.getByRole('button', { name: `Masukkan "${card.text}" ke ${label}` }));
    }

    await openPadlock(user);
    expect(await screen.findByRole('heading', { name: 'Kode Pintu Ruang 3' }, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByTestId('door-code')).toHaveAccessibleName('Kode pintu 539');
  });

  it('Ruang 5: setelah kuis muncul Misi Blooket, lalu kode pintu terakhir', async () => {
    goTo('?ruang=5');
    const user = userEvent.setup();
    render(<App loader={loader} />);

    await user.click(await screen.findByRole('button', { name: /mengembalikan buku tepat waktu/ }));
    const blooketLink = await screen.findByRole('link', { name: /Mulai Misi Blooket/ });
    expect(blooketLink).toHaveAttribute('href', 'https://play.blooket.com/play');
    expect(blooketLink).toHaveAttribute('target', '_blank');

    await user.click(screen.getByRole('button', { name: /Misi Blooket Selesai/ }));
    await openPadlock(user);
    const panel = await screen.findByRole('heading', { name: 'Kode Pintu Ruang 5' }, { timeout: 3000 });
    expect(panel).toBeInTheDocument();
    expect(screen.getByText(/Pintu Terakhir/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Ulangi Tantangan/ }));
    expect(within(document.body).getByText('Soal 1 dari 1')).toBeInTheDocument();
  });

  it('Mode Kelas: seluruh tombol slide bisa diketuk dan tantangan terbuka di atas Canva', async () => {
    goTo('');
    window.sessionStorage.clear();
    const user = userEvent.setup();
    render(<App loader={loader} />);

    await user.click(await screen.findByRole('button', { name: /Mulai Petualangan/ }));
    const frame = screen.getByTitle('Slide HAKIKU di Canva');
    expect(frame).toHaveAttribute('src', 'https://www.canva.com/design/DAHbv4LhBzI/C8xeXMSqxpSoeNVRyl8eNw/view?embed#1');
    expect(frame).not.toHaveAttribute('allowfullscreen');

    // Slide 1: tombol Mulai → slide 2 → Ke Peta → slide 3 (peta)
    await user.click(screen.getByRole('button', { name: 'Buka slide 2' }));
    expect(frame.getAttribute('src')).toMatch(/#2$/);
    await user.click(screen.getByRole('button', { name: 'Buka slide 3' }));
    expect(frame.getAttribute('src')).toMatch(/#3$/);

    // Ruang yang masih terkunci tidak berpindah slide
    const locked = screen.getAllByRole('button', { name: 'Buka slide 3' });
    await user.click(locked[0]);
    expect(frame.getAttribute('src')).toMatch(/#3$/);
    expect(screen.getByRole('status')).toHaveTextContent(/masih terkunci/);

    // Guru bisa pindah slide dengan panah
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(frame.getAttribute('src')).toMatch(/#6$/);

    await user.click(screen.getByRole('button', { name: 'Mulai Tantangan Ruang 1' }));
    expect(screen.getByRole('dialog', { name: 'Tantangan Ruang 1' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Mendapat penjelasan pelajaran/ }));
    await user.click(screen.getByRole('button', { name: /Lanjut ke Soal 2/ }));
    await user.click(screen.getByRole('button', { name: /Ikut menjaga kebersihan/ }));
    await user.click(screen.getByRole('button', { name: /Lanjut ke Soal 3/ }));
    await user.click(screen.getByRole('button', { name: /secara seimbang/ }));
    await openPadlock(user);
    await screen.findByRole('heading', { name: 'Kode Pintu Ruang 1' }, { timeout: 3000 });

    await user.click(screen.getByRole('button', { name: 'Kembali ke Canva Sekarang' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByTitle('Slide HAKIKU di Canva')).toBe(frame);
    expect(frame.getAttribute('src')).toMatch(/#6$/);
    expect(JSON.parse(window.sessionStorage.getItem('hakiku-hybrid:kelas-selesai'))).toEqual([1]);
  });

  it('Mode Kelas: melanjutkan dari slide terakhir bila halaman dimuat ulang', async () => {
    goTo('');
    window.sessionStorage.setItem('hakiku-hybrid:kelas-halaman', '12');
    const user = userEvent.setup();
    render(<App loader={loader} />);
    await user.click(await screen.findByRole('button', { name: /Lanjutkan \(Slide 12\)/ }));
    expect(screen.getByTitle('Slide HAKIKU di Canva').getAttribute('src')).toMatch(/#12$/);
    expect(screen.getByRole('button', { name: 'Mulai Tantangan Ruang 2' })).toBeInTheDocument();
    window.sessionStorage.clear();
  });

  it('tetap jalan dengan konten bawaan bila pemuat data gagal total', async () => {
    goTo('?ruang=2');
    render(<App loader={() => Promise.reject(new Error('rusak'))} />);
    expect(await screen.findByRole('heading', { name: 'Mengenal Hak' })).toBeInTheDocument();
  });
});

describe('computeSlideSize', () => {
  it('slide 16:9 sebesar mungkin di layar', async () => {
    const { computeSlideSize } = await import('./screens/ClassroomScreen');
    expect(computeSlideSize(1920, 1080)).toEqual({ width: 1920, height: 1080 });
    expect(computeSlideSize(1920, 1200)).toEqual({ width: 1920, height: 1080 });
    expect(computeSlideSize(1366, 700)).toEqual({ width: 1244, height: 700 });
  });
});
