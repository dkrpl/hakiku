# Panduan Guru HAKIKU

HAKIKU terdiri dari dua bagian yang dibuka lewat **satu link web**: `https://hakiku-xmma.vercel.app`

1. **Canva**: alur petualangan, peta, materi, video, dan pintu kode. Tampil di dalam web.
2. **Tantangan**: kuis atau sortir kartu yang muncul di atas Canva saat tombol **🎮 Tantangan** diketuk. Di akhir tantangan muncul kode pintu.

Semua isi tantangan diatur dari **Google Sheets "HAKIKU - Database"**, tanpa coding.

---

## Persiapan (sekali saja)

Di Canva, buka desain HAKIKU → **Bagikan** → Akses umum: **Siapa saja yang memiliki link** → **Dapat melihat**.
Tanpa pengaturan ini, slide Canva tidak bisa tampil di dalam web.

## Alur di kelas (Mode Kelas)

1. Buka `https://hakiku-xmma.vercel.app` di laptop yang tersambung ke smartboard, lalu tekan **▶ Mulai Petualangan**. Layar menjadi penuh dan Canva tampil.
   Bila layar penuh terlepas, ketuk tombol **⛶ Layar Penuh** di kiri atas.
2. Tekan **Mulai** di slide, baca petunjuk bersama siswa, lalu masuk ke Ruang 1 dari peta.
3. Setelah materi, di slide Tantangan siswa mengetuk tombol emas **🎮 Tantangan Ruang N** di **kanan atas**. Tombol ini selalu menunjuk ruang berikutnya yang belum selesai. Tantangan muncul di atas Canva, tidak pindah tab.
4. Siswa mengerjakan tantangan langsung di smartboard. Kartu bisa digeser dengan jari, atau diketuk lalu pilih kotaknya.
5. Siswa mendapat bintang (1–3, tergantung jumlah kesalahan), lalu **mengetuk gembok emas 3 kali** sampai terbuka. Angka kode pintu berputar lalu berhenti.
   Setelah hitung mundur (bawaan 15 detik) jendela tantangan tertutup sendiri dan **Canva terlihat lagi di slide yang sama**. Siswa boleh menekan **Kembali ke Canva Sekarang**, atau **Tunggu, Aku Belum Hafal** untuk menjeda.
6. Di Canva, siswa menekan **Sudah Dapat Kode**, lalu memilih kode yang benar di slide Pintu. Pintu terbuka dan ruangan berikutnya tidak lagi bergembok.
7. Di Ruang 5, setelah kuis, tekan **Mulai Misi Blooket** (Blooket terbuka di tab baru). Setelah permainan selesai, kembali ke tab HAKIKU, tekan **⛶ Layar Penuh**, lalu tekan **Misi Blooket Selesai** untuk mendapat kode terakhir.

Catatan guru:
- Di bagian atas jendela tantangan ada tombol ruang **1–5** untuk membuka ulang ruang mana saja.
- Bila halaman dimuat ulang, tekan **Lanjutkan** untuk meneruskan dari ruang terakhir, atau **Mulai dari Awal**.
- Halaman guru (daftar tantangan, status Google Sheets, kode pintu): `https://hakiku-xmma.vercel.app/?guru=1`.
- Link per ruang (`?ruang=1` sampai `?ruang=5`) tetap bisa dibuka terpisah bila diperlukan.

## Mengubah isi tantangan (Google Sheets)

Buka Google Sheets **HAKIKU - Database**. Setiap perubahan langsung terpakai: cukup simpan, lalu muat ulang halaman web (tekan F5).

| Ingin mengubah… | Tab | Yang diisi |
|---|---|---|
| Link Blooket | **Pengaturan** | kolom `nilai` pada baris `link_blooket` |
| Judul, petunjuk, kode pintu | **Ruang** | baris ruang yang dimaksud |
| Lama hitung mundur kembali ke Canva | **Pengaturan** | `detik_kembali` (0 = tidak otomatis) |
| Link Canva tujuan setelah kode muncul | **Pengaturan** | `link_canva` (sudah terisi link presentasi HAKIKU; kosong = tab web ditutup saja) |
| Soal pilihan ganda | **Kuis** | satu baris = satu soal. `jawaban` diisi a / b / c / d |
| Kartu sortir | **Kartu** | satu baris = satu kartu. `kotak` diisi kiri / kanan |
| Jenis tantangan | **Ruang** | kolom `jenis`: `kuis` atau `sortir` |

**Menambah soal:** tambahkan baris baru di tab Kuis dengan nomor ruang yang sama. Urutan soal mengikuti urutan baris.

**Gambar kartu:** kolom `gambar` boleh dikosongkan (kartu tampil dengan nomor) atau diisi link gambar yang diawali `https://`.

### Aturan penting

- **Kode pintu di Sheets harus sama dengan tombol kode di Canva.** Kalau mengganti kode di Sheets, ganti juga di Canva.
- Jangan mengganti nama tab dan baris judul kolom (baris pertama).
- Isian yang salah tidak akan merusak web. Bagian itu otomatis memakai isi bawaan. Untuk melihat isian yang perlu diperbaiki, buka alamat web **tanpa** `?ruang=` (halaman guru).

## Kalau internet sekolah lambat atau putus

- Web tetap jalan. Web memakai salinan terakhir dari Google Sheets yang tersimpan di laptop itu, atau isi bawaan aplikasi.
- Yang **tetap butuh internet**: membuka Canva, video YouTube, dan Blooket.
- Saran: buka Canva dan semua link tantangan sekali saat internet lancar sebelum kelas dimulai.

## Untuk sidang atau penguji

- **Melompat ke ruangan mana saja:** di Canva, klik nomor halaman di bawah (tampilan grid). Di web, buka halaman guru (alamat web tanpa `?ruang=`) lalu tekan **Buka** pada ruangan yang diinginkan.
- **Melihat semua kode pintu:** halaman guru → **Tampilkan kode pintu**.
