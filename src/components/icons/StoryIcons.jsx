import React from 'react';

const baseProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2.25',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

export function VolumeOnIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <polygon points="11 5 6 9 3 9 3 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.16" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}

export function VolumeOffIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <polygon points="11 5 6 9 3 9 3 15 6 15 11 19 11 5" />
      <line x1="21" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="21" y2="15" />
    </svg>
  );
}

export function GearIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <circle cx="12" cy="12" r="3.25" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.08-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.08 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.04a1.7 1.7 0 0 0 1-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.04a1.7 1.7 0 0 0 1.56 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.04Z" />
    </svg>
  );
}

export function LockIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <rect x="4.5" y="11" width="15" height="10" rx="2.5" fill="currentColor" fillOpacity="0.12" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
      <circle cx="12" cy="16" r="1.25" fill="currentColor" />
    </svg>
  );
}

export function KeyIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <circle cx="8" cy="12" r="4.25" fill="#F2B705" stroke="currentColor" />
      <path d="M12.25 12H21" />
      <path d="M17.5 12v3.5" />
      <path d="M20.5 12v2.75" />
    </svg>
  );
}

export function MapIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <polygon points="3 6.5 9 4 15 6.5 21 4 21 17.5 15 20 9 17.5 3 20 3 6.5" />
      <line x1="9" y1="4" x2="9" y2="17.5" />
      <line x1="15" y1="6.5" x2="15" y2="20" />
    </svg>
  );
}

export function BackIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function NextIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function CheckCircleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <circle cx="12" cy="12" r="9.5" fill="currentColor" fillOpacity="0.12" />
      <path d="M8.25 12.25 10.75 14.75 16 9.5" />
    </svg>
  );
}

export function AlertIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="M10.3 3.9 2.6 17.5A1.8 1.8 0 0 0 4.2 20h15.6a1.8 1.8 0 0 0 1.6-2.5L13.7 3.9a1.9 1.9 0 0 0-3.4 0Z" />
      <line x1="12" y1="9" x2="12" y2="13.5" />
      <circle cx="12" cy="16.75" r="0.85" fill="currentColor" />
    </svg>
  );
}

export function ExternalLinkIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 13.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V7.5A1.5 1.5 0 0 1 5.5 6H11" />
    </svg>
  );
}

export function CloseIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function ResetIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="M4 12a8 8 0 1 0 2.35-5.65L4 8.7" />
      <polyline points="4 4 4 8.7 8.7 8.7" />
    </svg>
  );
}
