export const DEFAULT_TEACHER_PIN = '1234';
export const DEFAULT_BLOOKET_URL = 'https://play.blooket.com/play';
export const DEFAULT_YOUTUBE_URL = 'https://www.youtube.com/watch?v=QtEH32omMiM';
export const DEFAULT_SECRET_CODE = 'HAKIKU';

export const SCENE_ASSETS = {
  intro: '/assets/scenes/intro-world.jpg',
  worldMap: '/assets/scenes/world-map.jpg',
  room1: '/assets/scenes/room1-class.jpg',
  room2: '/assets/scenes/room2-park.jpg',
  room3: '/assets/scenes/room3-piket.jpg',
  room4: '/assets/scenes/room4-village.jpg',
  room5: '/assets/scenes/room5-tower.jpg',
  finale: '/assets/scenes/finale-party.jpg',
  mascot: '/assets/mascot-guide.jpg',
};

export const ROOMS_META = [
  {
    id: 'room1',
    number: 1,
    title: 'Mengenal Hak dan Kewajiban',
    shortTitle: 'Sekolah Desa',
    summary: 'Pahami arti hak dan kewajiban lewat bacaan ringkas, video pembelajaran, dan kuis pembuka kunci.',
    locationLabel: 'Pos 1: Sekolah Desa',
    isDemoPlaceholder: false,
    sceneImage: SCENE_ASSETS.room1,
    mapPin: { x: '17%', y: '53%' },
  },
  {
    id: 'room2',
    number: 2,
    title: 'Mengenal Hak',
    shortTitle: 'Taman Hak',
    summary: 'Pilah 6 kartu bergambar kegiatan anak ke kotak Hak atau Kewajiban dengan menggeser atau mengetuk.',
    locationLabel: 'Pos 2: Taman Hak',
    isDemoPlaceholder: false,
    sceneImage: SCENE_ASSETS.room2,
    mapPin: { x: '25%', y: '13%' },
  },
  {
    id: 'room3',
    number: 3,
    title: 'Mengenal Kewajiban',
    shortTitle: 'Balai Kewajiban',
    summary: 'Kerangka demo materi kewajiban di rumah dan sekolah beserta simulasi pembuka kunci Ruang 4.',
    locationLabel: 'Pos 3: Balai Kewajiban',
    isDemoPlaceholder: true,
    sceneImage: SCENE_ASSETS.room3,
    mapPin: { x: '46%', y: '32%' },
  },
  {
    id: 'room4',
    number: 4,
    title: 'Penerapan di Lingkungan',
    shortTitle: 'Jembatan Warga',
    summary: 'Kerangka demo skenario hak dan kewajiban di rumah, sekolah, dan masyarakat untuk menuju Ruang 5.',
    locationLabel: 'Pos 4: Jembatan Lingkungan',
    isDemoPlaceholder: true,
    sceneImage: SCENE_ASSETS.room4,
    mapPin: { x: '77%', y: '64%' },
  },
  {
    id: 'room5',
    number: 5,
    title: 'Tantangan HAKIKU',
    shortTitle: 'Menara Kunci',
    summary: 'Selesaikan kuis pemanasan, jalankan Misi Blooket bersama kelas, lalu masukkan kode rahasia penutup.',
    locationLabel: 'Pos 5: Menara Tantangan',
    isDemoPlaceholder: false,
    sceneImage: SCENE_ASSETS.room5,
    mapPin: { x: '81%', y: '38%' },
  },
];

export const ROOM1_CONTENT = {
  introNote:
    'Sebelum membuka gembok pertama, mari pahami perbedaan antara hak dan kewajiban dalam kehidupan kita sehari-hari.',
  concepts: [
    {
      id: 'hak',
      term: 'Hak',
      definition:
        'Sesuatu yang layak dan pantas kita terima sesuai peran kita di rumah, sekolah, maupun masyarakat.',
      example: 'Contoh: Mendapat bimbingan belajar dari guru dan kasih sayang dari orang tua.',
      tone: 'sky',
    },
    {
      id: 'kewajiban',
      term: 'Kewajiban',
      definition:
        'Tugas atau perbuatan yang harus kita lakukan dengan penuh tanggung jawab setiap hari.',
      example: 'Contoh: Melaksanakan piket kelas dan merapikan kembali buku setelah belajar.',
      tone: 'meadow',
    },
  ],
  balanceNote:
    'Hak dan kewajiban berjalan seimbang. Saat semua anak menjalankan kewajibannya, kelas menjadi nyaman dan hak belajar setiap siswa terpenuhi.',
  videoTitle: 'Video Sampel: Mengenal Hak dan Kewajiban Siswa SD',
  videoCaption:
    'Tonton video pengantar berikut sebelum masuk ke kuis pembuka kunci. Guru dapat mengganti tautan video ini kapan saja lewat Mode Guru.',
  quizQuestions: [
    {
      id: 'r1-q1',
      prompt: '1. Manakah yang merupakan contoh HAK siswa di sekolah?',
      options: [
        { id: 'a', label: 'Mendapat penjelasan pelajaran dan bimbingan dari guru' },
        { id: 'b', label: 'Datang tepat waktu sebelum bel masuk berbunyi' },
        { id: 'c', label: 'Membersihkan papan tulis sesuai jadwal piket' },
      ],
      correctOptionId: 'a',
      wrongHint:
        'Ingat lagi: hak adalah sesuatu yang kamu terima, sedangkan datang tepat waktu dan piket adalah tugas yang harus dilakukan (kewajiban).',
      correctHint:
        'Tepat! Mendapat penjelasan dan bimbingan dari guru adalah hak setiap siswa di sekolah.',
    },
    {
      id: 'r1-q2',
      prompt:
        '2. Jika kita ingin menikmati hak belajar di ruang kelas yang bersih, kewajiban apa yang perlu kita lakukan?',
      options: [
        { id: 'a', label: 'Menunggu petugas sekolah membersihkan semua meja setiap jam' },
        { id: 'b', label: 'Ikut menjaga kebersihan kelas dan membuang sampah pada tempatnya' },
        { id: 'c', label: 'Membiarkan sampah kertas di bawah meja sampai jam pulang' },
      ],
      correctOptionId: 'b',
      wrongHint:
        'Kelas yang bersih terwujud jika setiap siswa ikut merawatnya. Coba pilih sikap yang menunjukkan tanggung jawab bersama.',
      correctHint:
        'Benar! Menjaga kebersihan kelas adalah kewajiban bersama agar hak belajar dengan nyaman tercapai.',
    },
  ],
};

export const ROOM2_CONTENT = {
  introHeading: 'Cara Bermain Sortir Kartu',
  introBody:
    'Di ruang ini ada 6 kartu bergambar kegiatan sehari-hari. Tugasmu adalah memilah mana kegiatan yang termasuk Hak dan mana yang termasuk Kewajiban.',
  howToSteps: [
    'Seret kartu langsung ke kotak Hak atau kotak Kewajiban menggunakan mouse atau sentuhan layar.',
    'Kamu juga bisa mengetuk satu kartu terlebih dahulu, lalu mengetuk kotak tujuannya.',
    'Jika memakai keyboard, pilih tombol Masukkan ke Hak atau Masukkan ke Kewajiban pada kartu.',
  ],
  cards: [
    {
      id: 'card-lesson',
      text: 'Mendapat pelajaran dan bimbingan dari guru di kelas',
      category: 'hak',
      artKey: 'lesson',
      imageSrc: '/assets/cards/card-lesson.jpg',
      feedbackCorrect: 'Tepat! Mendapat pelajaran dari guru adalah hak setiap anak di sekolah.',
      feedbackWrong:
        'Coba pikirkan lagi: apakah pelajaran dari guru itu sesuatu yang diterima siswa atau tugas yang dikerjakan?',
    },
    {
      id: 'card-piket',
      text: 'Melaksanakan piket menyapu dan merapikan kelas',
      category: 'kewajiban',
      artKey: 'piket',
      imageSrc: '/assets/cards/card-piket.jpg',
      feedbackCorrect: 'Benar! Piket membersihkan kelas adalah kewajiban agar ruang belajar nyaman.',
      feedbackWrong:
        'Belum tepat. Menyapu kelas adalah tugas yang perlu dikerjakan bersama, jadi termasuk kewajiban.',
    },
    {
      id: 'card-love',
      text: 'Mendapat kasih sayang dan perlindungan dari keluarga',
      category: 'hak',
      artKey: 'love',
      imageSrc: '/assets/cards/card-love.jpg',
      feedbackCorrect: 'Tepat! Kasih sayang dan rasa aman adalah hak anak di lingkungan rumah.',
      feedbackWrong:
        'Coba cek kembali: kasih sayang dan perlindungan adalah hal yang berhak diterima oleh anak.',
    },
    {
      id: 'card-tidy',
      text: 'Merapikan kembali buku ke rak setelah selesai membaca',
      category: 'kewajiban',
      artKey: 'tidy',
      imageSrc: '/assets/cards/card-tidy.jpg',
      feedbackCorrect: 'Benar! Merapikan kembali buku ke rak adalah kewajiban siswa menjaga kerapian.',
      feedbackWrong:
        'Kurang tepat. Merapikan buku ke tempat semula adalah tanggung jawab yang harus kita kerjakan.',
    },
    {
      id: 'card-play',
      text: 'Bermain bersama teman dengan aman saat jam istirahat',
      category: 'hak',
      artKey: 'play',
      imageSrc: '/assets/cards/card-play.jpg',
      feedbackCorrect: 'Tepat! Anak memiliki hak untuk bermain dan beristirahat setelah belajar.',
      feedbackWrong:
        'Coba lihat lagi: waktu bermain dan beristirahat adalah hak yang boleh dinikmati anak.',
    },
    {
      id: 'card-trash',
      text: 'Membuang sampah pada tempatnya agar lingkungan bersih',
      category: 'kewajiban',
      artKey: 'trash',
      imageSrc: '/assets/cards/card-trash.jpg',
      feedbackCorrect: 'Benar! Membuang sampah pada tempatnya adalah kewajiban menjaga lingkungan.',
      feedbackWrong:
        'Belum tepat. Membuang sampah pada tempatnya adalah aturan yang wajib kita lakukan.',
    },
  ],
};

export const PLACEHOLDER_ROOMS = {
  room3: {
    roomNumber: 3,
    nextRoomNumber: 4,
    title: 'Ruang 3: Mengenal Kewajiban',
    badgeLabel: 'Kerangka Demo Prototype',
    sceneImage: SCENE_ASSETS.room3,
    sceneAlt: 'Ilustrasi siswa SD Indonesia bekerja sama melakukan piket membersihkan ruang kelas',
    overview:
      'Halaman ini menampilkan susunan tata letak rencana materi Kewajiban untuk validasi alur prototype sebelum pengisian bank soal final dari Google Sheets klien.',
    sections: [
      {
        heading: 'Kewajiban di Rumah',
        placeholderNote: '[Slot Materi Final: Membantu orang tua, belajar rutin, menjaga kebersihan kamar]',
        artSlot: '[Slot Bank Materi Tahap Penuh]',
      },
      {
        heading: 'Kewajiban di Sekolah',
        placeholderNote: '[Slot Materi Final: Menaati tata tertib, menghormati guru, piket kelas]',
        artSlot: '[Slot Bank Materi Tahap Penuh]',
      },
    ],
    challengeHeading: 'Simulasi Tantangan Pembuka Kunci Ruang 4',
    challengeDescription:
      'Pada versi produksi penuh, sub-halaman ini akan diisi permainan mencocokkan kewajiban dengan manfaatnya. Untuk menguji alur peta sampai Ruang 5, klik tombol simulasi di bawah.',
    demoButtonLabel: 'Selesaikan Tantangan (Demo)',
  },
  room4: {
    roomNumber: 4,
    nextRoomNumber: 5,
    title: 'Ruang 4: Penerapan di Lingkungan',
    badgeLabel: 'Kerangka Demo Prototype',
    sceneImage: SCENE_ASSETS.room4,
    sceneAlt: 'Ilustrasi kehidupan harmonis anak di rumah, gerbang sekolah, dan taman lingkungan warga',
    overview:
      'Halaman ini memperlihatkan kerangka tiga zona penerapan hak dan kewajiban yang siap diisi studi kasus lengkap dari database Google Sheets pada tahap penuh.',
    sections: [
      {
        heading: 'Lingkungan Rumah',
        placeholderNote: '[Slot Skenario Final: Keseimbangan hak dan kewajiban antar anggota keluarga]',
        artSlot: '[Slot Studi Kasus Rumah]',
      },
      {
        heading: 'Lingkungan Sekolah',
        placeholderNote: '[Slot Skenario Final: Kerja sama menjaga fasilitas dan kenyamanan belajar]',
        artSlot: '[Slot Studi Kasus Sekolah]',
      },
      {
        heading: 'Lingkungan Masyarakat',
        placeholderNote: '[Slot Skenario Final: Sopan santun bertetangga dan menjaga fasilitas umum]',
        artSlot: '[Slot Studi Kasus Masyarakat]',
      },
    ],
    challengeHeading: 'Simulasi Tantangan Pembuka Kunci Ruang 5',
    challengeDescription:
      'Pada tahap penuh, siswa akan memecahkan studi kasus singkat dari tiga lingkungan di atas. Gunakan tombol demo berikut untuk membuka gerbang Ruang 5.',
    demoButtonLabel: 'Selesaikan Tantangan (Demo)',
  },
};

export const ROOM5_CONTENT = {
  warmupHeading: 'Kuis Pemanasan Sebelum Misi Kelas',
  warmupQuestion: {
    prompt:
      'Raka meminjam buku cerita di perpustakaan sekolah. Agar keseimbangan hak dan kewajiban terjaga, apa yang harus Raka lakukan?',
    options: [
      { id: 'a', label: 'Menyimpan buku di rumah selama mungkin tanpa melapor' },
      { id: 'b', label: 'Membaca dengan rapi lalu mengembalikan buku tepat waktu' },
      { id: 'c', label: 'Mencoret halaman buku supaya mudah diingat' },
    ],
    correctOptionId: 'b',
    wrongHint:
      'Meminjam buku adalah hak siswa, tetapi menjaga kondisi buku dan mengembalikannya tepat waktu adalah kewajiban agar teman lain juga bisa membacanya.',
    correctHint:
      'Tepat! Merawat dan mengembalikan buku tepat waktu menunjukkan keseimbangan hak dan kewajiban.',
  },
  missionHeading: 'Misi Blooket & Gerbang Kode Rahasia',
  missionSteps: [
    'Klik tombol Mulai Misi Blooket untuk membuka permainan kelas pada tab browser baru.',
    'Selesaikan tantangan bersama guru dan teman sekelas di Blooket.',
    'Setelah selesai, masukkan Kode Rahasia yang diberikan guru untuk membuka Halaman Akhir.',
  ],
};
