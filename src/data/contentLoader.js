import { SHEET_ID, SHEET_TABS, SHEET_TIMEOUT_MS } from '../config';
import { csvToObjects } from './csv';
import { ROOM_NUMBERS, getDefaultContent } from './defaultContent';

const CACHE_KEY = 'hakiku-hybrid:sheet-cache:v1';
const OPTION_KEYS = ['a', 'b', 'c', 'd'];

export function resolveSheetId() {
  if (typeof window !== 'undefined') {
    const fromUrl = new URLSearchParams(window.location.search).get('sheet');
    if (fromUrl) return fromUrl.trim();
  }
  const fromEnv = import.meta.env?.VITE_SHEET_ID;
  return String(fromEnv || SHEET_ID || '').trim();
}

export function buildSheetCsvUrl(sheetId, tabName) {
  return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(
    sheetId
  )}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tabName)}`;
}

function isYes(value) {
  return ['ya', 'iya', 'y', 'yes', 'true', '1'].includes(String(value ?? '').trim().toLowerCase());
}

function roomNumberOf(row) {
  const n = Number.parseInt(String(row.ruang ?? '').replace(/[^0-9]/g, ''), 10);
  return ROOM_NUMBERS.includes(n) ? n : null;
}

function cleanCode(value) {
  // Angka dari Sheets kadang terbaca "274.0"; buang bagian desimalnya.
  return String(value ?? '')
    .trim()
    .replace(/\.0+$/, '')
    .toUpperCase();
}

function normalizeQuestion(row, index, roomNumber, warnings) {
  const options = OPTION_KEYS.map((key) => ({ id: key, label: String(row[`pilihan_${key}`] ?? '').trim() })).filter(
    (opt) => opt.label !== ''
  );
  const answer = String(row.jawaban ?? '').trim().toLowerCase();
  const prompt = String(row.pertanyaan ?? '').trim();

  if (!prompt) {
    warnings.push(`Kuis Ruang ${roomNumber}: ada baris tanpa pertanyaan, dilewati.`);
    return null;
  }
  if (options.length < 2) {
    warnings.push(`Kuis Ruang ${roomNumber}: "${prompt}" butuh minimal 2 pilihan, dilewati.`);
    return null;
  }
  if (!options.some((opt) => opt.id === answer)) {
    warnings.push(`Kuis Ruang ${roomNumber}: jawaban "${row.jawaban}" untuk "${prompt}" tidak cocok dengan pilihan, dilewati.`);
    return null;
  }

  return {
    id: `r${roomNumber}-s${index + 1}`,
    prompt,
    options,
    answer,
    wrongHint: row.petunjuk_salah || 'Belum tepat. Baca lagi soalnya dengan teliti, lalu coba lagi!',
    correctHint: row.penjelasan_benar || 'Jawabanmu benar!',
  };
}

function normalizeCard(row, index, room, warnings) {
  const text = String(row.teks ?? '').trim();
  const rawBox = String(row.kotak ?? '').trim().toLowerCase();
  let box = null;
  if (rawBox === 'kiri' || rawBox === room.leftLabel.toLowerCase()) box = 'kiri';
  else if (rawBox === 'kanan' || rawBox === room.rightLabel.toLowerCase()) box = 'kanan';

  if (!text) {
    warnings.push(`Kartu Ruang ${room.number}: ada baris tanpa teks, dilewati.`);
    return null;
  }
  if (!box) {
    warnings.push(
      `Kartu Ruang ${room.number}: "${text}" kolom kotak harus "kiri"/"kanan" atau "${room.leftLabel}"/"${room.rightLabel}", dilewati.`
    );
    return null;
  }

  return {
    id: `r${room.number}-k${index + 1}`,
    text,
    box,
    image: String(row.gambar ?? '').trim(),
    feedbackCorrect: row.umpan_balik_benar || 'Tepat!',
    feedbackWrong: row.umpan_balik_salah || 'Belum tepat, coba kotak yang lain.',
  };
}

// Menggabungkan isi Google Sheets dengan konten bawaan.
// Bagian yang kosong atau salah isi di Sheet otomatis memakai konten bawaan.
export function buildContentFromSheets(tabs) {
  const content = getDefaultContent();
  const warnings = [];

  (tabs.settings || []).forEach((row) => {
    const key = String(row.kunci ?? '').trim().toLowerCase();
    const value = String(row.nilai ?? '').trim();
    if (key === 'link_blooket' && value) content.settings.blooketUrl = value;
    if (key === 'link_canva' && /^https?:\/\//i.test(value)) content.settings.canvaUrl = value;
    if (key === 'pin_guru' && value !== '') {
      if (/^\d{4,8}$/.test(value)) content.settings.teacherPin = value;
      else warnings.push(`Pengaturan "pin_guru" harus 4-8 angka (tertulis "${value}"). Dipakai PIN bawaan.`);
    }
    if (key === 'detik_kembali' && value !== '') {
      const secs = Number.parseInt(value, 10);
      if (Number.isFinite(secs) && secs >= 0 && secs <= 120) content.settings.returnSeconds = secs;
      else warnings.push(`Pengaturan "detik_kembali" harus angka 0-120 (tertulis "${value}"). Dipakai 15 detik.`);
    }
  });

  (tabs.rooms || []).forEach((row) => {
    const n = roomNumberOf(row);
    if (!n) return;
    const room = content.rooms[n];
    if (row.judul) room.title = row.judul;
    const type = String(row.jenis ?? '').trim().toLowerCase();
    if (type === 'kuis' || type === 'sortir') room.type = type;
    else if (type) warnings.push(`Ruang ${n}: jenis "${row.jenis}" tidak dikenal (pakai "kuis" atau "sortir").`);
    if (row.petunjuk) room.instruction = row.petunjuk;
    if (row.kode_pintu) room.doorCode = cleanCode(row.kode_pintu);
    const back = String(row.link_kembali ?? '').trim();
    if (back) {
      if (/^https?:\/\//i.test(back)) room.canvaReturnUrl = back;
      else warnings.push(`Ruang ${n}: link_kembali harus diawali https:// (tertulis "${back}"). Dipakai link bawaan.`);
    }
    if (row.kotak_kiri) room.leftLabel = row.kotak_kiri;
    if (row.kotak_kanan) room.rightLabel = row.kotak_kanan;
    if (row.tombol_blooket !== undefined && row.tombol_blooket !== '') room.showBlooket = isYes(row.tombol_blooket);
  });

  ROOM_NUMBERS.forEach((n) => {
    const room = content.rooms[n];

    const quizRows = (tabs.quiz || []).filter((row) => roomNumberOf(row) === n);
    if (quizRows.length > 0) {
      const questions = quizRows.map((row, i) => normalizeQuestion(row, i, n, warnings)).filter(Boolean);
      if (questions.length > 0) room.questions = questions;
    }

    const cardRows = (tabs.cards || []).filter((row) => roomNumberOf(row) === n);
    if (cardRows.length > 0) {
      const cards = cardRows.map((row, i) => normalizeCard(row, i, room, warnings)).filter(Boolean);
      if (cards.length > 0) room.cards = cards;
    }

    // Pengaman: jenis tantangan harus punya isi. Kalau tidak, kembali ke bawaan.
    if (room.type === 'kuis' && room.questions.length === 0) {
      warnings.push(`Ruang ${n}: jenis kuis tetapi belum ada soal yang valid, memakai soal bawaan.`);
      room.questions = getDefaultContent().rooms[n].questions;
      if (room.questions.length === 0) room.type = 'sortir';
    }
    if (room.type === 'sortir') {
      const hasBoth = room.cards.some((c) => c.box === 'kiri') && room.cards.some((c) => c.box === 'kanan');
      if (!hasBoth) {
        warnings.push(`Ruang ${n}: kartu sortir harus ada di kotak kiri dan kanan, memakai kartu bawaan.`);
        const fallback = getDefaultContent().rooms[n];
        if (fallback.cards.length > 0) {
          room.cards = fallback.cards;
          room.leftLabel = fallback.leftLabel;
          room.rightLabel = fallback.rightLabel;
        } else {
          room.type = 'kuis';
        }
      }
    }
    if (!room.doorCode) room.doorCode = getDefaultContent().rooms[n].doorCode;
  });

  return { content, warnings };
}

async function fetchTab(sheetId, tabName, fetchImpl, signal) {
  const res = await fetchImpl(buildSheetCsvUrl(sheetId, tabName), { signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`Tab "${tabName}" gagal dimuat (status ${res.status}).`);
  const text = await res.text();
  if (/^\s*</.test(text)) {
    throw new Error('Google Sheets belum dibagikan sebagai "Siapa saja yang memiliki link".');
  }
  return csvToObjects(text);
}

function readCache() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(tabs) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: new Date().toISOString(), tabs }));
  } catch {
    // Penyimpanan penuh atau diblokir: abaikan, cadangan bawaan tetap tersedia.
  }
}

/**
 * Memuat konten HAKIKU.
 * Hasil: { content, source: 'sheets' | 'cache' | 'bawaan', warnings, error }
 */
export async function loadContent({ fetchImpl = globalThis.fetch, sheetId = resolveSheetId() } = {}) {
  if (!sheetId || typeof fetchImpl !== 'function') {
    return { content: getDefaultContent(), source: 'bawaan', warnings: [], error: '' };
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), SHEET_TIMEOUT_MS) : null;

  try {
    const [settings, rooms, quiz, cards] = await Promise.all([
      fetchTab(sheetId, SHEET_TABS.settings, fetchImpl, controller?.signal),
      fetchTab(sheetId, SHEET_TABS.rooms, fetchImpl, controller?.signal),
      fetchTab(sheetId, SHEET_TABS.quiz, fetchImpl, controller?.signal),
      fetchTab(sheetId, SHEET_TABS.cards, fetchImpl, controller?.signal),
    ]);
    const tabs = { settings, rooms, quiz, cards };
    writeCache(tabs);
    const { content, warnings } = buildContentFromSheets(tabs);
    return { content, source: 'sheets', warnings, error: '' };
  } catch (err) {
    const message =
      err?.name === 'AbortError'
        ? 'Google Sheets terlalu lama merespons.'
        : err?.message || 'Google Sheets tidak dapat dihubungi.';
    const cached = readCache();
    if (cached?.tabs) {
      const { content, warnings } = buildContentFromSheets(cached.tabs);
      return { content, source: 'cache', warnings, error: message, savedAt: cached.savedAt };
    }
    return { content: getDefaultContent(), source: 'bawaan', warnings: [], error: message };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// Membuat link kembali ke Canva yang langsung membuka slide pintu ruangan.
// Canva membaca parameter ?ui= berisi id halaman (JSON base64url).
export function buildCanvaReturnUrl(settings, room) {
  if (room?.canvaReturnUrl) return room.canvaReturnUrl;
  const base = String(settings?.canvaUrl ?? '').trim();
  if (!base) return '';
  if (!room?.canvaDoorPageId || /[?&]ui=/.test(base)) return base;
  const json = JSON.stringify({ D: { T: { A: room.canvaDoorPageId } } });
  const b64 = btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const url = new URL(base);
  url.searchParams.set('ui', b64);
  return url.toString();
}

/**
 * Link Canva untuk ditampilkan DI DALAM web (Mode Kelas).
 * Mengubah link "lihat" Canva (…/view atau …/edit) menjadi …/view?embed.
 * Hasil kosong bila link Canva tidak diisi atau bukan link desain Canva.
 */
export function buildCanvaEmbedUrl(settings) {
  const base = String(settings?.canvaUrl ?? '').trim();
  if (!base) return '';
  let url;
  try {
    url = new URL(base);
  } catch {
    return '';
  }
  if (!/(^|\.)canva\.com$/i.test(url.hostname)) return '';
  const match = url.pathname.match(/^\/design\/([^/]+)\/([^/]+)/);
  if (!match) return '';
  url.pathname = `/design/${match[1]}/${match[2]}/view`;
  url.search = '?embed';
  url.hash = '';
  return url.toString();
}
