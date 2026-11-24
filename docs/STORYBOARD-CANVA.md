# Storyboard Canva HAKIKU (Versi Hybrid)

Canva adalah **media utama**: pembuka, peta, materi, video, pintu kode, dan penutup.
Web hanya dipakai untuk **tantangan** di setiap ruangan. Setelah tantangan selesai, web memberi **kode pintu**, lalu siswa kembali ke Canva dan memilih kode itu untuk membuka ruangan berikutnya.

```
Canva: Peta → Materi Ruang N → [Mulai Tantangan] ──► Web ?ruang=N ──► Kode Pintu
                                                                        │
Canva: Peta berikutnya ◄── Pintu Terbuka ◄── Pintu Ruang N (pilih kode) ◄┘
```

- Ukuran desain: **Presentasi 16:9** (1920 × 1080).
- Aset gambar: unggah gambar di folder `public/assets/scenes/` ke Canva supaya gaya visual Canva dan web sama (peta: `world-map.jpg`, ruang 1–5: `room1-class.jpg` sampai `room5-tower.jpg`, pembuka: `intro-world.jpg`, penutup: `finale-party.jpg`, maskot: `mascot-guide.jpg`).
- Warna utama: hijau `#186A42`, biru `#155E95`, kuning `#F2B705`, cokelat kayu `#7A4315`, krem `#FBF8F1`.
- Huruf: **Baloo 2** untuk judul dan **Nunito** untuk isi. Keduanya tersedia di Canva.

---

## 1. Daftar halaman (38 halaman)

| Hal. | Nama halaman | Isi | Tombol → tujuan |
|---|---|---|---|
| 1 | Pembuka | Judul HAKIKU, ilustrasi `intro-world.jpg`, maskot | **Mulai** → hal. 2 |
| 2 | Petunjuk | Cara bermain (lihat bagian 4), arti ikon gembok/kunci | **Ke Peta** → hal. 3 |
| 3 | Peta 1 | Ruang 1 terbuka, Ruang 2–5 bergembok | **Ruang 1** → hal. 4 · gembok → hal. 3 (dirinya sendiri) |
| 4 | R1 Materi A | Pengertian hak dan kewajiban | **Lanjut** → hal. 5 · **Peta** → hal. 3 |
| 5 | R1 Materi B | Video + contoh | **Lanjut** → hal. 6 · **Kembali** → hal. 4 |
| 6 | R1 Tantangan | Ajakan mengerjakan tantangan | **Mulai Tantangan** → link web `?ruang=1` · **Sudah dapat kode** → hal. 7 |
| 7 | R1 Pintu | "Pilih kode yang kamu dapat": 3 tombol kode | kode benar → hal. 8 · 2 kode salah → hal. 34 |
| 8 | R1 Pintu Terbuka | Animasi pintu/kunci, ucapan hebat | **Ke Peta** → hal. 9 |
| 9 | Peta 2 | Ruang 1 ✔, Ruang 2 terbuka, 3–5 bergembok | **Ruang 1** → hal. 4 · **Ruang 2** → hal. 10 · gembok → hal. 9 |
| 10–14 | Ruang 2 | Materi A, Materi B, Tantangan (`?ruang=2`), Pintu, Pintu Terbuka | pola sama, Pintu salah → hal. 35, Terbuka → hal. 15 |
| 15 | Peta 3 | Ruang 1–2 ✔, Ruang 3 terbuka | ruang selesai/terbuka → materinya · gembok → hal. 15 |
| 16–20 | Ruang 3 | Materi A, Materi B, Tantangan (`?ruang=3`), Pintu, Pintu Terbuka | Pintu salah → hal. 36, Terbuka → hal. 21 |
| 21 | Peta 4 | Ruang 1–3 ✔, Ruang 4 terbuka | |
| 22–26 | Ruang 4 | Materi A, Materi B, Tantangan (`?ruang=4`), Pintu, Pintu Terbuka | Pintu salah → hal. 37, Terbuka → hal. 27 |
| 27 | Peta 5 | Ruang 1–4 ✔, Ruang 5 terbuka | |
| 28–32 | Ruang 5 | Rangkuman, Aturan Misi Blooket, Tantangan (`?ruang=5`), Pintu Terakhir, Pintu Terbuka | Pintu salah → hal. 38, Terbuka → hal. 33 |
| 33 | Petualangan Selesai | Ucapan selamat, pesan hak & kewajiban, `finale-party.jpg` | **Main Lagi** → hal. 1 |
| 34–38 | Kode Salah R1–R5 | "Kode belum tepat! Kerjakan lagi tantangannya atau cek kodenya." | **Coba Lagi** → pintu ruangan itu (hal. 7 / 13 / 19 / 25 / 31) |

> Halaman "Kode Salah" sengaja ditaruh **paling belakang** supaya tidak muncul kalau seseorang menggeser slide biasa.

## 2. Kode pintu (harus sama dengan Google Sheets tab **Ruang**)

| Ruang | Kode benar | Pengecoh 1 | Pengecoh 2 |
|---|---|---|---|
| 1 | **274** | 247 | 427 |
| 2 | **381** | 318 | 813 |
| 3 | **539** | 593 | 359 |
| 4 | **642** | 624 | 462 |
| 5 | **725** | 752 | 527 |

Pengecohnya sengaja memakai angka yang sama dengan urutan berbeda, supaya siswa benar-benar harus mengingat kode dari web.
Urutan tombol di setiap pintu diacak: jangan selalu taruh kode benar di posisi yang sama.

**Kalau kode diganti di Google Sheets, ganti juga teks tombol kodenya di Canva**, termasuk link tombol yang benar.

## 3. Link tantangan web

Setelah web di-deploy (misalnya `https://hakiku.vercel.app`), linknya:

| Ruang | Link |
|---|---|
| 1 | `https://hakiku.vercel.app/?ruang=1` |
| 2 | `https://hakiku.vercel.app/?ruang=2` |
| 3 | `https://hakiku.vercel.app/?ruang=3` |
| 4 | `https://hakiku.vercel.app/?ruang=4` |
| 5 | `https://hakiku.vercel.app/?ruang=5` |

Cara termudah: buka alamat web **tanpa** `?ruang=` untuk masuk ke halaman guru, lalu tekan **Salin link** di setiap ruangan.
Di Canva: pilih tombol **Mulai Tantangan** → ikon **Link** → tempel → Enter. Link luar di Canva otomatis terbuka di tab baru.

## 4. Teks halaman Petunjuk (hal. 2)

1. Selalu tekan **tombol** di layar untuk berpindah halaman. Jangan menekan tombol panah keyboard atau mengeklik area kosong.
2. Di setiap ruangan, pelajari materinya dulu, lalu tekan **Mulai Tantangan**.
3. Selesaikan tantangan sampai muncul **kode pintu**. Ingat kodenya!
4. Kembali ke HAKIKU, tekan **Sudah dapat kode**, lalu pilih kode yang benar untuk membuka pintu.
5. Ruangan bergembok baru terbuka setelah ruangan sebelumnya selesai.

## 5. Cara membuat link antarhalaman di Canva

1. Pilih tombol atau gambar.
2. Klik ikon **Link** (rantai) di toolbar, atau **⋯ → Link**.
3. Pada bagian **Halaman di dokumen ini**, pilih halaman tujuan.

**Gembok pada peta:** beri link ke **halaman peta itu sendiri**. Dengan begitu, mengeklik gembok tidak memindah halaman, sementara keterangan di peta menjelaskan bahwa ruangan masih terkunci.

## 6. Cek sebelum dipakai di kelas atau sidang

- [ ] Semua tombol **Mulai Tantangan** membuka ruangan web yang benar (1–5).
- [ ] Di setiap pintu, kode benar menuju "Pintu Terbuka" dan kode salah menuju "Kode Salah".
- [ ] Setiap "Pintu Terbuka" menuju versi peta yang benar.
- [ ] Gembok di setiap peta tidak memindah halaman.
- [ ] Video bisa diputar dan link Blooket di Google Sheets sudah diganti dengan game terbaru.
- [ ] Mainkan sekali penuh dari halaman 1 sampai 33 dalam mode **Presentasi**.
