# Panduan Guru HAKIKU

HAKIKU terdiri dari dua bagian yang dibuka lewat **satu link Canva**:

1. **Canva**: alur petualangan, peta, materi, video, dan pintu kode.
2. **Web tantangan**: terbuka otomatis saat menekan tombol **Mulai Tantangan** di Canva. Isinya kuis atau sortir kartu. Di akhir tantangan muncul kode pintu.

Semua isi tantangan diatur dari **Google Sheets "HAKIKU - Database"**, tanpa coding.

---

## Alur di kelas

1. Buka link Canva HAKIKU dalam mode **Presentasi** (layar penuh) di laptop yang tersambung ke smartboard.
2. Tekan **Mulai**, baca petunjuk bersama siswa, lalu masuk ke Ruang 1 dari peta.
3. Setelah materi, tekan **Mulai Tantangan**. Web terbuka di tab baru.
4. Siswa mengerjakan tantangan langsung di smartboard. Kartu bisa digeser dengan jari, atau diketuk lalu pilih kotaknya.
5. Siswa mendapat bintang (1–3, tergantung jumlah kesalahan), lalu **mengetuk gembok emas 3 kali** sampai terbuka. Angka kode pintu berputar lalu berhenti.
   Setelah hitung mundur (bawaan 15 detik) web **kembali ke Canva sendiri**: tab web tertutup dan slide Canva terlihat lagi. Siswa boleh menekan **Kembali ke Canva Sekarang**, atau **Tunggu, Aku Belum Hafal** untuk menjeda.
   Bila browser sekolah menolak menutup tab otomatis, layar menampilkan kode besar dan petunjuk menekan ✕ pada tab.
6. Di Canva, tekan **Sudah dapat kode**, lalu siswa memilih kode yang benar. Pintu terbuka dan ruangan berikutnya tidak lagi bergembok.
7. Di Ruang 5, setelah kuis, tekan **Mulai Misi Blooket**. Setelah permainan selesai, kembali ke tab web lalu tekan **Misi Blooket Selesai** untuk mendapat kode terakhir.

## Mengubah isi tantangan (Google Sheets)

Buka Google Sheets **HAKIKU - Database**. Setiap perubahan langsung terpakai: cukup simpan, lalu muat ulang halaman web (tekan F5).

| Ingin mengubah… | Tab | Yang diisi |
|---|---|---|
| Link Blooket | **Pengaturan** | kolom `nilai` pada baris `link_blooket` |
| Judul, petunjuk, kode pintu | **Ruang** | baris ruang yang dimaksud |
| Lama hitung mundur kembali ke Canva | **Pengaturan** | `detik_kembali` (0 = tidak otomatis) |
| Link tujuan setelah kode muncul (opsional) | **Pengaturan** | `link_canva` (kosong = tab web ditutup) |
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
