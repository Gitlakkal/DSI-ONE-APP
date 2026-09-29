import React from 'react';

interface DsiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  inverted?: boolean;
  className?: string;
}

export const DsiLogo: React.FC<DsiLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  inverted = false,
  className = '',
}) => {
  const heightClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  };

  const primaryNavy = inverted ? '#FFFFFF' : '#001A70';
  const subtitleColor = inverted ? '#E2E8F0' : '#001A70';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 280 92"
        className={`${heightClasses[size]} w-auto object-contain overflow-visible`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Flame / Oil Droplet Gradient exactly matching Logo.png */}
          <radialGradient
            id="dsiOilFlame"
            cx="45%"
            cy="35%"
            r="65%"
            fx="35%"
            fy="25%"
          >
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="25%" stopColor="#FFD54F" />
            <stop offset="65%" stopColor="#FFA000" />
            <stop offset="100%" stopColor="#E65100" />
          </radialGradient>
        </defs>

        {/* --- D --- */}
        {/* Outer D with smooth rounded right edge */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 14H60C78 14 96 22 96 40C96 58 78 66 60 66H6V14ZM21 28V52H58C68 52 79 48 79 40C79 32 68 28 58 28H21Z"
          fill={primaryNavy}
        />

        {/* --- S --- */}
        {/* Dynamic aerodynamic futuristic DSI "S" */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M125 14H182C194 14 204 22 204 32C204 38 200 43 194 46C186 49 175 49 160 50C142 51 138 53 138 56C138 58 142 60 152 60H198C202 60 205 63 205 66C205 66 205 66 205 66H148C134 66 122 59 122 48C122 42 126 37 132 34C140 31 152 31 166 30C182 29 187 27 187 24C187 22 183 20 174 20H130C126 20 123 17 123 14H125Z"
          fill={primaryNavy}
        />
        {/* Under-bar of S */}
        <path
          d="M106 48H122V66H106V48Z"
          fill={primaryNavy}
        />
        <path
          d="M106 60H205V66H106V60Z"
          fill={primaryNavy}
        />

        {/* --- I --- */}
        {/* Main column of "I" */}
        <rect
          x="215"
          y="28"
          width="17"
          height="38"
          rx="1"
          fill={primaryNavy}
        />

        {/* Amber-Gold Oil Droplet / Flame on top of "I" */}
        <path
          d="M223.5 2C223.5 2 216 13 216 18.5C216 22.64 219.36 26 223.5 26C227.64 26 231 22.64 231 18.5C231 13 223.5 2 223.5 2Z"
          fill="url(#dsiOilFlame)"
        />
        {/* Specular inner highlight on the droplet */}
        <ellipse
          cx="221.8"
          cy="16.5"
          rx="2.2"
          ry="3.8"
          transform="rotate(-20 221.8 16.5)"
          fill="#FFFFFF"
          opacity="0.65"
        />

        {/* --- DESERT SIDES INTERNATIONAL SUBTITLE --- */}
        {showSubtitle && (
          <text
            x="6"
            y="84"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="10.8"
            letterSpacing="2.8"
            fill={subtitleColor}
          >
            DESERT SIDES INTERNATIONAL
          </text>
        )}
      </svg>
    </div>
  );
};
