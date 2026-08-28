import { useMemo } from "react";

interface PowerRingProps {
  /** 0-100 overall progress */
  progress: number;
  /** Size in px */
  size?: number;
  /** Subject-specific progress for gem colors */
  subjectProgress?: Record<string, number>;
  className?: string;
}

const GEM_COLORS = [
  { fill: "#e74c3c", glow: "#ff6b6b" }, // Red
  { fill: "#e91e9c", glow: "#ff69d2" }, // Pink
  { fill: "#9b59b6", glow: "#c084fc" }, // Purple
  { fill: "#3498db", glow: "#60a5fa" }, // Blue
  { fill: "#1abc9c", glow: "#2dd4bf" }, // Teal
  { fill: "#2ecc71", glow: "#34d399" }, // Green
  { fill: "#f1c40f", glow: "#fbbf24" }, // Yellow
  { fill: "#e67e22", glow: "#fb923c" }, // Orange
];

const SUBJECT_GEMS: Record<string, number> = {
  Math: 0,
  Science: 1,
  History: 2,
  English: 3,
  "General Knowledge": 4,
  "Computer Science": 5,
};

export default function PowerRing({
  progress,
  size = 240,
  subjectProgress = {},
  className = "",
}: PowerRingProps) {
  const gems = useMemo(() => {
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size / 2 - 8;
    const innerR = outerR - 18;
    const gemCount = GEM_COLORS.length;
    const segmentAngle = (2 * Math.PI) / gemCount;
    const gap = 0.03;

    return GEM_COLORS.map((color, i) => {
      const startAngle = i * segmentAngle - Math.PI / 2 + gap;
      const endAngle = (i + 1) * segmentAngle - Math.PI / 2 - gap;

      const outerX1 = cx + outerR * Math.cos(startAngle);
      const outerY1 = cy + outerR * Math.sin(startAngle);
      const outerX2 = cx + outerR * Math.cos(endAngle);
      const outerY2 = cy + outerR * Math.sin(endAngle);
      const innerX1 = cx + innerR * Math.cos(endAngle);
      const innerY1 = cy + innerR * Math.sin(endAngle);
      const innerX2 = cx + innerR * Math.cos(startAngle);
      const innerY2 = cy + innerR * Math.sin(startAngle);

      const largeArc = segmentAngle - 2 * gap > Math.PI ? 1 : 0;

      const path = [
        `M ${outerX1} ${outerY1}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerX2} ${outerY2}`,
        `L ${innerX1} ${innerY1}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerX2} ${innerY2}`,
        "Z",
      ].join(" ");

      // Find subject for this gem
      const subjectEntry = Object.entries(SUBJECT_GEMS).find(([, idx]) => idx === i);
      const subject = subjectEntry?.[0] || "";
      const gemProgress = subjectProgress[subject] || 0;
      const isActive = gemProgress > 0;
      const isFull = gemProgress >= 100;

      return { path, color, isActive, isFull, gemProgress };
    });
  }, [size, subjectProgress]);

  const cx = size / 2;
  const cy = size / 2;
  const ringR = size / 2 - 26;
  const strokeDash = 2 * Math.PI * ringR;
  const strokeOffset = strokeDash * (1 - progress / 100);

  return (
    <div className={`power-ring-container ${className}`} style={{ width: size, height: size }}>
      <div className="power-ring-glow" />
      <div className="power-ring-frame" />
      <div className="power-ring-center-glow" />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative z-10">
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={ringR}
          fill="none"
          stroke="oklch(0.88 0.03 85)"
          strokeWidth="8"
          opacity="0.5"
        />

        {/* Progress ring */}
        <circle
          cx={cx}
          cy={cy}
          r={ringR}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDash}
          strokeDashoffset={strokeOffset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
          transform={`rotate(-90 ${cx} ${cy})`}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#1abc9c" />
            <stop offset="100%" stopColor="#9b59b6" />
          </linearGradient>
          {gems.map((gem, i) => (
            <filter key={`glow-${i}`} id={`gemGlow-${i}`}>
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Gem segments */}
        {gems.map((gem, i) => (
          <g key={i}>
            <path
              d={gem.path}
              fill={gem.isActive ? gem.color.fill : "oklch(0.88 0.03 85)"}
              stroke={gem.isActive ? gem.color.glow : "oklch(0.82 0.03 85)"}
              strokeWidth="1"
              opacity={gem.isActive ? 1 : 0.3}
              filter={gem.isFull ? `url(#gemGlow-${i})` : undefined}
              style={{ transition: "all 0.5s ease" }}
            />
            {/* Gem highlight */}
            {gem.isActive && (
              <path
                d={gem.path}
                fill="white"
                opacity="0.15"
              />
            )}
          </g>
        ))}

        {/* Center glow */}
        <circle
          cx={cx}
          cy={cy}
          r={size / 2 - 36}
          fill="url(#centerGlow)"
          opacity={progress > 0 ? 0.6 : 0.2}
        />
        <defs>
          <radialGradient id="centerGlow">
            <stop offset="0%" stopColor="oklch(0.85 0.12 85 / 0.8)" />
            <stop offset="50%" stopColor="oklch(0.80 0.10 190 / 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Center text */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill="oklch(0.35 0.06 80)"
          fontSize={size * 0.12}
          fontWeight="bold"
          fontFamily="system-ui"
        >
          {Math.round(progress)}%
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="oklch(0.50 0.03 60)"
          fontSize={size * 0.05}
          fontFamily="system-ui"
        >
          Ring Power
        </text>
      </svg>
    </div>
  );
}
