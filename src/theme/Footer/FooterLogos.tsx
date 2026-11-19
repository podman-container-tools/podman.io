import React from 'react';

export function CncfWordmark({ className = 'h-8 w-auto' }: { className?: string }): JSX.Element {
  return (
    <svg
      viewBox="0 0 232 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Cloud Native Computing Foundation">
      {/* CNCF official corner brackets (#0086FF) */}
      <path d="M2 2H13V8H8V13H2V2Z" fill="#0086FF" />
      <path d="M23 2H34V13H28V8H23V2Z" fill="#0086FF" />
      <path d="M2 23H8V28H13V34H2V23Z" fill="#0086FF" />
      <path d="M28 23H34V34H23V28H28V23Z" fill="#0086FF" />
      {/* CNCF official inner bars & diagonals (#93EAFF) */}
      <rect x="13" y="2" width="10" height="6" fill="#93EAFF" />
      <rect x="28" y="13" width="6" height="10" fill="#93EAFF" />
      <rect x="2" y="13" width="6" height="10" fill="#93EAFF" />
      <rect x="13" y="28" width="10" height="6" fill="#93EAFF" />
      <polygon points="13,8 19,8 28,17 28,23" fill="#93EAFF" />
      <polygon points="8,13 8,19 17,28 23,28" fill="#93EAFF" />
      {/* Wordmark */}
      <text
        x="46"
        y="17"
        fill="#FFFFFF"
        fontFamily="Montserrat, ui-sans-serif, system-ui, sans-serif"
        fontSize="13.5"
        fontWeight="800"
        letterSpacing="0.06em">
        CLOUD NATIVE
      </text>
      <text
        x="46"
        y="31"
        fill="#FFFFFF"
        fillOpacity="0.9"
        fontFamily="Montserrat, ui-sans-serif, system-ui, sans-serif"
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="0.09em">
        COMPUTING FOUNDATION
      </text>
    </svg>
  );
}

export function LfxWordmark({ className = 'h-7 w-auto' }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 134 34" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="LFX">
      {/* LFX square mark */}
      <path d="M0 2H36V32H22V25H29V9H7V13H0V2Z" fill="#FFFFFF" />
      <path d="M0 16H7V25H19V32H0V16Z" fill="#0094FF" />
      {/* L */}
      <path d="M44 2H52V25H67V32H44V2Z" fill="#FFFFFF" />
      {/* F */}
      <path d="M73 2H96V9H81V14H93V21H81V32H73V2Z" fill="#FFFFFF" />
      {/* X */}
      <path d="M101 2H110L116.5 12L123 2H132L121.5 17L132 32H123L116.5 22L110 32H101L111.5 17L101 2Z" fill="#0094FF" />
    </svg>
  );
}

export function OciWordmark({ className = 'h-8 w-auto' }: { className?: string }): JSX.Element {
  return (
    <svg
      viewBox="0 0 185 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Open Container Initiative">
      <rect x="4" y="6" width="28" height="28" rx="3" stroke="#FFFFFF" strokeWidth="3.5" />
      <rect x="11" y="13" width="14" height="14" rx="1.5" fill="#00B5E2" />
      <text
        x="42"
        y="17"
        fill="#FFFFFF"
        fontFamily="Montserrat, ui-sans-serif, system-ui, sans-serif"
        fontSize="11.5"
        fontWeight="800"
        letterSpacing="0.06em">
        OPEN CONTAINER
      </text>
      <text
        x="42"
        y="31"
        fill="#FFFFFF"
        fillOpacity="0.9"
        fontFamily="Montserrat, ui-sans-serif, system-ui, sans-serif"
        fontSize="10"
        fontWeight="600"
        letterSpacing="0.12em">
        INITIATIVE
      </text>
    </svg>
  );
}
