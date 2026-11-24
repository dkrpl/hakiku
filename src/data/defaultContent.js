// Konten bawaan HAKIKU (versi hybrid).
// Dipakai saat Google Sheets belum diatur, gagal dimuat, atau internet sekolah putus.
// Bentuk datanya sama persis dengan hasil baca Google Sheets (lihat contentLoader.js).

export const SCENES = {
  1: '/assets/scenes/room1-class.jpg',
  2: '/assets/scenes/room2-park.jpg',
  3: '/assets/scenes/room3-piket.jpg',
  4: '/assets/scenes/room4-village.jpg',
  5: '/assets/scenes/room5-tower.jpg',
  home: '/assets/scenes/world-map.jpg',
  mascot: '/assets/mascot-guide.jpg',
};

export const ROOM_NUMBERS = [1, 2, 3, 4, 5];

export const DEFAULT_SETTINGS = {
  blooketUrl: 'https://play.blooket.com/play',
  // PIN untuk membuka halaman guru. Bisa diganti lewat baris "pin_guru" di tab Pengaturan Google Sheets.
  teacherPin: '8264',
  // Link presentasi Canva (mode "Lihat"). Setelah kode muncul, web pindah ke link ini
  // tepat di slide pintu ruangan (memakai id halaman pintu di tiap ruang).
  // Kosongkan bila ingin tab tantangan ditutup saja.
  canvaUrl: 'https://www.canva.com/design/DAHbv4LhBzI/C8xeXMSqxpSoeNVRyl8eNw/view',
  // Lama hitung mundur sebelum kembali ke Canva (detik). 0 = tidak otomatis.
  returnSeconds: 15,
};

export const DEFAULT_ROOMS = {
  1: {
    number: 1,
    title: 'Mengenal Hak dan Kewajiban',
    type: 'kuis',
    instruction:
      'Jawab semua soal dengan benar untuk mendapatkan kode pintu Ruang 1. Kalau salah, baca petunjuknya lalu coba lagi!',
    doorCode: '274',
    // id halaman "Pintu" di Canva (untuk kembali langsung ke slide pintu)
    canvaDoorPageId: 'PBpRd0nXtkC7jkp8',
    canvaReturnUrl: '',
    leftLabel: 'Hak',
    rightLabel: 'Kewajiban',
    showBlooket: false,
    questions: [
      {
        id: 'r1-q1',
        prompt: 'Manakah yang merupakan contoh HAK siswa di sekolah?',
        options: [
          { id: 'a', label: 'Mendapat penjelasan pelajaran dan bimbingan dari guru' },
          { id: 'b', label: 'Datang tepat waktu sebelum bel masuk berbunyi' },
          { id: 'c', label: 'Membersihkan papan tulis sesuai jadwal piket' },
        ],
        answer: 'a',
        wrongHint:
          'Ingat: hak adalah sesuatu yang kamu terima. Datang tepat waktu dan piket adalah tugas yang harus dilakukan (kewajiban).',
        correctHint: 'Tepat! Mendapat penjelasan dan bimbingan dari guru adalah hak setiap siswa.',
      },
      {
        id: 'r1-q2',
        prompt:
          'Jika kita ingin belajar di kelas yang bersih, kewajiban apa yang perlu kita lakukan?',
        options: [
          { id: 'a', label: 'Menunggu petugas sekolah membersihkan semua meja' },
          { id: 'b', label: 'Ikut menjaga kebersihan dan membuang sampah pada tempatnya' },
          { id: 'c', label: 'Membiarkan sampah kertas di bawah meja sampai pulang' },
        ],
        answer: 'b',
        wrongHint:
          'Kelas yang bersih terwujud jika setiap siswa ikut merawatnya. Pilih sikap yang menunjukkan tanggung jawab.',
        correctHint: 'Benar! Menjaga kebersihan kelas adalah kewajiban bersama.',
      },
      {
        id: 'r1-q3',
        prompt: 'Apa hubungan antara hak dan kewajiban?',
        options: [
          { id: 'a', label: 'Hak lebih penting, kewajiban boleh ditinggalkan' },
          { id: 'b', label: 'Kewajiban saja yang penting, hak tidak perlu' },
          { id: 'c', label: 'Hak dan kewajiban harus dijalankan secara seimbang' },
        ],
        answer: 'c',
        wrongHint: 'Coba pikirkan lagi: apa yang terjadi jika semua orang hanya menuntut hak?',
        correctHint: 'Hebat! Hak dan kewajiban harus seimbang supaya hidup bersama terasa nyaman.',
      },
    ],
    cards: [],
  },
  2: {
    number: 2,
    title: 'Mengenal Hak',
    type: 'sortir',
    instruction:
      'Pilah semua kartu ke kotak yang benar. Seret kartunya, atau ketuk kartu lalu ketuk kotaknya.',
    doorCode: '381',
    // id halaman "Pintu" di Canva (untuk kembali langsung ke slide pintu)
    canvaDoorPageId: 'PBrR0mDsFJmwG3DJ',
    canvaReturnUrl: '',
    leftLabel: 'Hak',
    rightLabel: 'Kewajiban',
    showBlooket: false,
    questions: [],
    cards: [
      {
        id: 'r2-c1',
        text: 'Mendapat pelajaran dan bimbingan dari guru di kelas',
        box: 'kiri',
        image: '/assets/cards/card-lesson.jpg',
        feedbackCorrect: 'Tepat! Mendapat pelajaran dari guru adalah hak setiap anak di sekolah.',
        feedbackWrong: 'Coba pikirkan lagi: pelajaran dari guru itu diterima siswa atau dikerjakan siswa?',
      },
      {
        id: 'r2-c2',
        text: 'Melaksanakan piket menyapu dan merapikan kelas',
        box: 'kanan',
        image: '/assets/cards/card-piket.jpg',
        feedbackCorrect: 'Benar! Piket kelas adalah kewajiban agar ruang belajar nyaman.',
        feedbackWrong: 'Belum tepat. Menyapu kelas adalah tugas yang dikerjakan bersama, jadi termasuk kewajiban.',
      },
      {
        id: 'r2-c3',
        text: 'Mendapat kasih sayang dan perlindungan dari keluarga',
        box: 'kiri',
        image: '/assets/cards/card-love.jpg',
        feedbackCorrect: 'Tepat! Kasih sayang dan rasa aman adalah hak anak di rumah.',
        feedbackWrong: 'Coba cek lagi: kasih sayang dan perlindungan adalah hal yang berhak diterima anak.',
      },
      {
        id: 'r2-c4',
        text: 'Merapikan kembali buku ke rak setelah selesai membaca',
        box: 'kanan',
        image: '/assets/cards/card-tidy.jpg',
        feedbackCorrect: 'Benar! Merapikan buku ke rak adalah kewajiban menjaga kerapian.',
        feedbackWrong: 'Kurang tepat. Merapikan buku ke tempat semula adalah tanggung jawab kita.',
      },
      {
        id: 'r2-c5',
        text: 'Bermain bersama teman dengan aman saat jam istirahat',
        box: 'kiri',
        image: '/assets/cards/card-play.jpg',
        feedbackCorrect: 'Tepat! Anak memiliki hak untuk bermain dan beristirahat.',
        feedbackWrong: 'Coba lihat lagi: waktu bermain dan beristirahat adalah hak anak.',
      },
      {
        id: 'r2-c6',
        text: 'Membuang sampah pada tempatnya agar lingkungan bersih',
        box: 'kanan',
        image: '/assets/cards/card-trash.jpg',
        feedbackCorrect: 'Benar! Membuang sampah pada tempatnya adalah kewajiban menjaga lingkungan.',
        feedbackWrong: 'Belum tepat. Membuang sampah pada tempatnya adalah aturan yang wajib kita lakukan.',
      },
    ],
  },
  3: {
    number: 3,
    title: 'Mengenal Kewajiban',
    type: 'sortir',
    instruction:
      'Kewajiban ada di mana-mana! Pilah kartu ke kotak Kewajiban di Rumah atau Kewajiban di Sekolah.',
    doorCode: '539',
    // id halaman "Pintu" di Canva (untuk kembali langsung ke slide pintu)
    canvaDoorPageId: 'PBbQ3Vw7MWC3FbfC',
    canvaReturnUrl: '',
    leftLabel: 'Kewajiban di Rumah',
    rightLabel: 'Kewajiban di Sekolah',
    showBlooket: false,
    questions: [],
    cards: [
      {
        id: 'r3-c1',
        text: 'Membantu orang tua menyapu dan merapikan rumah',
        box: 'kiri',
        image: '',
        feedbackCorrect: 'Benar! Membantu orang tua adalah kewajiban anak di rumah.',
        feedbackWrong: 'Coba lagi. Menyapu dan merapikan rumah dilakukan di mana?',
      },
      {
        id: 'r3-c2',
        text: 'Melaksanakan piket kelas sesuai jadwal',
        box: 'kanan',
        image: '',
        feedbackCorrect: 'Tepat! Piket kelas adalah kewajiban siswa di sekolah.',
        feedbackWrong: 'Belum tepat. Piket kelas dilakukan di sekolah.',
      },
      {
        id: 'r3-c3',
        text: 'Merapikan tempat tidur sendiri setelah bangun pagi',
        box: 'kiri',
        image: '',
        feedbackCorrect: 'Benar! Merapikan tempat tidur adalah kewajiban di rumah.',
        feedbackWrong: 'Coba lagi. Tempat tidur kita ada di rumah, bukan di sekolah.',
      },
      {
        id: 'r3-c4',
        text: 'Mengikuti upacara bendera dengan tertib',
        box: 'kanan',
        image: '',
        feedbackCorrect: 'Tepat! Mengikuti upacara dengan tertib adalah kewajiban siswa di sekolah.',
        feedbackWrong: 'Belum tepat. Upacara bendera hari Senin dilaksanakan di sekolah.',
      },
      {
        id: 'r3-c5',
        text: 'Belajar dan mengerjakan PR di rumah tanpa disuruh',
        box: 'kiri',
        image: '',
        feedbackCorrect: 'Benar! Belajar di rumah adalah kewajiban sebagai anak dan pelajar.',
        feedbackWrong: 'Coba lagi. PR dikerjakan di rumah, ya!',
      },
      {
        id: 'r3-c6',
        text: 'Mematuhi tata tertib dan datang tepat waktu ke kelas',
        box: 'kanan',
        image: '',
        feedbackCorrect: 'Tepat! Mematuhi tata tertib sekolah adalah kewajiban setiap siswa.',
        feedbackWrong: 'Belum tepat. Tata tertib dan bel masuk kelas ada di sekolah.',
      },
    ],
  },
  4: {
    number: 4,
    title: 'Hubungan Hak dan Kewajiban',
    type: 'kuis',
    instruction:
      'Baca cerita pendek di setiap soal, lalu pilih sikap yang menunjukkan hak dan kewajiban yang seimbang.',
    doorCode: '642',
    // id halaman "Pintu" di Canva (untuk kembali langsung ke slide pintu)
    canvaDoorPageId: 'PBtJJZyYfysqdrXg',
    canvaReturnUrl: '',
    leftLabel: 'Hak',
    rightLabel: 'Kewajiban',
    showBlooket: false,
    questions: [
      {
        id: 'r4-q1',
        prompt:
          'Dina ingin menonton televisi, tetapi PR-nya belum selesai. Sikap yang paling tepat adalah …',
        options: [
          { id: 'a', label: 'Menonton televisi sampai malam, PR dikerjakan besok pagi' },
          { id: 'b', label: 'Mengerjakan PR terlebih dahulu, lalu menonton televisi' },
          { id: 'c', label: 'Meminta kakak mengerjakan PR supaya bisa langsung menonton' },
        ],
        answer: 'b',
        wrongHint: 'Menonton televisi adalah hak Dina, tetapi mengerjakan PR adalah kewajibannya. Mana yang didahulukan?',
        correctHint: 'Tepat! Kewajiban dikerjakan dulu, setelah itu Dina bisa menikmati haknya.',
      },
      {
        id: 'r4-q2',
        prompt:
          'Budi ingin membaca dengan nyaman di perpustakaan sekolah. Apa kewajiban Budi di perpustakaan?',
        options: [
          { id: 'a', label: 'Menjaga ketenangan dan merawat buku yang dipinjam' },
          { id: 'b', label: 'Mengobrol keras bersama teman di dekat rak' },
          { id: 'c', label: 'Melipat halaman buku sebagai penanda' },
        ],
        answer: 'a',
        wrongHint: 'Kalau semua orang ribut dan merusak buku, apakah hak membaca dengan nyaman bisa terpenuhi?',
        correctHint: 'Benar! Dengan menjaga ketenangan dan merawat buku, semua siswa bisa membaca dengan nyaman.',
      },
      {
        id: 'r4-q3',
        prompt:
          'Warga desa berhak menikmati taman desa yang bersih dan indah. Apa kewajiban kita sebagai warga?',
        options: [
          { id: 'a', label: 'Memetik bunga di taman untuk dibawa pulang' },
          { id: 'b', label: 'Membuang bungkus jajan di bawah bangku taman' },
          { id: 'c', label: 'Ikut kerja bakti dan tidak merusak tanaman' },
        ],
        answer: 'c',
        wrongHint: 'Taman yang bersih dan indah perlu dirawat bersama. Pilih sikap yang ikut menjaganya.',
        correctHint: 'Hebat! Ikut merawat taman adalah kewajiban warga agar semua bisa menikmatinya.',
      },
    ],
    cards: [],
  },
  5: {
    number: 5,
    title: 'Tantangan HAKIKU',
    type: 'kuis',
    instruction:
      'Selesaikan kuis terakhir, lalu ikuti Misi Blooket bersama teman sekelas untuk mendapatkan kode pintu terakhir.',
    doorCode: '725',
    // id halaman "Pintu" di Canva (untuk kembali langsung ke slide pintu)
    canvaDoorPageId: 'PBxT7Kh1Lkpsd2pf',
    canvaReturnUrl: '',
    leftLabel: 'Hak',
    rightLabel: 'Kewajiban',
    showBlooket: true,
    questions: [
      {
        id: 'r5-q1',
        prompt:
          'Raka meminjam buku cerita di perpustakaan sekolah. Agar hak dan kewajiban seimbang, apa yang harus Raka lakukan?',
        options: [
          { id: 'a', label: 'Menyimpan buku di rumah selama mungkin tanpa melapor' },
          { id: 'b', label: 'Membaca dengan rapi lalu mengembalikan buku tepat waktu' },
          { id: 'c', label: 'Mencoret halaman buku supaya mudah diingat' },
        ],
        answer: 'b',
        wrongHint:
          'Meminjam buku adalah hak Raka, tetapi menjaga dan mengembalikannya tepat waktu adalah kewajibannya.',
        correctHint: 'Tepat! Merawat dan mengembalikan buku tepat waktu menunjukkan hak dan kewajiban yang seimbang.',
      },
    ],
    cards: [],
  },
};

export function getDefaultContent() {
  // Salinan dalam supaya perubahan tidak menyentuh data bawaan.
  return JSON.parse(JSON.stringify({ settings: DEFAULT_SETTINGS, rooms: DEFAULT_ROOMS }));
}
