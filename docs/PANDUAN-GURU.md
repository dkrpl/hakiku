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

1. Buka `https://hakiku-xmma.vercel.app` di laptop yang tersambung ke smartboard, lalu tekan **▶ Mulai Petualangan**. Layar menjadi penuh dan slide Canva tampil memenuhi layar.
   Bila layar penuh terlepas, ketuk tombol **⛶ Layar Penuh** di kiri atas.
2. Siswa cukup mengetuk tombol di slide. **Seluruh kotak tombol** bisa diketuk, tidak harus tepat di tulisannya. Ketukan di luar tombol diabaikan, jadi slide tidak berpindah tanpa sengaja.
3. Ruang yang masih bergembok di peta tidak bisa dibuka (muncul pesan "masih terkunci").
4. Setelah materi, siswa mengetuk **Mulai Tantangan** di slide. Tantangan muncul di atas Canva, tidak pindah tab.
5. Siswa mengerjakan tantangan. Kartu bisa digeser dengan jari, atau diketuk lalu pilih kotaknya.
6. Siswa mendapat bintang (1–3), lalu **mengetuk gembok emas 3 kali**. Kode pintu muncul. Setelah hitung mundur (bawaan 15 detik) jendela tantangan tertutup sendiri dan slide Canva terlihat lagi.
7. Siswa mengetuk **Sudah Dapat Kode**, lalu memilih kode yang benar di slide Pintu.
8. Di Ruang 5, setelah kuis, tekan **Mulai Misi Blooket** (Blooket terbuka di tab baru). Setelah selesai, kembali ke tab HAKIKU, tekan **⛶ Layar Penuh**, lalu **Misi Blooket Selesai**.

Catatan guru:
- **Musik latar petualangan** berbunyi otomatis setelah Mulai Petualangan, dan berubah lebih bersemangat saat tantangan dibuka. Ada juga kicau burung, angin, serta efek suara pintu, peta, dan gembok.
  Tombol 🔊 di kiri atas mematikan semua suara; tombol 🎵 hanya mematikan musik latar (efek tetap berbunyi).
- Guru bisa pindah slide dengan **panah kiri/kanan** di keyboard atau clicker presentasi.
- Bila halaman dimuat ulang, tekan **Lanjutkan** untuk meneruskan dari slide terakhir, atau **Mulai dari Awal**.
- Halaman guru (daftar tantangan, status Google Sheets, kode pintu) dikunci dengan **PIN guru** (bawaan **8264**). Buka lewat tombol kecil **🔒 Guru** di layar awal, atau `https://hakiku-xmma.vercel.app/?guru=1`.
  PIN salah 3 kali → terkunci 30 detik. PIN bisa diganti dengan menambah baris `pin_guru` (4–8 angka) di tab **Pengaturan** Google Sheets. Setelah selesai, tekan **🔒 Kunci Halaman Guru**.
- Tombol pilih ruang **1–5** di jendela tantangan hanya muncul setelah guru memasukkan PIN, jadi siswa tidak bisa melompat ke ruang lain.
- Letak tombol tiap slide tercatat di `src/data/canvaHotspots.js`. Bila tombol di Canva dipindah atau ditambah, angka di file itu perlu disesuaikan.

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
