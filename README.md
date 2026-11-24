# HAKIKU – Versi Hybrid (Canva + Web Tantangan + Google Sheets)

Web **mesin tantangan** untuk multimedia interaktif HAKIKU (Hak dan Kewajibanku, Pendidikan Pancasila kelas IV SD).
Canva tetap menjadi media utama (peta, materi, pintu kode). Web ini hanya menangani tantangan di tiap ruangan dan memberi **kode pintu** yang dipilih siswa di Canva.

| Bagian | Peran |
|---|---|
| **Canva** | Pembuka, peta bergembok bertahap, materi dan video, pintu kode, penutup. Lihat `docs/STORYBOARD-CANVA.md` |
| **Web (repo ini)** | `?ruang=1` sampai `?ruang=5`: kuis pilihan ganda atau sortir kartu, Misi Blooket di Ruang 5, kode pintu |
| **Google Sheets** | Soal, kartu, kode pintu, link Blooket. Diedit guru tanpa coding. Template: `sheets-template/HAKIKU-Database.xlsx` |

## Isi bawaan per ruangan

| Ruang | Judul | Tantangan | Kode |
|---|---|---|---|
| 1 | Mengenal Hak dan Kewajiban | Kuis 3 soal | 274 |
| 2 | Mengenal Hak | Sortir 6 kartu bergambar: Hak / Kewajiban | 381 |
| 3 | Mengenal Kewajiban | Sortir 6 kartu: Kewajiban di Rumah / di Sekolah | 539 |
| 4 | Hubungan Hak dan Kewajiban | Kuis 3 soal studi kasus | 642 |
| 5 | Tantangan HAKIKU | Kuis 1 soal + Misi Blooket | 725 |

Isi bawaan ini hanya contoh. Ganti dengan materi final dari klien lewat Google Sheets.

## Menjalankan di komputer

Butuh Node.js 20 atau lebih baru.

```bash
npm install
npm run dev        # buka http://localhost:5173 (halaman guru) atau /?ruang=1
npm test           # 15 tes otomatis
npm run build      # hasil statis di folder dist/
```

## Menyambungkan Google Sheets

1. Unggah `sheets-template/HAKIKU-Database.xlsx` ke Google Drive (sebaiknya **akun Google klien**).
2. Klik kanan → **Buka dengan → Google Spreadsheet**, lalu **File → Simpan sebagai Google Spreadsheet**. Hapus file .xlsx-nya.
3. **Bagikan → Akses umum → Siapa saja yang memiliki link → Pelihat.**
4. Salin ID Sheet dari alamatnya: `https://docs.google.com/spreadsheets/d/`**`ID_INI`**`/edit`
5. Masukkan ID dengan salah satu cara berikut:
   - di Vercel/Netlify: Environment Variable `VITE_SHEET_ID` = ID tersebut, lalu deploy ulang; **atau**
   - isi `SHEET_ID` di `src/config.js`.
6. Buka halaman guru (alamat web tanpa `?ruang=`). Status harus menunjukkan **Data dari Google Sheets**.

Untuk mencoba Sheet lain tanpa deploy ulang: `https://alamat-web/?sheet=ID_SHEET&ruang=1`.

**Cara kerja:** web membaca tiap tab sebagai CSV lewat `docs.google.com/spreadsheets/d/<ID>/gviz/tq?tqx=out:csv&sheet=<Tab>`. Tidak perlu Apps Script, API key, atau server. Hasil baca terakhir disimpan di `localStorage`, jadi kalau internet putus web memakai salinan itu. Kalau salinannya belum ada, web memakai `src/data/defaultContent.js`. Baris yang salah isi dilewati dan dilaporkan di halaman guru.

## Deploy (gratis)

Vercel / Netlify / Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_SHEET_ID`

Tidak perlu aturan rewrite karena semua ruangan memakai `index.html` yang sama dengan parameter `?ruang=`.

## Struktur

```
src/
  App.jsx                     # memilih halaman guru atau tantangan dari ?ruang=
  config.js                   # SHEET_ID, nama tab, batas waktu
  data/defaultContent.js      # isi bawaan (cadangan offline)
  data/contentLoader.js       # baca Google Sheets + validasi + cache
  data/csv.js                 # pembaca CSV
  screens/HomeScreen.jsx      # halaman guru: link tiap ruangan, status data, kode pintu
  screens/ChallengeScreen.jsx # alur: tantangan → (Blooket) → gembok (ketuk 3x) → kode pintu → kembali ke Canva
  challenges/UnlockGate.jsx   # gembok interaktif + bintang hasil
  components/GameFx.jsx       # konfeti, bintang, balon kata maskot, titik progres
  challenges/QuizChallenge.jsx
  challenges/SortChallenge.jsx   # seret / ketuk / keyboard, cocok untuk smartboard
  challenges/BlooketMission.jsx
  challenges/DoorCodePanel.jsx
docs/STORYBOARD-CANVA.md      # 38 halaman Canva + skema link + kode pengecoh
docs/PANDUAN-GURU.md          # untuk klien/guru: alur kelas & cara edit Sheets
sheets-template/HAKIKU-Database.xlsx
```

## Catatan untuk penulisan skripsi (Bab 3)

Rumusan singkat arsitektur yang bisa dipakai klien:

> Multimedia interaktif HAKIKU dikembangkan menggunakan Canva sebagai media utama yang memuat alur petualangan, peta ruangan, materi, dan video pembelajaran. Tantangan di setiap ruangan disajikan melalui halaman web interaktif yang terhubung dengan Canva melalui hyperlink, berupa kuis pilihan ganda dan permainan memilah kartu. Setelah tantangan selesai, siswa memperoleh kode pintu untuk membuka ruangan berikutnya di Canva. Isi tantangan dan tautan permainan Blooket dikelola guru melalui Google Sheets sehingga dapat diperbarui tanpa mengubah kode program.
