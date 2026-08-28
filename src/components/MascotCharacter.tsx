import { useState, useEffect, useRef } from "react";
import { type CharacterType, getCharacterType } from "@/lib/character-types";

export type MascotReaction = "idle" | "talking" | "happy" | "sad";

interface MascotCharacterProps {
  color?: string;
  size?: number;
  isTalking?: boolean;
  reaction?: MascotReaction;
  className?: string;
  accessories?: string[];
  characterType?: CharacterType | string | null;
}

export default function MascotCharacter({
  color,
  size = 128,
  isTalking = false,
  reaction,
  className = "",
  accessories = [],
  characterType,
}: MascotCharacterProps) {
  const effectiveReaction: MascotReaction = reaction || (isTalking ? "talking" : "idle");
  const charDef = getCharacterType(characterType);

  return (
    <DragonCharacter
      color={color || charDef.themeColor}
      size={size}
      reaction={effectiveReaction}
      className={className}
      characterType={characterType}
    />
  );
}

/* ============================
   Detailed Illustrated Dragon
   ============================ */
function DragonCharacter({
  size,
  reaction,
  className,
  characterType,
}: {
  color: string;
  size: number;
  reaction: MascotReaction;
  className: string;
  characterType?: CharacterType | string | null;
}) {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [bodyTransform, setBodyTransform] = useState("");
  const [leftArmTransform, setLeftArmTransform] = useState("");
  const [rightArmTransform, setRightArmTransform] = useState("");

  const mouthTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const shouldAnimate = reaction === "talking" || reaction === "happy";
    if (shouldAnimate) {
      const speed = reaction === "happy" ? 120 : 170;
      mouthTimerRef.current = setInterval(() => setMouthOpen((p) => !p), speed);
    } else {
      setMouthOpen(false);
      if (mouthTimerRef.current) { clearInterval(mouthTimerRef.current); mouthTimerRef.current = null; }
    }
    return () => { if (mouthTimerRef.current) clearInterval(mouthTimerRef.current); };
  }, [reaction]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 3000;
      timeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => { setIsBlinking(false); scheduleBlink(); }, 150);
      }, delay);
    };
    scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    startTimeRef.current = performance.now();
    const animate = (now: number) => {
      const e = (now - startTimeRef.current) / 1000;
      switch (reaction) {
        case "talking":
          setBodyTransform(`translateY(${Math.sin(e * 5) * 3}px) scale(${1 + Math.sin(e * 6) * 0.02}) rotate(${Math.sin(e * 8) * 1.5}deg)`);
          setLeftArmTransform(`rotate(${Math.sin(e * 5) * 18}deg)`);
          setRightArmTransform(`rotate(${Math.sin(e * 5 + 0.5) * 18}deg)`);
          break;
        case "happy":
          setBodyTransform(`translateY(${-Math.abs(Math.sin(e * 8)) * 12}px) scale(${1 + Math.sin(e * 8) * 0.08})`);
          setLeftArmTransform(`rotate(${-25 + Math.sin(e * 10) * 10}deg)`);
          setRightArmTransform(`rotate(${25 + Math.sin(e * 10 + 1) * 10}deg)`);
          break;
        case "sad":
          setBodyTransform(`translateY(${Math.sin(e * 2) * 1.5}px) rotate(${Math.sin(e * 1.5) * 1}deg)`);
          setLeftArmTransform("rotate(5deg)");
          setRightArmTransform("rotate(-5deg)");
          break;
        default:
          setBodyTransform(`translateY(${Math.sin(e * 1.8) * 2}px) scale(${1 + Math.sin(e * 1.8) * 0.015})`);
          setLeftArmTransform("");
          setRightArmTransform("");
          break;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [reaction]);

  if (characterType === "fairy") return <FairySVG size={size} reaction={reaction} isBlinking={isBlinking} mouthOpen={mouthOpen} bodyTransform={bodyTransform} leftArmTransform={leftArmTransform} rightArmTransform={rightArmTransform} className={className} />;
  if (characterType === "knight") return <KnightSVG size={size} reaction={reaction} isBlinking={isBlinking} mouthOpen={mouthOpen} bodyTransform={bodyTransform} leftArmTransform={leftArmTransform} rightArmTransform={rightArmTransform} className={className} />;
  if (characterType === "owl") return <OwlSVG size={size} reaction={reaction} isBlinking={isBlinking} mouthOpen={mouthOpen} bodyTransform={bodyTransform} leftArmTransform={leftArmTransform} rightArmTransform={rightArmTransform} className={className} />;
  if (characterType === "griffin") return <GriffinSVG size={size} reaction={reaction} isBlinking={isBlinking} mouthOpen={mouthOpen} bodyTransform={bodyTransform} leftArmTransform={leftArmTransform} rightArmTransform={rightArmTransform} className={className} />;
  return <DragonSVG size={size} reaction={reaction} isBlinking={isBlinking} mouthOpen={mouthOpen} bodyTransform={bodyTransform} leftArmTransform={leftArmTransform} rightArmTransform={rightArmTransform} className={className} />;
}

/* ============================
   Dragon SVG — scholarly green dragon with glasses and books
   ============================ */
function DragonSVG({ size, reaction, isBlinking, mouthOpen, bodyTransform, leftArmTransform, rightArmTransform, className }: {
  size: number; reaction: MascotReaction; isBlinking: boolean; mouthOpen: boolean;
  bodyTransform: string; leftArmTransform: string; rightArmTransform: string; className: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Dragon companion">
      {/* Shadow */}
      <ellipse cx="100" cy="210" rx="50" ry="8" fill="black" opacity="0.08" />

      {/* Left arm/wing */}
      <g style={{ transformOrigin: "55px 130px", transform: leftArmTransform, transition: reaction === "talking" ? "none" : "transform 0.3s ease" }}>
        <path d="M55 120 C30 125, 18 145, 25 165 C28 170, 40 168, 45 160 C42 155, 48 145, 55 140Z" fill="#3a7e62" stroke="#2d6650" strokeWidth="1.5" />
        <path d="M30 140 C25 130, 15 135, 12 148" stroke="#5ce1a0" strokeWidth="1" fill="none" opacity="0.5" />
      </g>

      {/* Right arm holding book */}
      <g style={{ transformOrigin: "145px 130px", transform: rightArmTransform, transition: reaction === "talking" ? "none" : "transform 0.3s ease" }}>
        <path d="M145 120 C170 125, 182 145, 175 165 C172 170, 160 168, 155 160 C158 155, 152 145, 145 140Z" fill="#3a7e62" stroke="#2d6650" strokeWidth="1.5" />
        {/* Book in hand */}
        <rect x="160" y="148" width="18" height="14" rx="1" fill="#8b4513" stroke="#6b3410" strokeWidth="1" />
        <rect x="162" y="150" width="14" height="10" rx="0.5" fill="#f5deb3" />
        <line x1="169" y1="150" x2="169" y2="160" stroke="#d4a574" strokeWidth="0.5" />
        <line x1="163" y1="153" x2="168" y2="153" stroke="#c9a87c" strokeWidth="0.3" />
        <line x1="163" y1="155" x2="168" y2="155" stroke="#c9a87c" strokeWidth="0.3" />
      </g>

      {/* Main body group */}
      <g style={{ transformOrigin: "100px 120px", transform: bodyTransform }}>
        {/* Tail */}
        <path d="M100 175 C120 185, 155 180, 165 165 C170 158, 160 150, 150 155 C140 160, 130 170, 100 175" fill="#4a9e7a" stroke="#3a7e62" strokeWidth="1.5" />
        <path d="M155 160 L168 152 L160 165Z" fill="#3a7e62" />

        {/* Body */}
        <ellipse cx="100" cy="120" rx="48" ry="52" fill="#4a9e7a" stroke="#3a7e62" strokeWidth="1.5" />
        {/* Belly highlight */}
        <ellipse cx="96" cy="125" rx="30" ry="35" fill="#6bc29a" opacity="0.35" />
        {/* Belly texture lines */}
        <path d="M80 105 Q100 108 120 105" stroke="#5aad88" strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M78 115 Q100 118 122 115" stroke="#5aad88" strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M80 125 Q100 128 120 125" stroke="#5aad88" strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M82 135 Q100 138 118 135" stroke="#5aad88" strokeWidth="0.5" fill="none" opacity="0.4" />

        {/* Cheek blush */}
        <ellipse cx="65" cy="128" rx="10" ry="6" fill="#ff9999" opacity="0.3" />
        <ellipse cx="135" cy="128" rx="10" ry="6" fill="#ff9999" opacity="0.3" />

        {/* Head */}
        <ellipse cx="100" cy="78" rx="42" ry="38" fill="#4a9e7a" stroke="#3a7e62" strokeWidth="1.5" />
        <ellipse cx="96" cy="72" rx="28" ry="25" fill="#6bc29a" opacity="0.25" />

        {/* Horns */}
        <path d="M68 48 L60 22 L72 42" fill="#3a7e62" stroke="#2d6650" strokeWidth="1" />
        <path d="M132 48 L140 22 L128 42" fill="#3a7e62" stroke="#2d6650" strokeWidth="1" />
        <path d="M62 28 L60 22 L66 30" fill="#5ce1a0" opacity="0.6" />
        <path d="M138 28 L140 22 L134 30" fill="#5ce1a0" opacity="0.6" />

        {/* Ears/frills */}
        <path d="M58 62 L42 48 L55 58" fill="#3a7e62" />
        <path d="M142 62 L158 48 L145 58" fill="#3a7e62" />

        {/* Eyes */}
        <ellipse cx="82" cy="75" rx="9" ry={isBlinking ? 2 : 9} fill="white" style={{ transition: "ry 0.06s ease" }} />
        {!isBlinking && <ellipse cx="84" cy="74" rx="4.5" ry="5" fill="#1a1a2e" />}
        {!isBlinking && <ellipse cx="86" cy="72" rx="1.8" ry="1.8" fill="white" />}

        <ellipse cx="118" cy="75" rx="9" ry={isBlinking ? 2 : 9} fill="white" style={{ transition: "ry 0.06s ease" }} />
        {!isBlinking && <ellipse cx="120" cy="74" rx="4.5" ry="5" fill="#1a1a2e" />}
        {!isBlinking && <ellipse cx="122" cy="72" rx="1.8" ry="1.8" fill="white" />}

        {/* Glasses */}
        <rect x="68" y="65" width="24" height="18" rx="4" fill="none" stroke="#8b6914" strokeWidth="2" />
        <rect x="108" y="65" width="24" height="18" rx="4" fill="none" stroke="#8b6914" strokeWidth="2" />
        <line x1="92" y1="74" x2="108" y2="74" stroke="#8b6914" strokeWidth="2" />
        <line x1="68" y1="74" x2="58" y2="72" stroke="#8b6914" strokeWidth="1.5" />
        <line x1="132" y1="74" x2="142" y2="72" stroke="#8b6914" strokeWidth="1.5" />
        {/* Glass glare */}
        <line x1="72" y1="68" x2="78" y2="68" stroke="white" strokeWidth="1" opacity="0.5" />
        <line x1="112" y1="68" x2="118" y2="68" stroke="white" strokeWidth="1" opacity="0.5" />

        {/* Snout/nose */}
        <ellipse cx="100" cy="90" rx="12" ry="6" fill="#3a7e62" opacity="0.5" />
        <circle cx="95" cy="88" r="2" fill="#2d6650" />
        <circle cx="105" cy="88" r="2" fill="#2d6650" />

        {/* Mouth */}
        {mouthOpen ? (
          <ellipse cx="100" cy="100" rx="10" ry="8" fill="#2d1a1a" stroke="#3a7e62" strokeWidth="1" />
        ) : (
          <path d="M 90 98 Q 100 106 110 98" stroke="#3a7e62" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {/* Nostril smoke when talking */}
        {reaction === "talking" && (
          <>
            <circle cx="92" cy="82" r="2" fill="#ccc" opacity="0.4" />
            <circle cx="108" cy="82" r="2" fill="#ccc" opacity="0.4" />
          </>
        )}
      </g>

      {/* Books stack (bottom left) */}
      <g>
        <rect x="22" y="178" width="28" height="8" rx="1" fill="#8b4513" stroke="#6b3410" strokeWidth="0.8" />
        <rect x="25" y="170" width="24" height="8" rx="1" fill="#2d5016" stroke="#1a3a0e" strokeWidth="0.8" />
        <rect x="28" y="162" width="20" height="8" rx="1" fill="#1a3a6e" stroke="#0e2a5e" strokeWidth="0.8" />
      </g>

      {/* Feet */}
      <ellipse cx="80" cy="170" rx="14" ry="6" fill="#3a7e62" />
      <ellipse cx="120" cy="170" rx="14" ry="6" fill="#3a7e62" />
      {/* Toe claws */}
      <circle cx="68" cy="170" r="2" fill="#2d6650" />
      <circle cx="74" cy="172" r="2" fill="#2d6650" />
      <circle cx="126" cy="170" r="2" fill="#2d6650" />
      <circle cx="132" cy="172" r="2" fill="#2d6650" />
    </svg>
  );
}

/* ============================
   Fairy SVG — humanoid fairy with wings and globe
   ============================ */
function FairySVG({ size, reaction, isBlinking, mouthOpen, bodyTransform, leftArmTransform, rightArmTransform, className }: {
  size: number; reaction: MascotReaction; isBlinking: boolean; mouthOpen: boolean;
  bodyTransform: string; leftArmTransform: string; rightArmTransform: string; className: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Fairy companion">
      <ellipse cx="100" cy="210" rx="40" ry="6" fill="black" opacity="0.08" />

      {/* Left wing */}
      <g style={{ transformOrigin: "60px 100px", transform: leftArmTransform, transition: reaction === "talking" ? "none" : "transform 0.3s ease" }}>
        <path d="M60 95 C30 70, 5 50, 15 80 C8 65, -5 55, 10 90 C0 80, -8 75, 8 100 L60 115Z" fill="#e879f9" opacity="0.35" stroke="#d946ef" strokeWidth="0.8" />
        <path d="M60 100 C35 80, 15 65, 20 90" stroke="#e879f9" strokeWidth="0.5" fill="none" opacity="0.6" />
        <path d="M60 108 C40 95, 25 85, 22 100" stroke="#e879f9" strokeWidth="0.5" fill="none" opacity="0.6" />
        {/* Wing sparkles */}
        <circle cx="30" cy="80" r="1.5" fill="#fbbf24" opacity="0.8" />
        <circle cx="18" cy="90" r="1" fill="#fbbf24" opacity="0.6" />
      </g>

      {/* Right wing */}
      <g style={{ transformOrigin: "140px 100px", transform: rightArmTransform, transition: reaction === "talking" ? "none" : "transform 0.3s ease" }}>
        <path d="M140 95 C170 70, 195 50, 185 80 C192 65, 205 55, 190 90 C200 80, 208 75, 192 100 L140 115Z" fill="#e879f9" opacity="0.35" stroke="#d946ef" strokeWidth="0.8" />
        <path d="M140 100 C165 80, 185 65, 180 90" stroke="#e879f9" strokeWidth="0.5" fill="none" opacity="0.6" />
        <path d="M140 108 C160 95, 175 85, 178 100" stroke="#e879f9" strokeWidth="0.5" fill="none" opacity="0.6" />
        <circle cx="170" cy="80" r="1.5" fill="#fbbf24" opacity="0.8" />
        <circle cx="182" cy="90" r="1" fill="#fbbf24" opacity="0.6" />
      </g>

      <g style={{ transformOrigin: "100px 130px", transform: bodyTransform }}>
        {/* Hair (red/brown, windswept) */}
        <path d="M65 55 C60 30, 80 15, 100 18 C120 15, 140 30, 135 55 C140 45, 138 35, 130 30 C145 40, 148 55, 142 65 L135 60 C140 70, 130 80, 120 78 L125 65 C128 55, 120 48, 110 52 L115 62 C108 52, 92 52, 85 62 L90 52 C80 48, 72 55, 75 65 L80 78 C70 80, 60 70, 65 60 L58 65 C52 55, 55 40, 70 30 C62 35, 60 45, 65 55Z" fill="#b44a1e" stroke="#8b3515" strokeWidth="1" />
        <path d="M75 40 C80 32, 95 28, 100 30" stroke="#d4693a" strokeWidth="1" fill="none" opacity="0.5" />
        {/* Hair highlights */}
        <path d="M80 35 C85 30, 95 27, 100 28" stroke="#e8845a" strokeWidth="0.5" fill="none" opacity="0.5" />

        {/* Body — adventurer outfit */}
        <rect x="78" y="120" width="44" height="45" rx="8" fill="#5b7a3a" stroke="#3d5a25" strokeWidth="1.5" />
        {/* Belt */}
        <rect x="78" y="140" width="44" height="5" rx="1" fill="#8b6914" />
        <rect x="97" y="139" width="8" height="7" rx="1" fill="#daa520" stroke="#b8860b" strokeWidth="0.5" />
        {/* Collar/V */}
        <path d="M88 120 L100 135 L112 120" fill="#7a9e55" stroke="none" />
        {/* Vest details */}
        <line x1="85" y1="125" x2="85" y2="155" stroke="#3d5a25" strokeWidth="0.5" opacity="0.3" />
        <line x1="115" y1="125" x2="115" y2="155" stroke="#3d5a25" strokeWidth="0.5" opacity="0.3" />

        {/* Legs */}
        <rect x="85" y="163" width="12" height="18" rx="4" fill="#5b7a3a" stroke="#3d5a25" strokeWidth="1" />
        <rect x="103" y="163" width="12" height="18" rx="4" fill="#5b7a3a" stroke="#3d5a25" strokeWidth="1" />
        {/* Boots */}
        <ellipse cx="91" cy="183" rx="8" ry="4" fill="#6b4a1e" stroke="#4a3012" strokeWidth="0.8" />
        <ellipse cx="109" cy="183" rx="8" ry="4" fill="#6b4a1e" stroke="#4a3012" strokeWidth="0.8" />

        {/* Left arm holding globe */}
        <g style={{ transformOrigin: "75px 125px" }}>
          <path d="M78 120 C60 128, 55 145, 62 158 C64 162, 72 160, 74 155" fill="#e8c4a0" stroke="#c9a87c" strokeWidth="1" />
          {/* Globe */}
          <circle cx="55" cy="152" r="14" fill="#3b82f6" stroke="#2563eb" strokeWidth="1" />
          <ellipse cx="55" cy="152" rx="14" ry="6" fill="none" stroke="#22c55e" strokeWidth="0.8" opacity="0.6" />
          <path d="M48 142 C55 148, 62 142, 58 152" stroke="#22c55e" strokeWidth="0.8" fill="none" opacity="0.6" />
          <path d="M42 155 C48 150, 55 158, 62 153" stroke="#daa520" strokeWidth="0.5" fill="none" opacity="0.4" />
          <circle cx="48" cy="148" r="2" fill="#22c55e" opacity="0.4" />
          <circle cx="58" cy="156" r="3" fill="#22c55e" opacity="0.3" />
          {/* Globe stand */}
          <line x1="55" y1="166" x2="55" y2="172" stroke="#daa520" strokeWidth="1" />
          <ellipse cx="55" cy="174" rx="6" ry="2" fill="#daa520" />
        </g>

        {/* Right arm */}
        <g style={{ transformOrigin: "125px 125px" }}>
          <path d="M122 120 C140 128, 145 145, 138 155 C136 158, 128 156, 126 152" fill="#e8c4a0" stroke="#c9a87c" strokeWidth="1" />
          {/* Wand with star */}
          <line x1="140" y1="148" x2="155" y2="130" stroke="#daa520" strokeWidth="1.5" />
          <polygon points="155,125 157,130 162,130 158,133 160,138 155,135 150,138 152,133 148,130 153,130" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
        </g>

        {/* Head/face */}
        <ellipse cx="100" cy="78" rx="32" ry="30" fill="#f0c8a0" stroke="#dbb088" strokeWidth="1" />
        {/* Cheek blush */}
        <ellipse cx="76" cy="85" rx="8" ry="5" fill="#ffb3b3" opacity="0.35" />
        <ellipse cx="124" cy="85" rx="8" ry="5" fill="#ffb3b3" opacity="0.35" />

        {/* Pointy ears */}
        <path d="M68 65 L52 48 L62 62" fill="#f0c8a0" stroke="#dbb088" strokeWidth="1" />
        <path d="M132 65 L148 48 L138 62" fill="#f0c8a0" stroke="#dbb088" strokeWidth="1" />
        <path d="M66 63 L55 52 L62 62" fill="#ffc8a0" opacity="0.5" />
        <path d="M134 63 L145 52 L138 62" fill="#ffc8a0" opacity="0.5" />

        {/* Eyes */}
        <ellipse cx="88" cy="76" rx="7" ry={isBlinking ? 1.5 : 7} fill="white" style={{ transition: "ry 0.06s ease" }} />
        {!isBlinking && <ellipse cx="89" cy="75" rx="3.5" ry="4" fill="#2d5016" />}
        {!isBlinking && <ellipse cx="91" cy="73" rx="1.5" ry="1.5" fill="white" />}

        <ellipse cx="112" cy="76" rx="7" ry={isBlinking ? 1.5 : 7} fill="white" style={{ transition: "ry 0.06s ease" }} />
        {!isBlinking && <ellipse cx="113" cy="75" rx="3.5" ry="4" fill="#2d5016" />}
        {!isBlinking && <ellipse cx="115" cy="73" rx="1.5" ry="1.5" fill="white" />}

        {/* Eyebrows */}
        <path d="M80 68 Q88 64 95 68" stroke="#8b3515" strokeWidth="1.5" fill="none" />
        <path d="M105 68 Q112 64 120 68" stroke="#8b3515" strokeWidth="1.5" fill="none" />

        {/* Nose */}
        <ellipse cx="100" cy="86" rx="2.5" ry="2" fill="#dbb088" />

        {/* Mouth */}
        {mouthOpen ? (
          <ellipse cx="100" cy="94" rx="7" ry="5" fill="#8b3515" stroke="#6b2510" strokeWidth="0.5" />
        ) : (
          <path d="M 92 93 Q 100 99 108 93" stroke="#8b3515" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        )}
      </g>
    </svg>
  );
}

/* ============================
   Knight SVG — young adventurer at computer with mechanical arm
   ============================ */
function KnightSVG({ size, reaction, isBlinking, mouthOpen, bodyTransform, leftArmTransform, rightArmTransform, className }: {
  size: number; reaction: MascotReaction; isBlinking: boolean; mouthOpen: boolean;
  bodyTransform: string; leftArmTransform: string; rightArmTransform: string; className: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Knight companion">
      <ellipse cx="100" cy="210" rx="45" ry="6" fill="black" opacity="0.08" />

      <g style={{ transformOrigin: "100px 130px", transform: bodyTransform }}>
        {/* Hair */}
        <path d="M68 50 C65 25, 85 12, 105 14 C125 12, 140 28, 138 50 C142 42, 138 32, 128 28 C140 38, 138 52, 132 58 L128 50 C132 62, 120 70, 110 68 L115 55 C112 48, 100 45, 90 52 L92 65 C82 68, 72 60, 75 50 L68 50Z" fill="#8b6b3a" stroke="#6b4f28" strokeWidth="1" />
        <path d="M78 35 C85 28, 100 22, 108 25" stroke="#a8845a" strokeWidth="0.8" fill="none" opacity="0.4" />

        {/* Body — green vest/shirt */}
        <rect x="76" y="110" width="48" height="55" rx="10" fill="#4a7a3a" stroke="#3a5a28" strokeWidth="1.5" />
        {/* Shirt collar */}
        <path d="M90 110 L100 122 L110 110" fill="#5a8a4a" />
        {/* Vest seams */}
        <line x1="85" y1="115" x2="85" y2="160" stroke="#3a5a28" strokeWidth="0.5" opacity="0.3" />
        <line x1="115" y1="115" x2="115" y2="160" stroke="#3a5a28" strokeWidth="0.5" opacity="0.3" />

        {/* Legs */}
        <rect x="83" y="163" width="14" height="20" rx="5" fill="#556b44" stroke="#3a5a28" strokeWidth="1" />
        <rect x="103" y="163" width="14" height="20" rx="5" fill="#556b44" stroke="#3a5a28" strokeWidth="1" />
        {/* Boots */}
        <ellipse cx="90" cy="185" rx="10" ry="5" fill="#6b4a1e" stroke="#4a3012" strokeWidth="0.8" />
        <ellipse cx="110" cy="185" rx="10" ry="5" fill="#6b4a1e" stroke="#4a3012" strokeWidth="0.8" />

        {/* Left arm (mechanical) */}
        <g style={{ transformOrigin: "72px 120px", transform: leftArmTransform, transition: reaction === "talking" ? "none" : "transform 0.3s ease" }}>
          <path d="M76 115 C58 122, 48 140, 52 158 C54 162, 62 160, 65 155" fill="#8a8a8a" stroke="#6a6a6a" strokeWidth="1" />
          {/* Mechanical joints */}
          <circle cx="55" cy="135" r="4" fill="#aaa" stroke="#888" strokeWidth="1" />
          <circle cx="55" cy="135" r="2" fill="#666" />
          <circle cx="52" cy="150" r="3" fill="#aaa" stroke="#888" strokeWidth="1" />
          {/* Mechanical arm segments */}
          <line x1="58" y1="125" x2="52" y2="135" stroke="#999" strokeWidth="2" />
          <line x1="52" y1="138" x2="50" y2="148" stroke="#999" strokeWidth="2" />
          {/* Mechanical fingers */}
          <circle cx="48" cy="158" r="2.5" fill="#999" />
          <circle cx="54" cy="160" r="2.5" fill="#999" />
          <circle cx="60" cy="158" r="2.5" fill="#999" />
        </g>

        {/* Right arm */}
        <g style={{ transformOrigin: "128px 120px", transform: rightArmTransform, transition: reaction === "talking" ? "none" : "transform 0.3s ease" }}>
          <path d="M124 115 C142 122, 148 138, 142 152 C140 156, 132 154, 130 150" fill="#e8c4a0" stroke="#c9a87c" strokeWidth="1" />
          {/* Hand pointing */}
          <circle cx="144" cy="152" r="4" fill="#e8c4a0" stroke="#c9a87c" strokeWidth="0.8" />
        </g>

        {/* Head */}
        <ellipse cx="100" cy="72" rx="34" ry="32" fill="#e8c4a0" stroke="#dbb088" strokeWidth="1" />
        <ellipse cx="96" cy="66" rx="22" ry="20" fill="#f0d4b0" opacity="0.3" />

        {/* Eyes */}
        <ellipse cx="87" cy="70" rx="7" ry={isBlinking ? 1.5 : 7} fill="white" style={{ transition: "ry 0.06s ease" }} />
        {!isBlinking && <ellipse cx="88" cy="69" rx="3.5" ry="4" fill="#2a4a7a" />}
        {!isBlinking && <ellipse cx="90" cy="67" rx="1.5" ry="1.5" fill="white" />}

        <ellipse cx="113" cy="70" rx="7" ry={isBlinking ? 1.5 : 7} fill="white" style={{ transition: "ry 0.06s ease" }} />
        {!isBlinking && <ellipse cx="114" cy="69" rx="3.5" ry="4" fill="#2a4a7a" />}
        {!isBlinking && <ellipse cx="116" cy="67" rx="1.5" ry="1.5" fill="white" />}

        {/* Eyebrows */}
        <path d="M79 62 Q87 58 94 62" stroke="#6b4f28" strokeWidth="1.5" fill="none" />
        <path d="M106 62 Q113 58 121 62" stroke="#6b4f28" strokeWidth="1.5" fill="none" />

        {/* Nose */}
        <path d="M98 78 L100 82 L102 78" stroke="#c9a87c" strokeWidth="1" fill="none" />

        {/* Mouth */}
        {mouthOpen ? (
          <ellipse cx="100" cy="90" rx="7" ry="5" fill="#8b4513" stroke="#6b3010" strokeWidth="0.5" />
        ) : (
          <path d="M 92 88 Q 100 95 108 88" stroke="#8b5a3a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        )}

        {/* Ear */}
        <ellipse cx="66" cy="72" rx="5" ry="7" fill="#e8c4a0" stroke="#dbb088" strokeWidth="0.8" />
        <ellipse cx="134" cy="72" rx="5" ry="7" fill="#e8c4a0" stroke="#dbb088" strokeWidth="0.8" />
      </g>

      {/* Computer/desk element */}
      <g>
        <rect x="125" y="155" width="50" height="35" rx="3" fill="#3a3a4a" stroke="#2a2a3a" strokeWidth="1" />
        <rect x="128" y="158" width="44" height="24" rx="1" fill="#1a2a3a" />
        {/* Screen content */}
        <path d="M135 165 L155 163 L165 168 L145 172Z" fill="#22c55e" opacity="0.3" />
        <circle cx="150" cy="168" r="3" fill="#fbbf24" opacity="0.4" />
        <line x1="132" y1="175" x2="170" y2="175" stroke="#22c55e" strokeWidth="0.5" opacity="0.3" />
        {/* Monitor stand */}
        <rect x="145" y="190" width="10" height="5" fill="#3a3a4a" />
        <rect x="138" y="194" width="24" height="3" rx="1" fill="#4a4a5a" />
      </g>

      {/* Map/scroll */}
      <g>
        <rect x="10" y="168" width="30" height="22" rx="2" fill="#f5deb3" stroke="#daa520" strokeWidth="0.8" />
        <path d="M15 175 L25 172 L35 178" stroke="#8b6914" strokeWidth="0.5" fill="none" />
        <circle cx="22" cy="180" r="2" fill="#daa520" opacity="0.4" />
        <line x1="15" y1="184" x2="35" y2="184" stroke="#c9a87c" strokeWidth="0.3" />
      </g>
    </svg>
  );
}

/* ============================
   Owl SVG — detailed owl with crown among mushrooms
   ============================ */
function OwlSVG({ size, reaction, isBlinking, mouthOpen, bodyTransform, leftArmTransform, rightArmTransform, className }: {
  size: number; reaction: MascotReaction; isBlinking: boolean; mouthOpen: boolean;
  bodyTransform: string; leftArmTransform: string; rightArmTransform: string; className: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Owl companion">
      <ellipse cx="100" cy="210" rx="45" ry="6" fill="black" opacity="0.08" />

      {/* Mushrooms (decorative) */}
      <g opacity="0.7">
        <rect x="15" y="185" width="3" height="12" fill="#f5deb3" />
        <ellipse cx="16" cy="185" rx="8" ry="5" fill="#9333ea" />
        <circle cx="12" cy="183" r="1" fill="white" opacity="0.6" />
        <circle cx="19" cy="182" r="0.8" fill="white" opacity="0.5" />
      </g>
      <g opacity="0.6">
        <rect x="175" y="190" width="2" height="8" fill="#f5deb3" />
        <ellipse cx="176" cy="190" rx="6" ry="4" fill="#a855f7" />
        <circle cx="173" cy="189" r="0.8" fill="white" opacity="0.5" />
      </g>

      <g style={{ transformOrigin: "100px 130px", transform: bodyTransform }}>
        {/* Left wing */}
        <g style={{ transformOrigin: "55px 120px", transform: leftArmTransform, transition: reaction === "talking" ? "none" : "transform 0.3s ease" }}>
          <path d="M58 100 C35 110, 25 135, 35 160 C38 165, 48 162, 50 155 C45 150, 42 140, 48 125 C44 140, 38 155, 45 165" fill="#c4883a" stroke="#9e6d2c" strokeWidth="1" />
          {/* Feather layers */}
          <path d="M48 115 C38 120, 32 135, 38 150" stroke="#daa964" strokeWidth="0.5" fill="none" opacity="0.4" />
          <path d="M44 125 C36 130, 30 145, 36 158" stroke="#daa964" strokeWidth="0.5" fill="none" opacity="0.4" />
        </g>

        {/* Right wing */}
        <g style={{ transformOrigin: "145px 120px", transform: rightArmTransform, transition: reaction === "talking" ? "none" : "transform 0.3s ease" }}>
          <path d="M142 100 C165 110, 175 135, 165 160 C162 165, 152 162, 150 155 C155 150, 158 140, 152 125 C156 140, 162 155, 155 165" fill="#c4883a" stroke="#9e6d2c" strokeWidth="1" />
          <path d="M152 115 C162 120, 168 135, 162 150" stroke="#daa964" strokeWidth="0.5" fill="none" opacity="0.4" />
        </g>

        {/* Body */}
        <ellipse cx="100" cy="130" rx="46" ry="50" fill="#c4883a" stroke="#9e6d2c" strokeWidth="1.5" />
        {/* Belly feathers */}
        <ellipse cx="100" cy="140" rx="30" ry="35" fill="#daa964" opacity="0.3" />
        {/* Feather pattern */}
        <path d="M80 120 Q100 125 120 120" stroke="#b87830" strokeWidth="0.5" fill="none" opacity="0.3" />
        <path d="M78 130 Q100 135 122 130" stroke="#b87830" strokeWidth="0.5" fill="none" opacity="0.3" />
        <path d="M80 140 Q100 145 120 140" stroke="#b87830" strokeWidth="0.5" fill="none" opacity="0.3" />

        {/* Cheeks */}
        <ellipse cx="65" cy="120" rx="10" ry="7" fill="#ff9999" opacity="0.25" />
        <ellipse cx="135" cy="120" rx="10" ry="7" fill="#ff9999" opacity="0.25" />

        {/* Ear tufts */}
        <path d="M65 60 L52 35 L70 55" fill="#9e6d2c" stroke="#7a5520" strokeWidth="0.8" />
        <path d="M135 60 L148 35 L130 55" fill="#9e6d2c" stroke="#7a5520" strokeWidth="0.8" />
        <path d="M67 55 L55 38 L70 52" fill="#c4883a" opacity="0.5" />
        <path d="M133 55 L145 38 L130 52" fill="#c4883a" opacity="0.5" />

        {/* Crown */}
        <path d="M68 45 L72 25 L82 38 L92 18 L100 35 L108 18 L118 38 L128 25 L132 45 Z" fill="#5ce1e6" stroke="#0e7490" strokeWidth="1" />
        <circle cx="92" cy="28" r="2" fill="#06b6d4" />
        <circle cx="100" cy="22" r="2.5" fill="#fbbf24" />
        <circle cx="108" cy="28" r="2" fill="#06b6d4" />
        {/* Crown base */}
        <rect x="68" y="42" width="64" height="6" rx="2" fill="#5ce1e6" stroke="#0e7490" strokeWidth="0.8" />

        {/* Head (slightly overlapping crown) */}
        <ellipse cx="100" cy="68" rx="36" ry="30" fill="#c4883a" stroke="#9e6d2c" strokeWidth="1.5" />
        <ellipse cx="96" cy="62" rx="24" ry="20" fill="#daa964" opacity="0.3" />

        {/* Eye circles (large owl eyes) */}
        <circle cx="84" cy="70" r="16" fill="#f5e6c8" stroke="#9e6d2c" strokeWidth="1" />
        <circle cx="116" cy="70" r="16" fill="#f5e6c8" stroke="#9e6d2c" strokeWidth="1" />

        {/* Eyes */}
        <ellipse cx="84" cy="70" rx="8" ry={isBlinking ? 2 : 8} fill="#1a1a2e" style={{ transition: "ry 0.06s ease" }} />
        {!isBlinking && <ellipse cx="86" cy="68" rx="3" ry="3" fill="white" />}
        {!isBlinking && <ellipse cx="82" cy="72" rx="1.5" ry="1.5" fill="white" opacity="0.6" />}

        <ellipse cx="116" cy="70" rx="8" ry={isBlinking ? 2 : 8} fill="#1a1a2e" style={{ transition: "ry 0.06s ease" }} />
        {!isBlinking && <ellipse cx="118" cy="68" rx="3" ry="3" fill="white" />}
        {!isBlinking && <ellipse cx="114" cy="72" rx="1.5" ry="1.5" fill="white" opacity="0.6" />}

        {/* Eye sparkle rings */}
        {!isBlinking && <circle cx="84" cy="70" r="10" fill="none" stroke="#5ce1e6" strokeWidth="0.5" opacity="0.3" />}
        {!isBlinking && <circle cx="116" cy="70" r="10" fill="none" stroke="#5ce1e6" strokeWidth="0.5" opacity="0.3" />}

        {/* Beak */}
        {mouthOpen ? (
          <path d="M94 82 L100 92 L106 82Z" fill="#daa520" stroke="#b8860b" strokeWidth="1" />
        ) : (
          <path d="M94 82 L100 88 L106 82Z" fill="#daa520" stroke="#b8860b" strokeWidth="1" />
        )}
      </g>

      {/* Feet */}
      <g>
        <path d="M78 178 L70 188 M78 178 L78 190 M78 178 L86 188" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" />
        <path d="M122 178 L114 188 M122 178 L122 190 M122 178 L130 188" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Constellation dots */}
      <circle cx="20" cy="40" r="1" fill="#5ce1e6" opacity="0.5" />
      <circle cx="35" cy="30" r="1.5" fill="#5ce1e6" opacity="0.4" />
      <circle cx="170" cy="35" r="1" fill="#5ce1e6" opacity="0.5" />
      <circle cx="180" cy="50" r="1.5" fill="#5ce1e6" opacity="0.4" />
      <line x1="20" y1="40" x2="35" y2="30" stroke="#5ce1e6" strokeWidth="0.3" opacity="0.3" />
    </svg>
  );
}

/* ============================
   Griffin SVG — cute furry cat-dragon with crown
   ============================ */
function GriffinSVG({ size, reaction, isBlinking, mouthOpen, bodyTransform, leftArmTransform, rightArmTransform, className }: {
  size: number; reaction: MascotReaction; isBlinking: boolean; mouthOpen: boolean;
  bodyTransform: string; leftArmTransform: string; rightArmTransform: string; className: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Griffin companion">
      <ellipse cx="100" cy="210" rx="50" ry="6" fill="black" opacity="0.08" />

      {/* Mossy stump */}
      <g>
        <rect x="65" y="188" width="70" height="20" rx="6" fill="#6b8a3a" stroke="#4a6a28" strokeWidth="1" />
        <ellipse cx="100" cy="188" rx="35" ry="6" fill="#7a9a4a" stroke="#5a7a38" strokeWidth="1" />
        <path d="M70 195 C75 192, 85 196, 90 193" stroke="#5a7a38" strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M110 196 C115 193, 125 197, 130 194" stroke="#5a7a38" strokeWidth="0.5" fill="none" opacity="0.4" />
      </g>

      {/* Left wing */}
      <g style={{ transformOrigin: "60px 115px", transform: leftArmTransform, transition: reaction === "talking" ? "none" : "transform 0.3s ease" }}>
        <path d="M60 105 C35 95, 15 80, 20 105 C10 95, 5 110, 25 125 L60 130Z" fill="#c4b5a5" stroke="#9e8c7a" strokeWidth="1" opacity="0.7" />
        <path d="M35 100 C25 95, 15 100, 20 115" stroke="#b8a898" strokeWidth="0.5" fill="none" opacity="0.5" />
      </g>

      {/* Right wing */}
      <g style={{ transformOrigin: "140px 115px", transform: rightArmTransform, transition: reaction === "talking" ? "none" : "transform 0.3s ease" }}>
        <path d="M140 105 C165 95, 185 80, 180 105 C190 95, 195 110, 175 125 L140 130Z" fill="#c4b5a5" stroke="#9e8c7a" strokeWidth="1" opacity="0.7" />
        <path d="M165 100 C175 95, 185 100, 180 115" stroke="#b8a898" strokeWidth="0.5" fill="none" opacity="0.5" />
      </g>

      <g style={{ transformOrigin: "100px 125px", transform: bodyTransform }}>
        {/* Tail */}
        <path d="M100 170 C125 180, 155 175, 160 160 C165 150, 155 145, 148 152 C142 158, 135 168, 100 170" fill="#9e8c7a" stroke="#7a6b5c" strokeWidth="1" />
        <path d="M152 155 L165 148 L158 162Z" fill="#7a6b5c" />

        {/* Body — furry round */}
        <ellipse cx="100" cy="130" rx="44" ry="46" fill="#b8a898" stroke="#9e8c7a" strokeWidth="1.5" />
        {/* Belly fur */}
        <ellipse cx="100" cy="140" rx="28" ry="30" fill="#d4c8b8" opacity="0.4" />
        {/* Fur texture */}
        <path d="M80 120 Q90 118 100 120 Q110 118 120 120" stroke="#c4b5a5" strokeWidth="0.5" fill="none" opacity="0.3" />
        <path d="M78 130 Q90 128 100 130 Q110 128 122 130" stroke="#c4b5a5" strokeWidth="0.5" fill="none" opacity="0.3" />

        {/* Cheek fur tufts */}
        <ellipse cx="60" cy="125" rx="8" ry="6" fill="#c4b5a5" opacity="0.5" />
        <ellipse cx="140" cy="125" rx="8" ry="6" fill="#c4b5a5" opacity="0.5" />

        {/* Head */}
        <ellipse cx="100" cy="78" rx="36" ry="32" fill="#b8a898" stroke="#9e8c7a" strokeWidth="1.5" />
        <ellipse cx="96" cy="72" rx="24" ry="22" fill="#d4c8b8" opacity="0.25" />

        {/* Pointy cat ears */}
        <path d="M68 55 L55 28 L76 48" fill="#b8a898" stroke="#9e8c7a" strokeWidth="1" />
        <path d="M132 55 L145 28 L124 48" fill="#b8a898" stroke="#9e8c7a" strokeWidth="1" />
        {/* Inner ears */}
        <path d="M70 52 L60 32 L75 48" fill="#e8c4a0" opacity="0.5" />
        <path d="M130 52 L140 32 L125 48" fill="#e8c4a0" opacity="0.5" />

        {/* Crown (small, cute) */}
        <path d="M80 42 L83 30 L90 38 L100 25 L110 38 L117 30 L120 42Z" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />
        <circle cx="100" cy="30" r="1.8" fill="#fbbf24" />
        <circle cx="90" cy="35" r="1.2" fill="#ef4444" />
        <circle cx="110" cy="35" r="1.2" fill="#3b82f6" />
        <rect x="80" y="40" width="40" height="4" rx="1" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />

        {/* Big cute eyes */}
        <ellipse cx="84" cy="76" rx="11" ry={isBlinking ? 2.5 : 11} fill="white" style={{ transition: "ry 0.06s ease" }} />
        {!isBlinking && <ellipse cx="86" cy="75" rx="5.5" ry="6" fill="#4a2810" />}
        {!isBlinking && <ellipse cx="88" cy="73" rx="2.2" ry="2.2" fill="white" />}
        {!isBlinking && <ellipse cx="84" cy="77" rx="1" ry="1" fill="white" opacity="0.5" />}

        <ellipse cx="116" cy="76" rx="11" ry={isBlinking ? 2.5 : 11} fill="white" style={{ transition: "ry 0.06s ease" }} />
        {!isBlinking && <ellipse cx="118" cy="75" rx="5.5" ry="6" fill="#4a2810" />}
        {!isBlinking && <ellipse cx="120" cy="73" rx="2.2" ry="2.2" fill="white" />}
        {!isBlinking && <ellipse cx="116" cy="77" rx="1" ry="1" fill="white" opacity="0.5" />}

        {/* Nose */}
        <ellipse cx="100" cy="88" rx="4" ry="3" fill="#9e8c7a" stroke="#7a6b5c" strokeWidth="0.5" />

        {/* Mouth */}
        {mouthOpen ? (
          <ellipse cx="100" cy="98" rx="8" ry="6" fill="#5a3a2a" stroke="#7a6b5c" strokeWidth="0.5" />
        ) : (
          <>
            <path d="M 92 96 Q 100 103 108 96" stroke="#7a6b5c" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            {/* Cat-like w mouth */}
            <path d="M 96 96 L 100 99 L 104 96" stroke="#7a6b5c" strokeWidth="1" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Whiskers */}
        <line x1="60" y1="85" x2="78" y2="88" stroke="#9e8c7a" strokeWidth="0.8" opacity="0.4" />
        <line x1="58" y1="92" x2="78" y2="92" stroke="#9e8c7a" strokeWidth="0.8" opacity="0.4" />
        <line x1="122" y1="88" x2="140" y2="85" stroke="#9e8c7a" strokeWidth="0.8" opacity="0.4" />
        <line x1="122" y1="92" x2="142" y2="92" stroke="#9e8c7a" strokeWidth="0.8" opacity="0.4" />
      </g>

      {/* Paws on stump */}
      <ellipse cx="82" cy="188" rx="14" ry="6" fill="#9e8c7a" stroke="#7a6b5c" strokeWidth="1" />
      <ellipse cx="118" cy="188" rx="14" ry="6" fill="#9e8c7a" stroke="#7a6b5c" strokeWidth="1" />
      {/* Paw pads */}
      <circle cx="76" cy="188" r="2" fill="#c4b5a5" />
      <circle cx="82" cy="190" r="2" fill="#c4b5a5" />
      <circle cx="88" cy="188" r="2" fill="#c4b5a5" />
      <circle cx="112" cy="188" r="2" fill="#c4b5a5" />
      <circle cx="118" cy="190" r="2" fill="#c4b5a5" />
      <circle cx="124" cy="188" r="2" fill="#c4b5a5" />
    </svg>
  );
}
