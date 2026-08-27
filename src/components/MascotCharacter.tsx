import { useState, useEffect, useRef } from "react";

interface MascotCharacterProps {
  color: string;
  size?: number;
  isTalking?: boolean;
  className?: string;
}

/**
 * Cute SVG mascot with state-driven animation — no CSS keyframes.
 *
 * All motion is computed in requestAnimationFrame and applied via
 * inline style transforms, so there's zero conflict with parent
 * Framer Motion wrappers.
 *
 * Talking: mouth toggles ~170ms, arms wave, body wiggles
 * Idle: eyes blink every 2-5s, body breathes gently, mouth closed, arms still
 */
export default function MascotCharacter({
  color,
  size = 128,
  isTalking = false,
  className = "",
}: MascotCharacterProps) {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Animated transform values driven by rAF
  const [bodyTransform, setBodyTransform] = useState("");
  const [leftArmTransform, setLeftArmTransform] = useState("");
  const [rightArmTransform, setRightArmTransform] = useState("");

  const mouthTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Mouth toggling while talking
  useEffect(() => {
    if (isTalking) {
      mouthTimerRef.current = setInterval(() => {
        setMouthOpen((prev) => !prev);
      }, 170);
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

  // Eye blinking — every 2-5 seconds
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

  // rAF animation loop — drives body, arm transforms
  useEffect(() => {
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;

      if (isTalking) {
        // Body: gentle wiggle
        const bodyScale = 1 + Math.sin(elapsed * 6) * 0.02;
        const bodyRotate = Math.sin(elapsed * 8) * 1.5;
        const bodyY = Math.sin(elapsed * 5) * 3;
        setBodyTransform(
          `translateY(${bodyY}px) scale(${bodyScale}) rotate(${bodyRotate}deg)`
        );

        // Arms: wave
        const leftArm = Math.sin(elapsed * 5) * 18;
        const rightArm = Math.sin(elapsed * 5 + 0.5) * 18;
        setLeftArmTransform(`rotate(${leftArm}deg)`);
        setRightArmTransform(`rotate(${rightArm}deg)`);
      } else {
        // Idle: slow breathing
        const breathScale = 1 + Math.sin(elapsed * 1.8) * 0.015;
        const breathY = Math.sin(elapsed * 1.8) * 2;
        setBodyTransform(
          `translateY(${breathY}px) scale(${breathScale})`
        );
        setLeftArmTransform("");
        setRightArmTransform("");
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isTalking]);

  const bodyLight = adjustBrightness(color, 20);
  const bodyDark = adjustBrightness(color, -15);
  const cheekColor = adjustBrightness(color, 30);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Mascot character"
    >
      {/* Shadow */}
      <ellipse cx="60" cy="124" rx="28" ry="5" fill="black" opacity="0.1" />

      {/* Left arm */}
      <g
        style={{
          transformOrigin: "22px 75px",
          transform: leftArmTransform,
          transition: isTalking ? "none" : "transform 0.3s ease",
        }}
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
        style={{
          transformOrigin: "98px 75px",
          transform: rightArmTransform,
          transition: isTalking ? "none" : "transform 0.3s ease",
        }}
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
      <g
        style={{
          transformOrigin: "60px 70px",
          transform: bodyTransform,
        }}
      >
        {/* Main body shape */}
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
        <ellipse
          cx="38"
          cy="72"
          rx="7"
          ry="4"
          fill={cheekColor}
          opacity="0.5"
        />
        <ellipse
          cx="82"
          cy="72"
          rx="7"
          ry="4"
          fill={cheekColor}
          opacity="0.5"
        />

        {/* Left eye */}
        <ellipse
          cx="47"
          cy="60"
          rx="5"
          ry={isBlinking ? 1.5 : 5.5}
          fill="white"
          style={{ transition: "ry 0.06s ease" }}
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
          style={{ transition: "ry 0.06s ease" }}
        />
        {!isBlinking && (
          <ellipse cx="74" cy="59" rx="2.5" ry="2.8" fill="#1a1a2e" />
        )}
        {!isBlinking && (
          <ellipse cx="75" cy="57.5" rx="1" ry="1" fill="white" />
        )}

        {/* Mouth */}
        {mouthOpen ? (
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

function adjustBrightness(hex: string, amount: number): string {
  if (!hex.startsWith("#")) return hex;
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
