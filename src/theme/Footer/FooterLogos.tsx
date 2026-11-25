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
