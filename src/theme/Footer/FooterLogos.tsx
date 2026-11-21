import React from 'react';

export function CncfWordmark({ className = 'h-10 w-auto' }: { className?: string }): JSX.Element {
  return (
    <svg
      viewBox="0 0 236 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Cloud Native Computing Foundation">
      {/* CNCF official corner brackets (#0086FF) */}
      <path d="M2 2H16V9.5H9.5V16H2V2Z" fill="#0086FF" />
      <path d="M30 2H44V16H36.5V9.5H30V2Z" fill="#0086FF" />
      <path d="M2 30H9.5V36.5H16V44H2V30Z" fill="#0086FF" />
      <path d="M36.5 30H44V44H30V36.5H36.5V30Z" fill="#0086FF" />
      {/* CNCF official inner bars & 4 diagonal tabs (#00D2FF) */}
      <rect x="16" y="2" width="14" height="7.5" fill="#00D2FF" />
      <polygon points="16,9.5 22.5,9.5 30,17 23.5,17" fill="#00D2FF" />
      <rect x="36.5" y="16" width="7.5" height="14" fill="#00D2FF" />
      <polygon points="36.5,30 36.5,23.5 29,16 29,22.5" fill="#00D2FF" />
      <rect x="2" y="16" width="7.5" height="14" fill="#00D2FF" />
      <polygon points="9.5,16 9.5,22.5 17,30 17,23.5" fill="#00D2FF" />
      <rect x="16" y="36.5" width="14" height="7.5" fill="#00D2FF" />
      <polygon points="30,36.5 23.5,36.5 16,29 22.5,29" fill="#00D2FF" />
      {/* Wordmark */}
      <text
        x="56"
        y="21"
        fill="#FFFFFF"
        fontFamily="Montserrat, ui-sans-serif, system-ui, sans-serif"
        fontSize="12.5"
        fontWeight="800"
        letterSpacing="0.06em">
        CLOUD NATIVE
      </text>
      <text
        x="56"
        y="34"
        fill="#FFFFFF"
        fillOpacity="0.9"
        fontFamily="Montserrat, ui-sans-serif, system-ui, sans-serif"
        fontSize="8.8"
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

export function OciWordmark({ className = 'h-10 w-auto' }: { className?: string }): JSX.Element {
  return (
    <svg
      viewBox="0 0 192 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Open Container Initiative">
      {/* OCI official frame (#003764) with transparent inner field and C + i mark */}
      <rect x="5" y="5" width="34" height="34" stroke="#003764" strokeWidth="6" />
      <path d="M11 11H25V16.5H16.5V27.5H25V33H11V11Z" fill="#FFFFFF" />
      <rect x="27.5" y="11" width="5.5" height="5.5" fill="#003764" />
      <rect x="27.5" y="19.5" width="5.5" height="13.5" fill="#003764" />
      <text
        x="52"
        y="20"
        fill="#FFFFFF"
        fontFamily="Montserrat, ui-sans-serif, system-ui, sans-serif"
        fontSize="11"
        fontWeight="800"
        letterSpacing="0.06em">
        OPEN CONTAINER
      </text>
      <text
        x="52"
        y="33"
        fill="#FFFFFF"
        fillOpacity="0.9"
        fontFamily="Montserrat, ui-sans-serif, system-ui, sans-serif"
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="0.12em">
        INITIATIVE
      </text>
    </svg>
  );
}
