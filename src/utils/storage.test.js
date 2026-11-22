import { describe, it, expect } from 'vitest';
import {
  STORAGE_KEY,
  createDefaultState,
  loadState,
  saveState,
  isRoomUnlocked,
  isFinaleAccessible,
  countCompletedRooms,
  validateHttpUrl,
  parseYoutubeEmbedUrl,
  matchesSecretCode,
} from './storage';

function makeMemoryStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, val) {
      store[key] = String(val);
    },
  };
}

describe('HAKIKU storage and state rules', () => {
  it('starts with only Room 1 unlocked and 0 completed rooms', () => {
    const state = createDefaultState();

    expect(countCompletedRooms(state)).toBe(0);
    expect(isRoomUnlocked(state, 1)).toBe(true);
    expect(isRoomUnlocked(state, 2)).toBe(false);
    expect(isRoomUnlocked(state, 3)).toBe(false);
    expect(isRoomUnlocked(state, 4)).toBe(false);
    expect(isRoomUnlocked(state, 5)).toBe(false);
    expect(isFinaleAccessible(state)).toBe(false);
  });

  it('enforces contiguous sequential room locking when Demo Mode is off', () => {
    const state = createDefaultState();
    state.completedRooms.room1 = true;

    expect(isRoomUnlocked(state, 2)).toBe(true);
    expect(isRoomUnlocked(state, 3)).toBe(false);

    // Non-contiguous completion made earlier in Demo Mode must NOT bypass Room 2 lock chain
    state.completedRooms.room4 = true;
    state.completedRooms.room5 = true;
    expect(isRoomUnlocked(state, 3)).toBe(false);
    expect(isRoomUnlocked(state, 5)).toBe(false);
    expect(isFinaleAccessible(state)).toBe(true);
  });

  it('unlocks all rooms and Finale preview while Demo Mode Sidang is on', () => {
    const state = createDefaultState();
    state.teacherSettings.demoUnlockAll = true;

    for (const num of [1, 2, 3, 4, 5]) {
      expect(isRoomUnlocked(state, num)).toBe(true);
    }
    expect(isFinaleAccessible(state)).toBe(true);
  });

  it('recovers cleanly from corrupted or partial JSON in storage', () => {
    const brokenStorage = makeMemoryStorage({ [STORAGE_KEY]: '{not valid json' });
    const recovered = loadState(brokenStorage);
    expect(recovered.state).toEqual(createDefaultState());
    expect(recovered.storageError).toBe(false);

    const partialStorage = makeMemoryStorage({
      [STORAGE_KEY]: JSON.stringify({
        completedRooms: { room1: true },
        teacherSettings: { blooketUrl: 'javascript:alert(1)' },
      }),
    });
    const partial = loadState(partialStorage);
    expect(partial.state.completedRooms.room1).toBe(true);
    expect(partial.state.completedRooms.room2).toBe(false);
    // Unsafe persisted URL falls back to safe default
    expect(partial.state.teacherSettings.blooketUrl.startsWith('https://')).toBe(true);
  });

  it('handles storage read/write exceptions gracefully without throwing', () => {
    const blockedStorage = {
      getItem() {
        throw new Error('SecurityError');
      },
      setItem() {
        throw new Error('QuotaExceededError');
      },
    };

    const loaded = loadState(blockedStorage);
    expect(loaded.storageError).toBe(true);
    expect(loaded.state).toEqual(createDefaultState());

    const saved = saveState(loaded.state, blockedStorage);
    expect(saved.ok).toBe(false);
  });

  it('validates HTTP/HTTPS URLs and rejects javascript or malformed URLs', () => {
    expect(validateHttpUrl('https://play.blooket.com/play?id=123')).toEqual({
      valid: true,
      url: 'https://play.blooket.com/play?id=123',
      error: '',
    });
    expect(validateHttpUrl('javascript:alert(1)').valid).toBe(false);
    expect(validateHttpUrl('ftp://example.com').valid).toBe(false);
    expect(validateHttpUrl('   ').valid).toBe(false);
    expect(validateHttpUrl('not a url').valid).toBe(false);
  });

  it('parses standard YouTube watch, short, embed URLs, and raw 11-char IDs', () => {
    expect(parseYoutubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toEqual({
      valid: true,
      videoId: 'dQw4w9WgXcQ',
      embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0',
      watchUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      error: '',
    });
    expect(parseYoutubeEmbedUrl('https://youtu.be/abcDEF123_-').videoId).toBe('abcDEF123_-');
    expect(parseYoutubeEmbedUrl('https://www.youtube.com/embed/abcDEF123_-').videoId).toBe(
      'abcDEF123_-'
    );
    expect(parseYoutubeEmbedUrl('abcDEF123_-').videoId).toBe('abcDEF123_-');
    expect(parseYoutubeEmbedUrl('javascript:alert(1)').valid).toBe(false);
    expect(parseYoutubeEmbedUrl('').valid).toBe(false);
  });

  it('matches secret code case-insensitively with trimmed spaces', () => {
    expect(matchesSecretCode('  hakiku ', 'HAKIKU')).toBe(true);
    expect(matchesSecretCode('HAKIKU', 'hakiku')).toBe(true);
    expect(matchesSecretCode('', 'HAKIKU')).toBe(false);
    expect(matchesSecretCode('SALAH', 'HAKIKU')).toBe(false);
  });
});
