# Product Requirements Document (PRD) — Versi Prototype
## Aplikasi Web Multimedia Interaktif: HAKIKU (Hak dan Kewajibanku)

| Informasi Dokumen | Detail |
| :--- | :--- |
| **Nama Produk** | HAKIKU — Dunia Petualangan Hak dan Kewajibanku (Prototype) |
| **Versi Dokumen** | 1.0 (Prototype / MVP Demo) |
| **Target Pengguna** | Klien (Mahasiswa PGSD), Dosen Pembimbing, dan Validator Awal |
| **Platform** | Web App Statis (Browser Laptop/PC, Smartboard, & Mobile Preview) |
| **Tujuan Utama** | Validasi konsep *escape room* berbasis web dan fitur Mode Guru sebelum masuk tahap pengembangan penuh |

---

## 1. Latar Belakang & Tujuan Prototype

Prototype ini dibuat untuk memberikan gambaran nyata kepada klien dan dosen pembimbing mengenai keunggulan **Aplikasi Web Interaktif** dibandingkan presentasi statis (Canva/PPT biasa), dengan tetap mempertahankan kemudahan akses **1 link tanpa instalasi**.

**Tujuan spesifik versi Prototype:**
1. Membuktikan mekanisme **penguncian ruangan otomatis (*escape room*)** berjalan mulus di browser.
2. Menampilkan contoh interaksi ramah layar sentuh *smartboard* (termasuk aktivitas *drag-and-drop* / sortir kartu).
3. Mendemonstrasikan **Mode Guru Mini** (mengganti link Blooket dan membuka semua ruangan untuk kebutuhan presentasi/sidang).
4. Memastikan arah visual (gaya 2D buku cerita petualangan, warna ceria, ukuran font proyektor) sesuai selera klien sebelum produksi seluruh aset.

---

## 2. Ruang Lingkup (Scope)

### 2.1 Termasuk dalam Prototype (*In-Scope*)
* **Alur Utuh Navigasi:** Halaman Pembuka $\rightarrow$ Peta Dunia HAKIKU $\rightarrow$ Ruangan $\rightarrow$ Halaman Akhir.
* **Sistem Gembok Progres:** Ruang 1 terbuka di awal; Ruang 2–5 berstatus tergembok dan terbuka berurutan setelah tantangan selesai (disimpan sementara di `localStorage`).
* **Konten Sampel Fungsional Penuh:**
  * **Ruang 1 (Mengenal Hak dan Kewajiban):** Teks pengantar ringkas, 1 embed video YouTube sampel, dan 1–2 soal pilihan ganda pembuka kunci Ruang 2.
  * **Ruang 2 (Mengenal Hak):** 1 mekanik interaksi unggulan berupa **pilah kartu (*drag-and-drop* / klik kategori)** untuk membedakan contoh Hak vs Bukan Hak.
  * **Ruang 5 (Tantangan HAKIKU):** 1 sampel kuis singkat + tombol **Mulai Misi Blooket** (mengarah ke URL eksternal di tab baru) + opsional gerbang kode rahasia sederhana.
* **Ruang 3 & Ruang 4 (*Placeholder* Interaktif):** Menampilkan kerangka tata letak materi dan tombol simulasi *"Selesaikan Tantangan (Demo)"* agar alur peta tetap bisa diuji sampai Ruang 5.
* **Mode Guru Mini (PIN default, misal `1234`):**
  * Ubah URL Misi Blooket (tersimpan di `localStorage` perangkat lokal).
  * Sakelar **Mode Demo Sidang** (membuka semua gembok ruangan secara instan).
  * Tombol **Reset Progres** (mengunci kembali Ruang 2–5).
* **Umpan Balik Dasar:** Efek suara sederhana (benar, salah, gembok terbuka) dan tombol *mute/unmute*.

### 2.2 Tidak Termasuk dalam Prototype (*Out-of-Scope*)
* Sinkronisasi database cloud (Firebase Firestore / Google Sheets) lintas perangkat.
* Ilustrasi 2D final untuk seluruh skenario rumah, sekolah, dan masyarakat (cukup gunakan aset *placeholder* bergaya konsisten/SVG ilustratif untuk memperlihatkan *look & feel*).
* Seluruh bank soal final Ruang 1–5 dari naskah materi klien.
* Mode *offline* penuh (PWA *service worker*) dan dokumen panduan cetak guru.

---

## 3. Alur Pengguna (*User Flow*) Prototype

```text
[Halaman 1: Pembuka HAKIKU]
       │ (Klik "Mulai")
       ▼
[Halaman 2: Petunjuk & Peta Dunia HAKIKU] ◄───────┐
  ├── Ikon Gear (Pojok) ──► [Modal PIN Mode Guru] │
  ├── Ruang 1 (Terbuka)                           │
  ├── Ruang 2 (Tergembok → Terbuka setelah R1)    │
  ├── Ruang 3 (Tergembok → Placeholder Demo)      │
  ├── Ruang 4 (Tergembok → Placeholder Demo)      │
  └── Ruang 5 (Tergembok → Kuis + Link Blooket)   │
       │                                          │
       ▼                                          │
[Masuk Ruangan Terpilih]                          │
  ├── Pelajari Materi / Video                     │
  ├── Kerjakan Tantangan Pembuka Kunci            │
  │    ├── Salah ──► Notifikasi "Coba Lagi"       │
  │    └── Benar ──► Animasi "Kunci Ditemukan!" ──┘ (Update status Peta)
  └── (Khusus Ruang 5 selesai) ──► [Halaman Akhir: Petualangan Selesai]
```

---

## 4. Spesifikasi Fungsional Prototype

| Kode | Fitur | Deskripsi Fungsional |
| :--- | :--- | :--- |
| **PT-01** | **Halaman Pembuka** | Menampilkan judul **HAKIKU**, ilustrasi tema petualangan, tombol **Mulai** berukuran besar, dan kontrol suara. |
| **PT-02** | **Peta Dunia & Gembok** | Menampilkan 5 node ruangan. Ruangan terkunci menampilkan ikon gembok; jika diklik muncul pesan petunjuk agar menyelesaikan ruangan sebelumnya terlebih dahulu. |
| **PT-03** | **Ruang 1 (Materi + Kuis)** | Menampilkan kartu materi singkat, video YouTube tersemat, dan kuis pilihan ganda. Jawaban benar memicu status `room1_completed = true` dan membuka Ruang 2. |
| **PT-04** | **Ruang 2 (Sortir Kartu)** | Minimal 4 kartu ilustrasi/teks yang dapat digeser (*drag-and-drop*) atau diketuk ke kotak **Hak** / **Kewajiban** (mendukung mouse dan sentuhan layar). |
| **PT-05** | **Ruang 5 (Misi Blooket)** | Menyediakan instruksi misi, tombol **Mulai Misi Blooket** (`target="_blank"`), serta input **Kode Rahasia** sederhana (contoh default: `HAKIKU`) untuk membuka halaman akhir. |
| **PT-06** | **Mode Guru Mini** | Tersembunyi di balik tombol ikon pengaturan + verifikasi PIN 4 digit. Memuat fitur: toggle *Buka Semua Ruangan*, tombol *Reset Progres*, dan input ganti *Link Blooket* lokal. |
| **PT-07** | **Navigasi Konsisten** | Tersedia tombol navigasi tetap: **Beranda (Peta)**, **Kembali**, dan **Lanjut** (khusus antarsub-halaman di dalam satu ruangan). |

---

## 5. Spesifikasi Teknis & Visual Prototype

* **Stack Rekomendasi:** Single-Page Application (HTML5, Tailwind CSS, Vanilla JavaScript atau Vue 3/React).
* **Penyimpanan Data:** File konfigurasi lokal (`dummyData.js` / `data.json`) + `localStorage` untuk menyimpan progres dan pengaturan Mode Guru selama sesi demo.
* **Rasio & Responsivitas:** Dioptimalkan untuk layar lanskap **16:9** (laptop & *smartboard* resolusi 1366×768 hingga 1920×1080), namun tetap rapi saat dibuka di layar HP klien.
* **Palet Warna Awal:** Dominan hijau segar, biru cerah, kuning hangat, dengan warna teks gelap berkontras tinggi.
* **Deployment Demo:** Dideploy ke URL publik gratis (Vercel / Netlify / Cloudflare Pages) agar klien cukup mengklik 1 tautan untuk mencoba.

---

## 6. Kriteria Keberhasilan (*Acceptance Criteria*)

Prototype dinyatakan siap dipresentasikan ke klien apabila:
1. Link publik dapat dibuka tanpa error di Chrome/Edge (laptop) dan browser HP.
2. Pengguna tidak dapat melompat langsung ke Ruang 2–5 dari Peta sebelum menyelesaikan ruang sebelumnya (kecuali *Mode Demo Sidang* diaktifkan).
3. Aktivitas *drag-and-drop* di Ruang 2 bekerja lancar menggunakan mouse maupun sentuhan layar.
4. Penggantian link Blooket melalui Mode Guru langsung mengubah tujuan tombol **Mulai Misi** di Ruang 5.
5. Klien dapat memberikan persetujuan (*sign-off*) terhadap alur, gaya visual, dan ruang lingkup sebelum lanjut ke tahap pengembangan penuh.