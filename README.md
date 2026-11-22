# HAKIKU (Hak dan Kewajibanku) - Versi Prototype

Aplikasi web multimedia interaktif bertema *escape room* untuk pembelajaran Hak dan Kewajiban siswa SD. Dibangun sebagai prototype validasi konsep sebelum tahap pengembangan penuh.

## Fitur Utama Prototype

- **Alur Utuh Navigasi (PT-01 sampai PT-07):** Halaman Pembuka, Peta Dunia 5 ruangan bergembok otomatis (`localStorage`), Ruang 1 sampai 5, dan Halaman Akhir.
- **Ruang 1 (Mengenal Hak dan Kewajiban):** Materi ringkas, embed video YouTube sampel (dengan status muat dan tautan cadangan), serta kuis 2 soal pilihan ganda pembuka kunci Ruang 2.
- **Ruang 2 (Sortir Kartu Hak vs Kewajiban):** 6 kartu kegiatan sehari-hari yang dapat digeser (*drag-and-drop* via Pointer Events untuk mouse dan layar sentuh *smartboard*), diketuk pilih lalu ketuk kotak, atau dijalankan lewat tombol keyboard.
- **Ruang 3 & Ruang 4 (Kerangka Demo):** Kerangka tata letak materi berlabel placeholder jujur beserta tombol simulasi *Selesaikan Tantangan (Demo)* untuk menguji alur peta sampai Ruang 5.
- **Ruang 5 (Tantangan HAKIKU):** Kuis pemanasan singkat, tombol **Mulai Misi Blooket (Tab Baru)** yang alamatnya mengikuti pengaturan Mode Guru, serta gerbang **Kode Rahasia** (default `HAKIKU`).
- **Mode Guru Mini (PIN default `1234`):** Sakelar **Mode Demo Sidang** (buka semua gembok ruangan dan pratinjau Halaman Akhir), ubah URL Blooket, ubah URL Video YouTube Ruang 1, ubah Kode Rahasia, serta **Reset Progres** dengan konfirmasi 2 langkah.
- **Efek Suara & Kontrol Bisu:** Nada umpan balik benar, salah, gembok terbuka, dan kemenangan melalui Web Audio API tanpa file audio eksternal.

## Menjalankan Secara Lokal

Prasyarat: Node.js 20 atau lebih baru.

```bash
npm install
npm run dev
```

Untuk menjalankan pengujian otomatis dan membangun bundel produksi statis:

```bash
npm test
npm run build
npm run preview
```

## Deploy Statis (Vercel / Netlify / Cloudflare Pages)

- **Build command:** `npm run build`
- **Output directory:** `dist`

## Kesiapan Integrasi Google Sheets (Tahap Lanjutan)

Seluruh konten ruangan, soal kuis, kartu sortir Ruang 2, dan pengaturan awal terpusat sebagai struktur data JSON datar di `src/data/hakikuData.js`, sedangkan state sesi dan pengaturan lokal berada di `src/utils/storage.js`. Pada tahap pengembangan penuh, sumber data ini siap dihubungkan ke Google Sheets (melalui endpoint JSON Google Apps Script atau Google Sheets API) tanpa mengubah komponen antarmuka layar.
