// Pembaca CSV kecil (mendukung tanda kutip, koma dan baris baru di dalam sel).

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  const src = String(text ?? '').replace(/^﻿/, '');

  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];

    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }

  if (cell !== '' || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((r) => r.some((c) => String(c).trim() !== ''));
}

export function normalizeHeader(name) {
  return String(name ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

// Mengubah CSV menjadi daftar objek berdasarkan baris judul kolom.
export function csvToObjects(text) {
  const [header, ...body] = parseCsv(text);
  if (!header) return [];
  const keys = header.map(normalizeHeader);
  return body.map((cells) => {
    const obj = {};
    keys.forEach((key, idx) => {
      if (key) obj[key] = String(cells[idx] ?? '').trim();
    });
    return obj;
  });
}
