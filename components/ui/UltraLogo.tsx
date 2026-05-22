interface UltraLogoProps {
  size?: number;
  className?: string;
}

export function UltraLogo({ size = 44, className = '' }: UltraLogoProps) {
  // Dot heart/arrow pattern — rows from top to bottom
  const dots = [
    // Row 1: 2+2 (top of heart)
    [31, 68], [39, 68],   [57, 68], [65, 68],
    // Row 2: 3+3
    [27, 76], [35, 76], [43, 76],   [53, 76], [61, 76], [69, 76],
    // Row 3: 7 full width
    [27, 84], [35, 84], [43, 84], [48, 84], [53, 84], [61, 84], [69, 84],
    // Row 4: 6
    [31, 92], [39, 92], [46, 92], [50, 92], [58, 92], [65, 92],
    // Row 5: 5
    [35, 100], [42, 100], [48, 100], [54, 100], [62, 100],
    // Row 6: 3
    [39, 108], [48, 108], [57, 108],
    // Row 7: 1 (tip)
    [48, 116],
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ULTRA belleza logo"
    >
      {/* Circle background */}
      <circle cx="48" cy="48" r="47" fill="#E8621A" />

      {/* ULTRA text */}
      <text
        x="48"
        y="54"
        textAnchor="middle"
        fill="white"
        fontSize="28"
        fontWeight="900"
        fontFamily="'Arial Black', 'Impact', Arial, sans-serif"
        letterSpacing="-0.5"
      >
        ULTRA
      </text>

      {/* Dot heart — scale down to fit inside circle */}
      <g transform="translate(-0, -62) scale(0.72) translate(14, 0)">
        {dots.map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="4" fill="white" opacity="0.9" />
            <circle cx={cx} cy={cy} r="1.8" fill="#E8621A" />
          </g>
        ))}
      </g>
    </svg>
  );
}

// Horizontal version for wider spaces
export function UltraLogoHorizontal({ height = 36 }: { height?: number }) {
  return (
    <span
      className="inline-flex items-center gap-2 font-black uppercase tracking-tight"
      style={{ fontSize: height * 0.7 }}
      aria-label="ULTRA belleza"
    >
      <UltraLogo size={height} />
    </span>
  );
}
