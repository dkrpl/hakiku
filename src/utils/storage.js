import {
  DEFAULT_BLOOKET_URL,
  DEFAULT_SECRET_CODE,
  DEFAULT_YOUTUBE_URL,
} from '../data/hakikuData';

export const STORAGE_KEY = 'hakiku_prototype_state_v1';

const ROOM_KEYS = ['room1', 'room2', 'room3', 'room4', 'room5'];
const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export function createDefaultState() {
  return {
    completedRooms: {
      room1: false,
      room2: false,
      room3: false,
      room4: false,
      room5: false,
    },
    teacherSettings: {
      demoUnlockAll: false,
      blooketUrl: DEFAULT_BLOOKET_URL,
      youtubeUrl: DEFAULT_YOUTUBE_URL,
      secretCode: DEFAULT_SECRET_CODE,
    },
    audioMuted: false,
  };
}

export function validateHttpUrl(raw) {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) {
    return {
      valid: false,
      url: '',
      error: 'URL tidak boleh kosong. Masukkan tautan yang diawali https:// atau http://.',
    };
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return {
        valid: false,
        url: '',
        error: 'Gunakan alamat web yang diawali https:// atau http://.',
      };
    }
    if (!parsed.hostname) {
      return {
        valid: false,
        url: '',
        error: 'Format alamat web belum lengkap. Periksa kembali tautan yang dimasukkan.',
      };
    }
    return { valid: true, url: parsed.toString(), error: '' };
  } catch {
    return {
      valid: false,
      url: '',
      error: 'Format URL tidak valid. Contoh: https://play.blooket.com/play',
    };
  }
}

export function parseYoutubeEmbedUrl(raw) {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) {
    return {
      valid: false,
      videoId: '',
      embedUrl: '',
      watchUrl: '',
      error: 'Tautan video YouTube tidak boleh kosong.',
    };
  }

  let videoId = '';

  if (YOUTUBE_ID_PATTERN.test(trimmed)) {
    videoId = trimmed;
  } else {
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        return {
          valid: false,
          videoId: '',
          embedUrl: '',
          watchUrl: '',
          error: 'Gunakan tautan YouTube yang diawali https://.',
        };
      }
      const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
      if (host === 'youtu.be') {
        videoId = parsed.pathname.split('/').filter(Boolean)[0] ?? '';
      } else if (
        host === 'youtube.com' ||
        host === 'm.youtube.com' ||
        host === 'youtube-nocookie.com'
      ) {
        if (parsed.pathname === '/watch') {
          videoId = parsed.searchParams.get('v') ?? '';
        } else {
          const segments = parsed.pathname.split('/').filter(Boolean);
          if (segments[0] === 'embed' || segments[0] === 'shorts' || segments[0] === 'live') {
            videoId = segments[1] ?? '';
          }
        }
      }
    } catch {
      videoId = '';
    }
  }

  if (!YOUTUBE_ID_PATTERN.test(videoId)) {
    return {
      valid: false,
      videoId: '',
      embedUrl: '',
      watchUrl: '',
      error:
        'Tautan YouTube tidak dikenali. Gunakan link seperti https://www.youtube.com/watch?v=ID_VIDEO.',
    };
  }

  return {
    valid: true,
    videoId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    error: '',
  };
}

export function matchesSecretCode(input, expected) {
  const cleanInput = String(input ?? '').trim().toUpperCase();
  const cleanExpected = String(expected ?? '').trim().toUpperCase();
  return Boolean(cleanExpected) && cleanInput === cleanExpected;
}

export function isRoomUnlocked(state, roomNumber) {
  if (roomNumber <= 1) return true;
  if (roomNumber > ROOM_KEYS.length) return false;
  if (state?.teacherSettings?.demoUnlockAll) return true;

  for (let i = 1; i < roomNumber; i += 1) {
    if (!state?.completedRooms?.[`room${i}`]) {
      return false;
    }
  }
  return true;
}

export function isFinaleAccessible(state) {
  return Boolean(state?.teacherSettings?.demoUnlockAll || state?.completedRooms?.room5);
}

export function countCompletedRooms(state) {
  return ROOM_KEYS.reduce(
    (acc, key) => acc + (state?.completedRooms?.[key] ? 1 : 0),
    0
  );
}

function getDefaultStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function loadState(storage = getDefaultStorage()) {
  const fallback = createDefaultState();
  if (!storage) {
    return { state: fallback, storageError: true };
  }

  let raw = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { state: fallback, storageError: true };
  }

  if (!raw) {
    return { state: fallback, storageError: false };
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { state: fallback, storageError: false };
    }

    const completedRooms = {};
    for (const key of ROOM_KEYS) {
      completedRooms[key] = Boolean(parsed.completedRooms?.[key]);
    }

    const blooketCheck = validateHttpUrl(parsed.teacherSettings?.blooketUrl);
    const youtubeCheck = parseYoutubeEmbedUrl(parsed.teacherSettings?.youtubeUrl);
    const savedSecret = String(parsed.teacherSettings?.secretCode ?? '').trim().toUpperCase();

    return {
      state: {
        completedRooms,
        teacherSettings: {
          demoUnlockAll: Boolean(parsed.teacherSettings?.demoUnlockAll),
          blooketUrl: blooketCheck.valid ? blooketCheck.url : DEFAULT_BLOOKET_URL,
          youtubeUrl: youtubeCheck.valid ? youtubeCheck.watchUrl : DEFAULT_YOUTUBE_URL,
          secretCode: savedSecret || DEFAULT_SECRET_CODE,
        },
        audioMuted: Boolean(parsed.audioMuted),
      },
      storageError: false,
    };
  } catch {
    return { state: fallback, storageError: false };
  }
}

export function saveState(state, storage = getDefaultStorage()) {
  if (!storage) {
    return { ok: false };
  }
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
