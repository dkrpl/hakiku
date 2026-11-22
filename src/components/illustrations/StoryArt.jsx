import React from 'react';

export function HakikuCrest({ className = 'w-10 h-10' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="48"
      height="48"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="4" width="40" height="40" rx="11" fill="#186A42" stroke="#14261C" strokeWidth="3" />
      <path
        d="M11 30c4-2.5 8.5-2.5 13 0 4.5-2.5 9-2.5 13 0V16c-4-2-8.5-2-13 0-4.5-2-9-2-13 0v14Z"
        fill="#FBF8F1"
        stroke="#14261C"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <line x1="24" y1="16" x2="24" y2="30" stroke="#14261C" strokeWidth="2.2" />
      <circle cx="24" cy="22" r="5" fill="#F2B705" stroke="#14261C" strokeWidth="2.2" />
      <path d="M24 27v7m0-3h4" stroke="#F2B705" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function RoomLandmarkArt({ roomNumber, className = 'w-20 h-20' }) {
  switch (roomNumber) {
    case 1:
      return (
        <svg viewBox="0 0 96 84" width="96" height="84" className={className} aria-hidden="true">
          <rect x="8" y="68" width="80" height="10" rx="5" fill="#2E9E5B" stroke="#14261C" strokeWidth="2.5" />
          <rect x="20" y="34" width="56" height="36" rx="4" fill="#FBF8F1" stroke="#14261C" strokeWidth="2.8" />
          <polygon points="12,38 48,12 84,38" fill="#155E95" stroke="#14261C" strokeWidth="2.8" strokeLinejoin="round" />
          <rect x="40" y="48" width="16" height="22" rx="3" fill="#F2B705" stroke="#14261C" strokeWidth="2.4" />
          <rect x="26" y="45" width="9" height="10" rx="2" fill="#E6F2FA" stroke="#14261C" strokeWidth="2" />
          <rect x="61" y="45" width="9" height="10" rx="2" fill="#E6F2FA" stroke="#14261C" strokeWidth="2" />
          <circle cx="48" cy="26" r="4.5" fill="#F2B705" stroke="#14261C" strokeWidth="2" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 96 84" width="96" height="84" className={className} aria-hidden="true">
          <rect x="8" y="68" width="80" height="10" rx="5" fill="#2E9E5B" stroke="#14261C" strokeWidth="2.5" />
          <rect x="16" y="24" width="32" height="40" rx="6" fill="#E6F2FA" stroke="#14261C" strokeWidth="2.8" transform="rotate(-7 32 44)" />
          <rect x="46" y="22" width="34" height="42" rx="6" fill="#E6F4EC" stroke="#14261C" strokeWidth="2.8" transform="rotate(7 63 43)" />
          <path d="M24 38h14m-14 8h10" stroke="#155E95" strokeWidth="3" strokeLinecap="round" />
          <path d="M56 38h14m-14 8h11" stroke="#186A42" strokeWidth="3" strokeLinecap="round" />
          <circle cx="48" cy="56" r="10" fill="#F2B705" stroke="#14261C" strokeWidth="2.5" />
          <path d="M44 56l2.8 2.8 5.2-5.6" fill="none" stroke="#14261C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 96 84" width="96" height="84" className={className} aria-hidden="true">
          <rect x="8" y="68" width="80" height="10" rx="5" fill="#2E9E5B" stroke="#14261C" strokeWidth="2.5" />
          <rect x="20" y="34" width="56" height="36" rx="4" fill="#FEF5D6" stroke="#14261C" strokeWidth="2.8" />
          <polygon points="14,36 48,14 82,36" fill="#F2B705" stroke="#14261C" strokeWidth="2.8" strokeLinejoin="round" />
          <rect x="30" y="45" width="36" height="18" rx="3" fill="#FFFFFF" stroke="#14261C" strokeWidth="2.2" />
          <path d="M36 51h24M36 57h17" stroke="#186A42" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 96 84" width="96" height="84" className={className} aria-hidden="true">
          <rect x="8" y="62" width="80" height="14" rx="7" fill="#3698D8" stroke="#14261C" strokeWidth="2.5" />
          <path d="M14 58 Q48 20 82 58 L82 68 Q48 40 14 68 Z" fill="#FBF8F1" stroke="#14261C" strokeWidth="2.8" strokeLinejoin="round" />
          <line x1="32" y1="45" x2="32" y2="59" stroke="#14261C" strokeWidth="2.5" />
          <line x1="48" y1="39" x2="48" y2="54" stroke="#14261C" strokeWidth="2.5" />
          <line x1="64" y1="45" x2="64" y2="59" stroke="#14261C" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="9" fill="#2E9E5B" stroke="#14261C" strokeWidth="2.4" />
          <circle cx="72" cy="24" r="9" fill="#F2B705" stroke="#14261C" strokeWidth="2.4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 96 84" width="96" height="84" className={className} aria-hidden="true">
          <rect x="8" y="68" width="80" height="10" rx="5" fill="#2E9E5B" stroke="#14261C" strokeWidth="2.5" />
          <rect x="30" y="28" width="36" height="42" rx="4" fill="#FBF8F1" stroke="#14261C" strokeWidth="2.8" />
          <polygon points="24,32 48,12 72,32" fill="#186A42" stroke="#14261C" strokeWidth="2.8" strokeLinejoin="round" />
          <line x1="48" y1="12" x2="48" y2="4" stroke="#14261C" strokeWidth="2.6" strokeLinecap="round" />
          <polygon points="48,4 66,9 48,14" fill="#F2B705" stroke="#14261C" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M40 70V52a8 8 0 0 1 16 0v18Z" fill="#F2B705" stroke="#14261C" strokeWidth="2.4" />
          <circle cx="48" cy="39" r="5" fill="#E6F2FA" stroke="#14261C" strokeWidth="2.2" />
        </svg>
      );
  }
}

export function SortCardArt({ artKey, className = 'w-12 h-12' }) {
  switch (artKey) {
    case 'lesson':
      return (
        <svg viewBox="0 0 48 48" width="48" height="48" className={className} aria-hidden="true">
          <rect x="6" y="8" width="36" height="24" rx="4" fill="#186A42" stroke="#14261C" strokeWidth="2.5" />
          <path d="M13 17h14M13 23h20" stroke="#FBF8F1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16 32l-4 8m20-8l4 8" stroke="#14261C" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      );
    case 'piket':
      return (
        <svg viewBox="0 0 48 48" width="48" height="48" className={className} aria-hidden="true">
          <line x1="16" y1="8" x2="29" y2="30" stroke="#7A4D00" strokeWidth="4" strokeLinecap="round" />
          <path d="M23 30l13-7 5 11-16 6-2-10Z" fill="#F2B705" stroke="#14261C" strokeWidth="2.4" strokeLinejoin="round" />
          <line x1="28" y1="32" x2="31" y2="39" stroke="#14261C" strokeWidth="2" />
          <line x1="33" y1="29" x2="36" y2="36" stroke="#14261C" strokeWidth="2" />
        </svg>
      );
    case 'love':
      return (
        <svg viewBox="0 0 48 48" width="48" height="48" className={className} aria-hidden="true">
          <path
            d="M24 39S9 29.5 9 18.5A8.5 8.5 0 0 1 24 13a8.5 8.5 0 0 1 15 5.5C39 29.5 24 39 24 39Z"
            fill="#F2B705"
            stroke="#14261C"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <circle cx="19" cy="19" r="3" fill="#FFFFFF" />
          <circle cx="29" cy="19" r="3" fill="#FFFFFF" />
        </svg>
      );
    case 'tidy':
      return (
        <svg viewBox="0 0 48 48" width="48" height="48" className={className} aria-hidden="true">
          <rect x="6" y="22" width="36" height="14" rx="4" fill="#E6F2FA" stroke="#14261C" strokeWidth="2.5" />
          <rect x="10" y="15" width="12" height="8" rx="3" fill="#FFFFFF" stroke="#14261C" strokeWidth="2.3" />
          <rect x="24" y="22" width="18" height="14" rx="3" fill="#2E9E5B" stroke="#14261C" strokeWidth="2.5" />
          <line x1="10" y1="36" x2="10" y2="41" stroke="#14261C" strokeWidth="3" strokeLinecap="round" />
          <line x1="38" y1="36" x2="38" y2="41" stroke="#14261C" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'play':
      return (
        <svg viewBox="0 0 48 48" width="48" height="48" className={className} aria-hidden="true">
          <circle cx="24" cy="24" r="15" fill="#F2B705" stroke="#14261C" strokeWidth="2.6" />
          <path d="M12 16c6 4 18 4 24 0" fill="none" stroke="#14261C" strokeWidth="2.2" />
          <path d="M12 32c6-4 18-4 24 0" fill="none" stroke="#14261C" strokeWidth="2.2" />
          <line x1="24" y1="9" x2="24" y2="39" stroke="#14261C" strokeWidth="2.2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" width="48" height="48" className={className} aria-hidden="true">
          <rect x="13" y="16" width="22" height="24" rx="3" fill="#2E9E5B" stroke="#14261C" strokeWidth="2.5" />
          <rect x="10" y="11" width="28" height="5" rx="2" fill="#186A42" stroke="#14261C" strokeWidth="2.4" />
          <path d="M19 11V8h10v3" fill="none" stroke="#14261C" strokeWidth="2.4" />
          <line x1="20" y1="22" x2="20" y2="34" stroke="#FBF8F1" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="28" y1="22" x2="28" y2="34" stroke="#FBF8F1" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
  }
}

export function GoldenKeyArt({ className = 'w-24 h-24' }) {
  return (
    <svg viewBox="0 0 112 112" width="112" height="112" className={className} aria-hidden="true">
      <circle cx="56" cy="56" r="48" fill="#FEF5D6" stroke="#14261C" strokeWidth="3.5" />
      <circle cx="38" cy="56" r="16" fill="#F2B705" stroke="#14261C" strokeWidth="3.5" />
      <circle cx="38" cy="56" r="5.5" fill="#FEF5D6" stroke="#14261C" strokeWidth="2.8" />
      <path d="M54 56H86" stroke="#14261C" strokeWidth="7" strokeLinecap="round" />
      <path d="M54 56H86" stroke="#F2B705" strokeWidth="3" strokeLinecap="round" />
      <path d="M72 56v13m10-13v10" stroke="#14261C" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M72 56v11m10-11v8" stroke="#F2B705" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function TrophyFinaleArt({ className = 'w-32 h-32' }) {
  return (
    <svg viewBox="0 0 140 132" width="140" height="132" className={className} aria-hidden="true">
      <circle cx="70" cy="64" r="54" fill="#E6F4EC" stroke="#14261C" strokeWidth="3.5" />
      <path d="M40 36H26c0 16 8 24 18 24" fill="none" stroke="#14261C" strokeWidth="4" strokeLinecap="round" />
      <path d="M100 36h14c0 16-8 24-18 24" fill="none" stroke="#14261C" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M42 28h56v24c0 18-12 30-28 30S42 70 42 52V28Z"
        fill="#F2B705"
        stroke="#14261C"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <rect x="61" y="82" width="18" height="14" fill="#C99000" stroke="#14261C" strokeWidth="3" />
      <rect x="44" y="96" width="52" height="14" rx="5" fill="#186A42" stroke="#14261C" strokeWidth="3.5" />
      <circle cx="70" cy="52" r="11" fill="#FEF5D6" stroke="#14261C" strokeWidth="2.8" />
      <path d="M65 52l3.5 3.5 7-7" fill="none" stroke="#186A42" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
