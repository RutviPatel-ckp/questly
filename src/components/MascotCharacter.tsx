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

  const [useImage, setUseImage] = useState(true);
  const [imgSrc, setImgSrc] = useState(charDef.images.idle);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const src = effectiveReaction === "talking" || effectiveReaction === "happy"
      ? charDef.images.talking
      : charDef.images.idle;
    setImgSrc(src);
    setImgError(false);
  }, [characterType, effectiveReaction, charDef]);

  const handleImgError = () => {
    setImgError(true);
    setUseImage(false);
  };

  // Image-based rendering
  if (useImage && !imgError && characterType) {
    return (
      <MascotImage
        src={imgSrc}
        size={size}
        reaction={effectiveReaction}
        className={className}
        onError={handleImgError}
      />
    );
  }

  // SVG fallback
  return (
    <MascotSVG
      color={color || charDef.themeColor}
      size={size}
      reaction={effectiveReaction}
      className={className}
      accessories={accessories}
      palette={charDef.palette}
      characterType={characterType}
    />
  );
}

function MascotImage({
  src,
  size,
  reaction,
  className,
  onError,
}: {
  src: string;
  size: number;
  reaction: MascotReaction;
  className: string;
  onError: () => void;
}) {
  const getAnimationClass = () => {
    switch (reaction) {
      case "talking": return "mascot-talking";
      case "happy": return "mascot-happy";
      case "sad": return "mascot-sad";
      default: return "mascot-idle";
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt="Companion character"
        className={`h-full w-full rounded-full object-cover ${getAnimationClass()}`}
        onError={onError}
        draggable={false}
      />
    </div>
  );
}

function MascotSVG({
  color,
  size,
  reaction,
  className,
  accessories,
  palette,
  characterType,
}: {
  color: string;
  size: number;
  reaction: MascotReaction;
  className: string;
  accessories: string[];
  palette: { body: string; bodyLight: string; bodyDark: string; accent: string; eyes: string };
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

  const bodyLight = palette.bodyLight;
  const bodyDark = palette.bodyDark;
  const cheekColor = adjustBrightness(palette.body, 30);

  return (
    <svg width={size} height={size} viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Mascot character">
      <ellipse cx="60" cy="124" rx="28" ry="5" fill="black" opacity="0.1" />

      <g style={{ transformOrigin: "22px 75px", transform: leftArmTransform, transition: reaction === "talking" ? "none" : "transform 0.3s ease" }}>
        <ellipse cx="18" cy="78" rx="10" ry="16" fill={bodyLight} stroke={bodyDark} strokeWidth="1.5" strokeLinecap="round" />
      </g>

      <g style={{ transformOrigin: "98px 75px", transform: rightArmTransform, transition: reaction === "talking" ? "none" : "transform 0.3s ease" }}>
        <ellipse cx="102" cy="78" rx="10" ry="16" fill={bodyLight} stroke={bodyDark} strokeWidth="1.5" strokeLinecap="round" />
      </g>

      <g style={{ transformOrigin: "60px 70px", transform: bodyTransform }}>
        <ellipse cx="60" cy="68" rx="36" ry="40" fill={palette.body} stroke={bodyDark} strokeWidth="1.5" />
        <ellipse cx="58" cy="60" rx="22" ry="24" fill={bodyLight} opacity="0.4" />
        <ellipse cx="38" cy="72" rx="7" ry="4" fill={cheekColor} opacity="0.5" />
        <ellipse cx="82" cy="72" rx="7" ry="4" fill={cheekColor} opacity="0.5" />

        <ellipse cx="47" cy="60" rx="5" ry={isBlinking ? 1.5 : 5.5} fill="white" style={{ transition: "ry 0.06s ease" }} />
        {!isBlinking && <ellipse cx="48" cy="59" rx="2.5" ry="2.8" fill={palette.eyes} />}
        {!isBlinking && <ellipse cx="49" cy="57.5" rx="1" ry="1" fill="white" />}

        <ellipse cx="73" cy="60" rx="5" ry={isBlinking ? 1.5 : 5.5} fill="white" style={{ transition: "ry 0.06s ease" }} />
        {!isBlinking && <ellipse cx="74" cy="59" rx="2.5" ry="2.8" fill={palette.eyes} />}
        {!isBlinking && <ellipse cx="75" cy="57.5" rx="1" ry="1" fill="white" />}

        {mouthOpen ? (
          <ellipse cx="60" cy="80" rx="6" ry="5" fill={palette.eyes} stroke={palette.eyes} strokeWidth="0.5" />
        ) : (
          <path d="M 53 79 Q 60 85 67 79" stroke={palette.eyes} strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {characterType === "dragon" && (
          <>
            <path d="M 40,30 L 35,15 L 42,28" fill={bodyDark} stroke={bodyDark} strokeWidth="1" />
            <path d="M 80,30 L 85,15 L 78,28" fill={bodyDark} stroke={bodyDark} strokeWidth="1" />
            <circle cx="47" cy="58" r="8" fill="none" stroke="#8b6914" strokeWidth="1.5" />
            <circle cx="73" cy="58" r="8" fill="none" stroke="#8b6914" strokeWidth="1.5" />
            <line x1="55" y1="58" x2="65" y2="58" stroke="#8b6914" strokeWidth="1.5" />
          </>
        )}
        {characterType === "fairy" && (
          <>
            <ellipse cx="25" cy="55" rx="12" ry="18" fill={palette.accent} opacity="0.3" transform="rotate(-15 25 55)" />
            <ellipse cx="95" cy="55" rx="12" ry="18" fill={palette.accent} opacity="0.3" transform="rotate(15 95 55)" />
            <circle cx="30" cy="40" r="1.5" fill={palette.accent} opacity="0.8" />
            <circle cx="90" cy="42" r="1.5" fill={palette.accent} opacity="0.8" />
          </>
        )}
        {characterType === "knight" && (
          <>
            <path d="M 35,55 Q 60,45 85,55 Q 85,48 60,42 Q 35,48 35,55" fill={palette.accent} opacity="0.6" />
            <ellipse cx="30" cy="80" rx="8" ry="5" fill={palette.accent} opacity="0.5" />
            <ellipse cx="90" cy="80" rx="8" ry="5" fill={palette.accent} opacity="0.5" />
          </>
        )}
        {characterType === "owl" && (
          <>
            <path d="M 40,28 L 45,18 L 52,25 L 60,12 L 68,25 L 75,18 L 80,28 Z" fill={palette.accent} stroke="#0e7490" strokeWidth="0.8" />
            <circle cx="60" cy="16" r="2" fill="#5ce1e6" />
            <path d="M 38,35 L 30,22 L 42,32" fill={bodyDark} />
            <path d="M 82,35 L 90,22 L 78,32" fill={bodyDark} />
          </>
        )}
        {characterType === "griffin" && (
          <>
            <path d="M 48,30 L 50,22 L 55,27 L 60,18 L 65,27 L 70,22 L 72,30 Z" fill={palette.accent} stroke="#d97706" strokeWidth="0.8" />
            <path d="M 30,65 Q 15,55 20,75 Q 25,70 30,65" fill={bodyDark} opacity="0.6" />
            <path d="M 90,65 Q 105,55 100,75 Q 95,70 90,65" fill={bodyDark} opacity="0.6" />
            <path d="M 60,105 Q 80,115 75,125" stroke={bodyDark} strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        )}
      </g>

      {accessories.includes("hat-party") && (
        <g><polygon points="60,18 45,38 75,38" fill="#ff6b6b" stroke="#e55" strokeWidth="1" /><circle cx="60" cy="15" r="4" fill="#ffd93d" /><circle cx="52" cy="32" r="2" fill="#6bcb77" /><circle cx="68" cy="30" r="2" fill="#4d96ff" /></g>
      )}
      {accessories.includes("crown") && (
        <g><path d="M 38,30 L 42,18 L 50,26 L 60,12 L 70,26 L 78,18 L 82,30 Z" fill="#ffd700" stroke="#daa520" strokeWidth="1" /><circle cx="42" cy="22" r="1.5" fill="#ff6b6b" /><circle cx="60" cy="16" r="1.5" fill="#4d96ff" /><circle cx="78" cy="22" r="1.5" fill="#6bcb77" /></g>
      )}
      {accessories.includes("glasses-smart") && (
        <g><rect x="37" y="55" width="16" height="12" rx="3" fill="none" stroke="#555" strokeWidth="1.5" /><rect x="67" y="55" width="16" height="12" rx="3" fill="none" stroke="#555" strokeWidth="1.5" /><line x1="53" y1="60" x2="67" y2="60" stroke="#555" strokeWidth="1.5" /><line x1="37" y1="60" x2="32" y2="58" stroke="#555" strokeWidth="1.5" /><line x1="83" y1="60" x2="88" y2="58" stroke="#555" strokeWidth="1.5" /></g>
      )}
      {accessories.includes("headphones") && (
        <g><path d="M 30,58 Q 30,25 60,25 Q 90,25 90,58" fill="none" stroke="#333" strokeWidth="3" /><rect x="25" y="52" width="10" height="16" rx="4" fill="#333" /><rect x="85" y="52" width="10" height="16" rx="4" fill="#333" /></g>
      )}
      {accessories.includes("bowtie") && (
        <g><path d="M 50,95 L 60,100 L 70,95 L 60,90 Z" fill="#e74c3c" stroke="#c0392b" strokeWidth="0.8" /><circle cx="60" cy="95" r="2.5" fill="#c0392b" /></g>
      )}
      {accessories.includes("cap") && (
        <g><ellipse cx="60" cy="28" rx="28" ry="10" fill="#3498db" /><ellipse cx="60" cy="26" rx="22" ry="7" fill="#2980b9" /><rect x="75" y="22" width="18" height="5" rx="2" fill="#3498db" /></g>
      )}
      {accessories.includes("scarf") && (
        <g><path d="M 32,90 Q 60,98 88,90 Q 85,96 60,102 Q 35,96 32,90" fill="#e74c3c" stroke="#c0392b" strokeWidth="0.8" /><path d="M 58,102 L 55,115 L 62,118 L 65,105" fill="#e74c3c" stroke="#c0392b" strokeWidth="0.8" /></g>
      )}
      {accessories.includes("flower") && (
        <g><circle cx="45" cy="22" r="5" fill="#ff69b4" opacity="0.9" /><circle cx="55" cy="18" r="5" fill="#ff1493" opacity="0.9" /><circle cx="65" cy="20" r="5" fill="#ff69b4" opacity="0.9" /><circle cx="75" cy="24" r="5" fill="#ff1493" opacity="0.9" /><circle cx="55" cy="25" r="3" fill="#ffd700" /><circle cx="65" cy="27" r="3" fill="#ffd700" /></g>
      )}

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
