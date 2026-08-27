import { useState, useEffect, useRef } from "react";

interface MascotCharacterProps {
  color: string;
  size?: number;
  isTalking?: boolean;
  className?: string;
}

/**
 * A cute, simple mascot character built entirely from SVG shapes.
 *
 * - Rounded body/head blob in the companion's theme color
 * - Two eyes that blink every few seconds
 * - A mouth that toggles between open (oval) and closed (line)
 * - Two simple arm shapes on the sides
 *
 * Animations:
 * - Talking: mouth toggles 150-200ms, arms wave, body wiggles
 * - Idle: eyes blink, body breathes, mouth closed, arms still
 */
export default function MascotCharacter({
  color,
  size = 128,
  isTalking = false,
  className = "",
}: MascotCharacterProps) {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const mouthTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blinkTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mouth toggling while talking
  useEffect(() => {
    if (isTalking) {
      mouthTimerRef.current = setInterval(() => {
        setMouthOpen((prev) => !prev);
      }, 170); // ~170ms toggle for natural talking rhythm
    } else {
      setMouthOpen(false);
      if (mouthTimerRef.current) {
        clearInterval(mouthTimerRef.current);
        mouthTimerRef.current = null;
      }
    }
    return () => {
      if (mouthTimerRef.current) {
        clearInterval(mouthTimerRef.current);
      }
    };
  }, [isTalking]);

  // Eye blinking — every 2-5 seconds (randomized)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 3000;
      timeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 150);
      }, delay);
    };

    scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Derived colors
  const bodyLight = adjustBrightness(color, 20);
  const bodyDark = adjustBrightness(color, -15);
  const cheekColor = adjustBrightness(color, 30);

  const viewBox = "0 0 120 130";

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Mascot character"
    >
      <style>{`
        @keyframes mascot-breathe {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.02) translateY(-2px); }
        }
        @keyframes mascot-talk-body {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.01) rotate(-1deg); }
          75% { transform: scale(1.01) rotate(1deg); }
        }
        @keyframes mascot-arm-wave-left {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-18deg); }
        }
        @keyframes mascot-arm-wave-right {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(18deg); }
        }
        .mascot-body-idle {
          animation: mascot-breathe 3.5s ease-in-out infinite;
          transform-origin: 60px 70px;
        }
        .mascot-body-talking {
          animation: mascot-talk-body 0.4s ease-in-out infinite;
          transform-origin: 60px 70px;
        }
        .mascot-arm-left-idle {
          transform-origin: 22px 75px;
          transition: transform 0.3s ease;
        }
        .mascot-arm-left-talking {
          animation: mascot-arm-wave-left 0.5s ease-in-out infinite;
          transform-origin: 22px 75px;
        }
        .mascot-arm-right-idle {
          transform-origin: 98px 75px;
          transition: transform 0.3s ease;
        }
        .mascot-arm-right-talking {
          animation: mascot-arm-wave-right 0.5s ease-in-out infinite 0.1s;
          transform-origin: 98px 75px;
        }
        .mascot-eye-open {
          transition: ry 0.08s ease, cy 0.08s ease;
        }
        .mascot-eye-blink {
          ry: 1.5;
          transition: ry 0.06s ease, cy 0.06s ease;
        }
      `}</style>

      {/* Shadow */}
      <ellipse cx="60" cy="124" rx="28" ry="5" fill="black" opacity="0.1" />

      {/* Left arm */}
      <g
        className={isTalking ? "mascot-arm-left-talking" : "mascot-arm-left-idle"}
      >
        <ellipse
          cx="18"
          cy="78"
          rx="10"
          ry="16"
          fill={bodyLight}
          stroke={bodyDark}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Right arm */}
      <g
        className={
          isTalking ? "mascot-arm-right-talking" : "mascot-arm-right-idle"
        }
      >
        <ellipse
          cx="102"
          cy="78"
          rx="10"
          ry="16"
          fill={bodyLight}
          stroke={bodyDark}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Body / Head blob */}
      <g className={isTalking ? "mascot-body-talking" : "mascot-body-idle"}>
        {/* Main body shape — a slightly squished circle */}
        <ellipse
          cx="60"
          cy="68"
          rx="36"
          ry="40"
          fill={color}
          stroke={bodyDark}
          strokeWidth="1.5"
        />

        {/* Belly highlight */}
        <ellipse
          cx="58"
          cy="60"
          rx="22"
          ry="24"
          fill={bodyLight}
          opacity="0.4"
        />

        {/* Cheeks */}
        <ellipse cx="38" cy="72" rx="7" ry="4" fill={cheekColor} opacity="0.5" />
        <ellipse cx="82" cy="72" rx="7" ry="4" fill={cheekColor} opacity="0.5" />

        {/* Left eye */}
        <ellipse
          cx="47"
          cy="60"
          rx="5"
          ry={isBlinking ? 1.5 : 5.5}
          fill="white"
          className="mascot-eye-open"
        />
        {!isBlinking && (
          <ellipse cx="48" cy="59" rx="2.5" ry="2.8" fill="#1a1a2e" />
        )}
        {!isBlinking && (
          <ellipse cx="49" cy="57.5" rx="1" ry="1" fill="white" />
        )}

        {/* Right eye */}
        <ellipse
          cx="73"
          cy="60"
          rx="5"
          ry={isBlinking ? 1.5 : 5.5}
          fill="white"
          className="mascot-eye-open"
        />
        {!isBlinking && (
          <ellipse cx="74" cy="59" rx="2.5" ry="2.8" fill="#1a1a2e" />
        )}
        {!isBlinking && (
          <ellipse cx="75" cy="57.5" rx="1" ry="1" fill="white" />
        )}

        {/* Mouth */}
        {mouthOpen ? (
          /* Open mouth — oval */
          <ellipse
            cx="60"
            cy="80"
            rx="6"
            ry="5"
            fill="#1a1a2e"
            stroke="#1a1a2e"
            strokeWidth="0.5"
          />
        ) : (
          /* Closed mouth — simple smile line */
          <path
            d="M 53 79 Q 60 85 67 79"
            stroke="#1a1a2e"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </g>

      {/* Feet */}
      <ellipse cx="48" cy="108" rx="10" ry="5" fill={bodyDark} />
      <ellipse cx="72" cy="108" rx="10" ry="5" fill={bodyDark} />
    </svg>
  );
}

/**
 * Simple brightness adjuster — shifts an oklch or hex color lighter/darker.
 * Works with the hex colors used in our theme palette.
 */
function adjustBrightness(hex: string, amount: number): string {
  // If it's not a hex color, return as-is
  if (!hex.startsWith("#")) return hex;

  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
