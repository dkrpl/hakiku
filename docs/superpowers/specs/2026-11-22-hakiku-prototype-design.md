# Dokumen Desain: Prototype Aplikasi Web HAKIKU (Hak dan Kewajibanku)

Tanggal: 2026-11-22
Sumber PRD: `prd_prototype_aplikasi_web_hakiku.md`
Status: Menunggu persetujuan sebelum penyusunan rencana implementasi

## 1. Tujuan dan Konteks

HAKIKU adalah prototype aplikasi web multimedia interaktif bertema *escape room* pendidikan untuk materi Hak dan Kewajiban siswa SD. Prototype ini dibangun untuk divalidasi oleh klien (mahasiswa PGSD), dosen pembimbing, dan validator awal melalui satu tautan web statis tanpa instalasi.

Fokus pembuktian prototype:
1. Mekanisme penguncian ruangan berurutan (*escape room*) yang tersimpan di `localStorage`.
2. Interaksi ramah layar sentuh *smartboard* dan perangkat seluler, khususnya sortir kartu di Ruang 2.
3. Mode Guru Mini terproteksi PIN untuk keperluan mengajar dan demonstrasi sidang (ganti tautan Blooket, buka semua ruangan instan, dan reset progres).
4. Arah visual 2D buku cerita petualangan (*storybook adventure*) dengan keterbacaan proyektor 16:9 yang tetap rapi di layar ponsel.

### Non-Goals dan Anti-Goals
- **Non-goals:** sinkronisasi database cloud lintas perangkat (Firebase/Sheets), seluruh bank soal final Ruang 1 sampai 5, mode offline penuh (PWA service worker), dan dokumen panduan cetak guru.
- **Anti-goals:** tampilan generik template SaaS, kartu yang melompat atau terpotong di layar ponsel, interaksi *drag-and-drop* yang hanya bekerja dengan mouse dan macet di layar sentuh atau keyboard, serta tombol dekoratif yang tidak berfungsi.

## 2. Pendekatan Teknis (Approaches)

Dua pendekatan yang dipertimbangkan:
1. **Vite + React + Tailwind CSS (Dipilih)**
   - Memisahkan setiap layar, komponen navigasi, modal Mode Guru, utilitas suara Web Audio API, dan ilustrasi SVG ke modul terpisah, dengan konten terpusat pada satu file konfigurasi lokal (`src/data/hakikuData.js`).
   - *Trade-off:* membutuhkan langkah `npm run build` sebelum deploy, tetapi didukung langsung oleh Vercel, Netlify, dan Cloudflare Pages serta siap dilanjutkan ke tahap pengembangan penuh tanpa bongkar ulang.
2. **HTML5 + CSS + Vanilla JavaScript tanpa build step (Tidak dipilih)**
   - Dapat langsung diunggah statis tanpa Node.js, tetapi manajemen state 5 ruangan, sub-halaman, focus trap modal aksesibel, dan *drag-and-drop* lintas perangkat lebih rentan sulit dipelihara saat diperluas ke versi produksi.

Alasan pilihan: Pengguna memilih Opsi 1 (Vite + React + Tailwind CSS) agar struktur komponen, pengujian, dan perluasan materi klien ke tahap produksi lebih terawat.

## 3. Arah Visual dan Sistem Desain (Antislop Design Read)

**Design Read:** Reading this as an interactive educational escape-room prototype for Indonesian PGSD students, thesis advisors, and elementary smartboard classrooms, in a 2D storybook adventure map style, dial **ENERGY 2 / RHYTHM 2 / MOTION 2**.

### 3.1 Palet Warna Terverifikasi WCAG AA
Tema tetap siang hari bergaya kertas buku cerita (tanpa mode gelap) karena aplikasi dirancang untuk proyektor kelas terang dan *smartboard* sekolah dasar sesuai PRD.

| Peran | Nama & Kode Hex | Penggunaan & Bukti Kontras |
| :--- | :--- | :--- |
| Kanvas utama | Parchment Cream `#FBF8F1` | Latar belakang utama yang hangat dan tidak menyilaukan proyektor |
| Permukaan kartu | Storybook White `#FFFFFF` | Panel materi, soal kuis, kartu sortir, dan dialog modal |
| Teks utama | Forest Ink `#14261C` | Judul dan isi teks (14.96:1 pada `#FBF8F1`) |
| Teks sekunder | Moss Ink `#3D5245` | Subjudul, petunjuk, label form (7.95:1 pada `#FBF8F1`, 8.43:1 pada `#FFFFFF`) |
| Garis tinta | Storybook Ink Border `#6F634F` | Garis tepi kartu, input, dan batas non-teks (5.54:1 pada `#FBF8F1`) |
| Permukaan terkunci | Locked Stone `#E8E4DA` | Node ruangan terkunci dengan teks `#4A554E` (6.12:1) |
| Warna inti 1 (Hijau) | Deep Meadow `#186A42` / Tint `#E6F4EC` / Foliage `#2E9E5B` | Progres selesai, nuansa alam peta, kotak Kewajiban. Putih pada `#186A42` = 6.61:1; `#145334` pada `#E6F4EC` = 7.99:1 |
| Warna inti 2 (Biru) | Sky Cobalt `#155E95` / Tint `#E6F2FA` / Sky `#3698D8` | Kotak Hak, aksi navigasi sekunder, ring fokus keyboard (`#155E95` pada `#FBF8F1` = 6.46:1; putih pada `#155E95` = 6.85:1) |
| Aksen tunggal (Kuning) | Storybook Gold `#F2B705` (hover `#DC9F00`) / Wash `#FEF5D6` / Label `#7A4D00` | Tombol aksi utama dan simbol Kunci Emas. `#14261C` pada `#F2B705` = 8.73:1; `#7A4D00` pada `#FBF8F1` = 6.85:1 |
| Semantik kesalahan | Crimson `#B91C1C` / Wash `#FEE2E2` / Teks `#991B1B` | Hanya untuk jawaban salah, validasi form, dan konfirmasi reset (6.47:1 hingga 6.80:1) |

### 3.2 Tipografi
- **Heading / Display:** `Baloo 2` (fallback `'Trebuchet MS', system-ui, sans-serif`) karena lekukan hurufnya ramah anak SD dan mudah terbaca dari jarak proyektor kelas.
- **Body / Kontrol UI:** `Nunito` (fallback `'Segoe UI', system-ui, sans-serif`) karena bentuk huruf yang terbuka dan jelas untuk pembaca muda.
- **Skala fluid (`clamp()`):**
  - Judul utama layar: `clamp(1.75rem, 3.2vw, 2.75rem)`
  - Subjudul / nama ruang: `clamp(1.25rem, 2.1vw, 1.75rem)`
  - Teks materi & soal: `clamp(1rem, 1.25vw, 1.2rem)` dengan tinggi baris `1.6`

### 3.3 Motif Identitas, Radius, Elevasi, dan Gerak
- **Motif Identitas (Storybook Ink & Pressable Edge):** panel utama dan tombol interaktif menggunakan garis tepi 2px (`#14261C` atau `#6F634F`) dengan bayangan padat tanpa blur (`0 4px 0 #14261C` atau `0 3px 0 #6F634F`). Saat ditekan (`:active`), tombol turun `2px` agar terasa seperti papan permainan fisik di *smartboard*.
- **Hirarki Radius:** modal & panel besar `20px`, kartu interaktif & node peta `14px`, tombol & input `12px`, penanda status fungsional `8px` (bukan kapsul seragam).
- **Gerak (MOTION 2):** transisi layar ringan, pengangkatan kartu saat diseret, dan animasi kunci emas satu kali saat ruang terbuka (berhenti di bawah 1,2 detik, tanpa animasi berulang tanpa henti). Seluruh gerak non-esensial dimatikan saat `prefers-reduced-motion: reduce`.
- **Aset Visual Kustom (disetujui pengguna):**
  - `public/assets/hero-hakiku.svg`: ilustrasi peta petualangan 2D buku cerita yang dirender sebagai `<img width="640" height="440" fetchPriority="high">` di Halaman Pembuka.
  - Komponen SVG kustom 2D bergaya tinta buku cerita untuk logo lencana HAKIKU, 5 pos pulau/bangunan di Peta Dunia, 6 ilustrasi skenario kartu di Ruang 2, kunci emas, gembok, piala halaman akhir, serta ikon kontrol UI bergaris tebal konsisten (`strokeWidth="2.25"`). Tidak ada emoji dekoratif pada teks UI.

## 4. Arsitektur Layar dan Alur Pengguna

### 4.1 Kerangka Navigasi Konsisten (PT-07)
- **Header Atas Kompak** (muncul di semua layar; tinggi ringkas agar tidak menyita layar ponsel):
  - Kiri: Logo teks + lencana **HAKIKU** (tombol kembali ke Halaman Pembuka) dan tombol **Peta Dunia** (saat berada di dalam ruangan atau halaman akhir).
  - Tengah/Kanan: Penanda progres nyata (`X/5 Kunci`), tombol **Suara** (aktif/bisu dengan `aria-pressed`), dan tombol **Mode Guru** (ikon gear + label).
  - Jika Mode Demo Sidang aktif, muncul pita status ringkas di bawah header: `Mode Demo Sidang Aktif: Semua ruangan terbuka untuk presentasi.` disertai tombol cepat matikan/kelola.
- **Bar Navigasi Bawah Ruangan** (khusus saat berada di dalam Ruang 1 sampai 5):
  - Kiri: tombol **Beranda (Peta)** untuk kembali ke Peta Dunia.
  - Tengah/Kanan: tombol **Kembali** (pindah ke sub-halaman sebelumnya di dalam ruangan, atau kembali ke Peta jika sedang di sub-halaman 1) dan slot kanan kontekstual:
    - Pada Sub-halaman 1: tombol **Lanjut** untuk masuk ke Sub-halaman 2 di dalam ruangan yang sama (sesuai PT-07).
    - Pada Sub-halaman 2 (sub-halaman terakhir): jika ruangan sudah selesai (atau Mode Demo Sidang aktif), tampil tombol **Lanjut ke Ruang [N+1]** (atau **Buka Halaman Akhir** di Ruang 5); jika belum selesai, slot kanan menampilkan petunjuk teks tenang (`Selesaikan tantangan di atas untuk membuka kunci ruang berikutnya`) sehingga tidak ada tombol mati yang membingungkan.
  - Diberi ruang aman bawah (`padding-bottom`) agar bar tidak pernah menutupi konten terakhir di layar ponsel.

### 4.2 Rincian Setiap Layar

#### A. Halaman Pembuka (PT-01)
- Tata letak 2 kolom di lanskap (teks + CTA di kiri, ilustrasi buku cerita di kanan), menumpuk 1 kolom di ponsel (ilustrasi ringkas di atas, judul dan tombol aksi langsung terlihat).
- Menampilkan judul **HAKIKU**, subjudul "Dunia Petualangan Hak dan Kewajibanku", ringkasan singkat tujuan permainan (2 kalimat), tombol utama besar **Mulai Petualangan** (atau **Lanjutkan Petualangan** jika sudah ada progres tersimpan di `localStorage`), dan catatan jujur `Prototype Demo v1.0`.

#### B. Peta Dunia HAKIKU (PT-02)
- Petunjuk singkat di bagian atas: selesaikan ruangan secara berurutan untuk mengumpulkan 5 kunci.
- 5 node ruangan pada jalur petualangan:
  1. **Ruang 1:** Mengenal Hak dan Kewajiban (terbuka sejak awal)
  2. **Ruang 2:** Mengenal Hak (terbuka setelah Ruang 1 selesai)
  3. **Ruang 3:** Mengenal Kewajiban [Kerangka Demo] (terbuka setelah Ruang 2 selesai)
  4. **Ruang 4:** Hak & Kewajiban di Lingkungan [Kerangka Demo] (terbuka setelah Ruang 3 selesai)
  5. **Ruang 5:** Tantangan HAKIKU (terbuka setelah Ruang 4 selesai)
- **Responsif 3 tingkat (bukan 2 tingkat):**
  - Ponsel (`< 640px`): jalur vertikal 1 kolom dengan garis penghubung berurutan.
  - Tablet (`640px - 1023px`): grid 2 kolom bernomor urut jelas.
  - Laptop / Smartboard 16:9 (`>= 1024px`): peta berliku 2D dengan jalur SVG yang menghubungkan 5 pos (baris atas 3 pos, baris bawah 2 pos + gerbang akhir).
- **Aturan Penguncian dan Mode Demo Sidang:**
  - Dalam mode normal (`demoUnlockAll = false`), Ruang 1 selalu terbuka; Ruang `N` (`N = 2..5`) terbuka hanya jika seluruh ruang sebelumnya (`1..N-1`) berstatus selesai (rantai berurutan ketat).
  - Node terkunci tetap bisa ditekan (`<button aria-disabled="true">` agar tetap dapat difokuskan keyboard dan memberi umpan balik jelas).
  - Saat node terkunci ditekan (ketika Mode Demo Sidang nonaktif): memainkan efek suara terkunci dan menampilkan pesan petunjuk langsung di `aria-live="polite"` banner: `"Ruang [N] masih terkunci. Selesaikan Ruang [N-1] terlebih dahulu untuk membuka gemboknya."`
  - Saat Mode Demo Sidang aktif (`demoUnlockAll = true`), seluruh Ruang 1 sampai 5 terbuka di peta sekaligus muncul tombol **Lihat Halaman Akhir (Demo)** agar dosen dapat meninjau layar penutup secara langsung.
  - Penyelesaian ruangan saat Mode Demo Sidang tetap tercatat di `completedRooms` agar animasi kunci dan indikator progres bisa didemonstrasikan utuh; jika Mode Demo Sidang dimatikan, aturan penguncian berurutan langsung berlaku kembali. Bila pengguna sedang berada di ruangan yang belum terbuka secara berurutan ketika Mode Demo Sidang dimatikan, aplikasi otomatis mengarahkan kembali ke Peta Dunia dengan pesan status yang jelas.
  - Jika Ruang 5 sudah selesai, muncul tombol **Lihat Halaman Akhir** di area peta.

#### C. Ruang 1: Mengenal Hak dan Kewajiban (PT-03)
Memiliki 2 sub-halaman dengan indikator langkah di atas dan tombol **Kembali / Lanjut** di bawah:
- **Sub-halaman 1 (Materi & Video):**
  - 2 kartu materi ringkas berkontras tinggi: pengertian **Hak** dan **Kewajiban** beserta 1 contoh nyata di kehidupan siswa SD.
  - Pemutar **Video YouTube Sampel** dengan kontainer ber-`aspect-video` (ruang terpesan sejak awal per R-40):
    - *Loading state:* pesan `"Memuat video pembelajaran YouTube..."` sampai event `onLoad` selesai.
    - *Error / Fallback state:* jika tautan tidak valid atau gagal dimuat, menampilkan penjelasan penyebab serta tombol **Buka Video di Tab Baru** dan **Muat Ulang Video**.
    - URL YouTube default berasal dari `hakikuData.js` (video edukasi publik yang dapat di-embed) dan bisa diganti melalui Mode Guru.
- **Sub-halaman 2 (Kuis Pembuka Kunci Ruang 2):**
  - 2 soal pilihan ganda tentang pengertian dan contoh hak serta kewajiban.
  - Siswa memilih opsi (radio button bergaya kartu besar ramah sentuh, min tinggi 52px) lalu menekan **Periksa Jawaban**.
  - Jawaban salah: suara salah + pesan umpan balik per soal (ikon + teks, bukan warna saja) dan siswa dapat langsung memilih ulang.
  - Semua jawaban benar: menyimpan `completedRooms.room1 = true`, memutar suara kunci terbuka, dan menampilkan modal perayaan **Kunci Ruang 2 Ditemukan!** dengan tombol **Lanjut ke Ruang 2** dan **Kembali ke Peta Dunia**.

#### D. Ruang 2: Mengenal Hak, Sortir Kartu Hak vs Kewajiban (PT-04)
Memiliki 2 sub-halaman:
- **Sub-halaman 1 (Pengantar):** penjelasan singkat perbedaan contoh Hak dan Kewajiban plus petunjuk cara memilah kartu (geser atau ketuk).
- **Sub-halaman 2 (Papan Sortir Kartu):**
  - **6 kartu skenario** (3 Hak, 3 Kewajiban), masing-masing berisi ilustrasi 2D sederhana + kalimat singkat yang mudah dibaca:
    - Hak: *Mendapat pelajaran dari guru di kelas*, *Mendapat kasih sayang orang tua di rumah*, *Bermain bersama teman saat jam istirahat*.
    - Kewajiban: *Melaksanakan piket membersihkan kelas*, *Merapikan kamar dan mainan sendiri*, *Membuang sampah pada tempat sampah*.
  - **Tiga jalur interaksi penuh:**
    1. *Drag-and-drop* berbasis Pointer Events (`onPointerDown`, `onPointerMove`, `onPointerUp`, `touch-action: none` pada gagang/kartu yang diseret) agar berjalan mulus di mouse, *smartboard*, dan layar HP.
    2. *Ketuk untuk memilih, lalu ketuk kotak* (klik kartu sehingga berstatus terpilih dengan bingkai sorot + label "Dipilih", lalu klik kotak **Hak** atau kotak **Kewajiban**).
    3. *Aksi keyboard / tombol cepat* pada kartu aktif (`Masukkan ke Hak`, `Masukkan ke Kewajiban`) sehingga pengguna keyboard tidak terhambat (WCAG 2.5.7).
  - **Umpan balik & UI States:**
    - *Empty state* pada kotak Hak dan Kewajiban saat belum berisi kartu.
    - Saat kartu dimasukkan ke kotak yang benar: suara benar, kartu masuk ke daftar kotak dengan label terverifikasi, dan pesan status `"Tepat! [teks kartu] termasuk [Hak/Kewajiban]."`
    - Saat salah kotak: suara salah, kartu tetap di dek, dan pesan umpan balik spesifik menjelaskan alasan singkat agar siswa bisa mencoba lagi.
    - Saat semua 6 kartu selesai dipilah benar: dek menampilkan *completed empty state*, `completedRooms.room2 = true` tersimpan, dan muncul perayaan **Kunci Ruang 3 Ditemukan!**.

#### E. Ruang 3 & Ruang 4: Placeholder Interaktif Demo
Keduanya memiliki 2 sub-halaman agar navigasi PT-07 konsisten dan jujur ditandai sebagai **Kerangka Demo Prototype**:
- **Ruang 3 (Mengenal Kewajiban - Kerangka Demo):** Sub-halaman 1 berisi kerangka rencana materi kewajiban di rumah dan sekolah dengan kotak slot ilustrasi bertanda `[Slot Ilustrasi Materi Final - Tahap Pengembangan Penuh]`; Sub-halaman 2 berisi kerangka simulasi tantangan dan tombol **Selesaikan Tantangan (Demo)** untuk membuka Ruang 4.
- **Ruang 4 (Hak & Kewajiban di Rumah, Sekolah, & Masyarakat - Kerangka Demo):** Sub-halaman 1 berisi kerangka 3 lingkungan (Rumah, Sekolah, Masyarakat) bertanda placeholder tahap penuh; Sub-halaman 2 berisi tombol **Selesaikan Tantangan (Demo)** untuk membuka Ruang 5.

#### F. Ruang 5: Tantangan HAKIKU (PT-05)
Memiliki 2 sub-halaman yang bebas dijelajahi lewat tab langkah maupun tombol **Kembali / Lanjut** (tidak mengunci akses ke Sub-halaman 2 agar validator dapat langsung menguji perubahan URL Blooket tanpa hambatan):
- **Sub-halaman 1 (Kuis Pemanasan):** 1 soal kasus singkat mengenai keseimbangan hak dan kewajiban di sekolah. Jawaban benar menampilkan umpan balik positif serta tombol pintas **Lanjut ke Misi Blooket**.
- **Sub-halaman 2 (Misi Blooket & Kode Rahasia):**
  - Instruksi singkat misi kelas.
  - Kotak info menampilkan alamat tautan Blooket yang sedang aktif (sehingga perubahan dari Mode Guru terlihat langsung).
  - Tombol tautan `<a href={blooketUrl} target="_blank" rel="noopener noreferrer">` berlabel **Mulai Misi Blooket (Tab Baru)**.
  - Form **Gerbang Kode Rahasia**: `<label for="secret-code-input">Kode Rahasia Misi</label>`, input teks (default `HAKIKU`, tidak peka huruf besar/kecil), bantuan singkat khusus prototype (`Kode demo default: HAKIKU`), dan tombol **Buka Gerbang Akhir**.
  - Validasi kosong / salah menampilkan `role="alert"` dan memfokuskan input.
  - Kode benar menyimpan `completedRooms.room5 = true`, memutar fanfare kemenangan, dan mengarahkan ke **Halaman Akhir**.

#### G. Halaman Akhir: Petualangan Selesai
- Ilustrasi piala petualangan HAKIKU, ucapan selamat spesifik untuk petualangan yang baru diselesaikan, serta ringkasan status nyata untuk ke-5 ruangan (menampilkan label `Selesai` untuk ruang yang tuntas dan `Belum selesai` jika halaman akhir dibuka lewat pratinjau Mode Demo Sidang).
- Dua tombol aksi: **Kembali ke Peta Dunia** dan **Ulangi Petualangan** (meminta konfirmasi sebelum mereset progres).

#### H. Mode Guru Mini (PT-06)
Dialog modal aksesibel (focus trap, tombol tutup, Escape menutup, fokus kembali ke pemicu):
- **Langkah 1 (Verifikasi PIN):** PIN 4 digit (default `1234`), mendukung input keyboard maupun tombol angka layar sentuh (*smartboard-friendly*), disertai petunjuk jujur untuk validator prototype (`PIN demo default: 1234`).
- **Langkah 2 (Panel Kontrol Guru):**
  1. **Sakelar Mode Demo Sidang** (`role="switch"`, `aria-checked`): membuka semua gembok Ruang 1 sampai 5 dan akses Halaman Akhir secara instan. Saat dimatikan, kunci berurutan kembali diterapkan dan pengguna yang sedang berada di ruangan terkunci diarahkan kembali ke Peta Dunia.
  2. **URL Misi Blooket:** input berlabel + validasi URL `http://` atau `https://` + tombol **Simpan URL** dan **Reset ke Default**. Perubahan langsung tercermin di Ruang 5.
  3. **URL Video YouTube Ruang 1:** input berlabel (menerima link YouTube penuh maupun ID 11 karakter) + tombol **Simpan Video** dan **Reset ke Default**.
  4. **Kode Rahasia Ruang 5:** input teks (default `HAKIKU`) + tombol **Simpan Kode**.
  5. **Reset Progres Petualangan:** tombol dengan konfirmasi dua langkah di dalam panel agar tidak tertekan tidak sengaja; mengunci kembali Ruang 2 sampai 5 dan mematikan Mode Demo Sidang.

## 5. Penyimpanan Data dan Arsitektur Kode

### 5.1 Skema `localStorage` (Key: `hakiku_prototype_state_v1`)
```json
{
  "completedRooms": {
    "room1": false,
    "room2": false,
    "room3": false,
    "room4": false,
    "room5": false
  },
  "teacherSettings": {
    "demoUnlockAll": false,
    "blooketUrl": "https://play.blooket.com/play",
    "youtubeUrl": "https://www.youtube.com/watch?v=...",
    "secretCode": "HAKIKU"
  },
  "audioMuted": false
}
```
Seluruh baca/tulis `localStorage` dibungkus `try/catch`. Jika browser memblokir storage, aplikasi tetap berjalan dengan state di memori dan menampilkan pemberitahuan ringan.

### 5.2 Struktur Folder Proyek
- `index.html` (`lang="id"`, viewport tanpa larangan zoom, Google Fonts `Baloo 2` & `Nunito`)
- `public/assets/hero-hakiku.svg` (ilustrasi hero utama yang dimuat lewat `<img>` dengan `fetchPriority="high"`)
- `src/data/hakikuData.js` (seluruh teks ruangan, soal Ruang 1 & 5, 6 kartu Ruang 2, URL default, dan PIN default)
- `src/utils/storage.js` (baca/tulis state aman + parser URL YouTube & validator URL Blooket)
- `src/utils/sound.js` (Web Audio API synthesizer: click, correct, wrong, unlock, victory)
- `src/components/icons/StoryIcons.jsx` (ikon UI kustom bergaris tebal konsisten)
- `src/components/illustrations/StoryArt.jsx` (logo lencana, 5 pos peta, 6 ilustrasi kartu sortir, kunci/gembok, piala)
- `src/components/LayoutHeader.jsx` & `src/components/RoomFooterNav.jsx`
- `src/components/UnlockModal.jsx` & `src/components/TeacherModeModal.jsx`
- `src/screens/IntroScreen.jsx`
- `src/screens/WorldMapScreen.jsx`
- `src/screens/Room1Screen.jsx`
- `src/screens/Room2Screen.jsx`
- `src/screens/PlaceholderRoomScreen.jsx` (untuk Ruang 3 dan Ruang 4)
- `src/screens/Room5Screen.jsx`
- `src/screens/FinaleScreen.jsx`

## 6. Keputusan yang Dibuat oleh Builder (Untuk Dicek Klien)

1. **Video YouTube default Ruang 1:** Menggunakan tautan video pembelajaran publik YouTube yang valid untuk demonstrasi, sekaligus menambahkan kolom ganti URL YouTube di Mode Guru agar demo tetap aman jika ingin diganti.
2. **Kategori Sortir Ruang 2:** Memakai 6 kartu (3 Hak dan 3 Kewajiban) dengan validasi langsung per kartu agar terasa responsif saat dicoba di layar sentuh *smartboard*.
3. **Efek Suara Web Audio API:** Menggunakan nada sintetis ringan langsung di browser agar tidak ada file audio eksternal yang gagal muat saat demo publik.
4. **Reset dan Konfirmasi:** Tombol Reset Progres di Mode Guru dan Ulangi Petualangan di Halaman Akhir menggunakan konfirmasi 2-langkah agar tidak tertekan tidak sengaja saat presentasi.
5. **PIN dan Kode Rahasia Demo:** Menampilkan petunjuk kecil `"PIN demo default: 1234"` pada modal PIN dan `"Kode demo default: HAKIKU"` di Ruang 5 agar dosen pembimbing dan validator awal dapat menguji semua fitur secara mandiri tanpa bingung.
6. **Perilaku Mode Demo Sidang:** Saat aktif, Ruang 1 sampai 5 serta akses pratinjau Halaman Akhir terbuka dan penyelesaian ruang tetap tercatat agar animasi kunci bisa didemonstrasikan; saat dimatikan, kunci berurutan kembali berlaku dan jika pengguna sedang berada di ruangan yang belum terbuka secara berurutan, aplikasi otomatis mengembalikannya ke Peta Dunia.
7. **Navigasi Sub-halaman Ruang 5:** Kuis Pemanasan (Sub-halaman 1) tidak mengunci tombol Lanjut ke Misi Blooket (Sub-halaman 2) agar penguji dapat langsung mengecek tautan Blooket baru setelah mengubahnya di Mode Guru. Pada sub-halaman terakhir tiap ruang, tombol lanjut ke ruang berikutnya hanya muncul setelah tantangan selesai (atau saat Mode Demo Sidang aktif).
