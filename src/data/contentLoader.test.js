import { describe, expect, it, beforeEach } from 'vitest';
import { parseCsv, csvToObjects } from './csv';
import { buildCanvaEmbedUrl, buildCanvaReturnUrl, buildContentFromSheets, buildSheetCsvUrl, loadContent } from './contentLoader';

describe('parseCsv', () => {
  it('membaca sel berkutip yang berisi koma, kutip ganda, dan baris baru', () => {
    const rows = parseCsv('a,b,c\n"1, dua","kata ""kutip""","baris\nbaru"\n');
    expect(rows).toEqual([
      ['a', 'b', 'c'],
      ['1, dua', 'kata "kutip"', 'baris\nbaru'],
    ]);
  });

  it('mengubah judul kolom menjadi huruf kecil dengan garis bawah', () => {
    const objs = csvToObjects('"Ruang","Kode Pintu"\n"2","381"');
    expect(objs).toEqual([{ ruang: '2', kode_pintu: '381' }]);
  });
});

describe('buildContentFromSheets', () => {
  it('memakai data Sheet untuk link Blooket, kode pintu, soal, dan kartu', () => {
    const { content, warnings } = buildContentFromSheets({
      settings: [{ kunci: 'link_blooket', nilai: 'https://play.blooket.com/play?id=123' }],
      rooms: [{ ruang: '1', judul: 'Judul Baru', jenis: 'kuis', kode_pintu: '111.0', tombol_blooket: 'tidak' }],
      quiz: [
        {
          ruang: '1',
          pertanyaan: 'Soal baru?',
          pilihan_a: 'Satu',
          pilihan_b: 'Dua',
          pilihan_c: '',
          pilihan_d: 'Empat',
          jawaban: 'D',
        },
      ],
      cards: [
        { ruang: '2', teks: 'Kartu A', kotak: 'Hak' },
        { ruang: '2', teks: 'Kartu B', kotak: 'kanan' },
      ],
    });

    expect(warnings).toEqual([]);
    expect(content.settings.blooketUrl).toBe('https://play.blooket.com/play?id=123');
    expect(content.rooms[1].title).toBe('Judul Baru');
    expect(content.rooms[1].doorCode).toBe('111');
    expect(content.rooms[1].questions).toHaveLength(1);
    expect(content.rooms[1].questions[0].options.map((o) => o.id)).toEqual(['a', 'b', 'd']);
    expect(content.rooms[1].questions[0].answer).toBe('d');
    expect(content.rooms[2].cards.map((c) => c.box)).toEqual(['kiri', 'kanan']);
    // Ruang lain tetap memakai konten bawaan.
    expect(content.rooms[4].questions.length).toBeGreaterThan(0);
  });

  it('melewati baris yang salah isi dan kembali ke bawaan bila ruang jadi kosong', () => {
    const { content, warnings } = buildContentFromSheets({
      settings: [],
      rooms: [],
      quiz: [{ ruang: '4', pertanyaan: 'Tanpa jawaban', pilihan_a: 'x', pilihan_b: 'y', jawaban: 'z' }],
      cards: [{ ruang: '3', teks: 'Hanya satu kotak', kotak: 'kiri' }],
    });

    expect(warnings.some((w) => w.includes('tidak cocok'))).toBe(true);
    expect(content.rooms[4].questions[0].id).toBe('r4-q1');
    expect(warnings.some((w) => w.includes('kotak kiri dan kanan'))).toBe(true);
    expect(content.rooms[3].cards).toHaveLength(6);
  });
});

describe('loadContent', () => {
  beforeEach(() => window.localStorage.clear());

  it('memakai konten bawaan bila ID Sheet kosong', async () => {
    const result = await loadContent({ sheetId: '', fetchImpl: () => Promise.reject(new Error('tidak dipanggil')) });
    expect(result.source).toBe('bawaan');
  });

  it('membaca keempat tab dari Google Sheets', async () => {
    const tabs = {
      Pengaturan: 'kunci,nilai\nlink_blooket,https://blooket.test/x',
      Ruang: 'ruang,kode_pintu\n5,999',
      Kuis: 'ruang,pertanyaan\n',
      Kartu: 'ruang,teks\n',
    };
    const fetchImpl = async (url) => {
      const tab = decodeURIComponent(new URL(url).searchParams.get('sheet'));
      return { ok: true, text: async () => tabs[tab] };
    };
    const result = await loadContent({ sheetId: 'abc', fetchImpl });
    expect(result.source).toBe('sheets');
    expect(result.content.settings.blooketUrl).toBe('https://blooket.test/x');
    expect(result.content.rooms[5].doorCode).toBe('999');
  });

  it('memakai salinan terakhir saat Sheet gagal, lalu bawaan bila belum ada salinan', async () => {
    const ok = async (url) => {
      const tab = new URL(url).searchParams.get('sheet');
      return { ok: true, text: async () => (tab === 'Ruang' ? 'ruang,kode_pintu\n1,555' : 'a\n') };
    };
    await loadContent({ sheetId: 'abc', fetchImpl: ok });

    const fail = async () => {
      throw new Error('offline');
    };
    const cached = await loadContent({ sheetId: 'abc', fetchImpl: fail });
    expect(cached.source).toBe('cache');
    expect(cached.content.rooms[1].doorCode).toBe('555');

    window.localStorage.clear();
    const fallback = await loadContent({ sheetId: 'abc', fetchImpl: fail });
    expect(fallback.source).toBe('bawaan');
    expect(fallback.error).toBe('offline');
  });

  it('memberi pesan jelas bila Sheet belum dibagikan (Google mengirim halaman HTML)', async () => {
    const fetchImpl = async () => ({ ok: true, text: async () => '<!DOCTYPE html><html>login</html>' });
    const result = await loadContent({ sheetId: 'abc', fetchImpl });
    expect(result.error).toMatch(/dibagikan/);
  });

  it('membentuk URL CSV Google Sheets per tab', () => {
    expect(buildSheetCsvUrl('ID123', 'Kuis')).toBe(
      'https://docs.google.com/spreadsheets/d/ID123/gviz/tq?tqx=out:csv&headers=1&sheet=Kuis'
    );
  });

  it('membaca link Canva dan lama hitung mundur dari tab Pengaturan', () => {
    const { content, warnings } = buildContentFromSheets({
      settings: [
        { kunci: 'link_canva', nilai: 'https://www.canva.com/design/ABC/view' },
        { kunci: 'detik_kembali', nilai: '20' },
      ],
    });
    expect(content.settings.canvaUrl).toBe('https://www.canva.com/design/ABC/view');
    expect(content.settings.returnSeconds).toBe(20);
    expect(warnings).toHaveLength(0);

    const bad = buildContentFromSheets({ settings: [{ kunci: 'detik_kembali', nilai: 'lama' }, { kunci: 'link_canva', nilai: 'bukan link' }] });
    expect(bad.content.settings.returnSeconds).toBe(15);
    expect(bad.content.settings.canvaUrl).toMatch(/^https:\/\/www\.canva\.com\//);
    expect(bad.warnings.join(' ')).toMatch(/detik_kembali/);
  });

  it('membuat link kembali ke slide pintu Canva untuk tiap ruang', () => {
    const { settings, rooms } = buildContentFromSheets({}).content;
    const url = new URL(buildCanvaReturnUrl(settings, rooms[1]));
    expect(url.pathname).toMatch(/\/view$/);
    const decoded = JSON.parse(atob(url.searchParams.get('ui').replace(/-/g, '+').replace(/_/g, '/')));
    expect(decoded).toEqual({ D: { T: { A: rooms[1].canvaDoorPageId } } });

    expect(buildCanvaReturnUrl({ canvaUrl: '' }, rooms[1])).toBe('');
    const custom = buildContentFromSheets({ rooms: [{ ruang: '2', link_kembali: 'https://canva.link/abc' }] });
    expect(buildCanvaReturnUrl(custom.content.settings, custom.content.rooms[2])).toBe('https://canva.link/abc');
  });
});

describe('buildCanvaEmbedUrl', () => {
  it('mengubah link lihat/edit Canva menjadi link embed', () => {
    expect(buildCanvaEmbedUrl({ canvaUrl: 'https://www.canva.com/design/DAX/abc/view?utm_source=x#3' })).toBe(
      'https://www.canva.com/design/DAX/abc/view?embed'
    );
    expect(buildCanvaEmbedUrl({ canvaUrl: 'https://www.canva.com/design/DAX/abc/edit' })).toBe(
      'https://www.canva.com/design/DAX/abc/view?embed'
    );
  });

  it('kosong bila link tidak diisi atau bukan link desain Canva', () => {
    expect(buildCanvaEmbedUrl({ canvaUrl: '' })).toBe('');
    expect(buildCanvaEmbedUrl({ canvaUrl: 'https://example.com/design/a/b' })).toBe('');
    expect(buildCanvaEmbedUrl({ canvaUrl: 'bukan link' })).toBe('');
  });
});
