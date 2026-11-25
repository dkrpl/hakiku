// ID Google Sheets "HAKIKU - Database".
// Ambil dari alamat Sheet: https://docs.google.com/spreadsheets/d/<ID_DI_SINI>/edit
// Bisa diisi di sini, atau lewat variabel lingkungan VITE_SHEET_ID saat deploy (Vercel/Netlify).
// Biarkan kosong untuk memakai konten bawaan saja.
export const SHEET_ID = '1I-6-iONg3dXlVP-gAzHtMQuevInrz0GSveY3lWeFbK4';

// Batas waktu menunggu Google Sheets sebelum memakai data cadangan (milidetik).
export const SHEET_TIMEOUT_MS = 7000;

// Nama tab di Google Sheets. Jangan diganti kecuali nama tab di Sheet juga diganti.
export const SHEET_TABS = {
  settings: 'Pengaturan',
  rooms: 'Ruang',
  quiz: 'Kuis',
  cards: 'Kartu',
};
