import { useState, useEffect } from "react";

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  color?: string;
  type?: "confetti" | "sparkles";
}

/**
 * Lightweight confetti/sparkle burst.
 * When `trigger` becomes true, renders a burst of shapes that animate out and disappear.
 */
export default function Confetti({
  trigger,
  duration = 2000,
  color = "#fbbf24",
  type = "confetti",
}: ConfettiProps) {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; rotation: number; scale: number; delay: number; shape: string }[]
  >([]);

  useEffect(() => {
    if (!trigger) return;

    const count = type === "confetti" ? 24 : 12;
    const shapes =
      type === "confetti"
        ? ["●", "■", "▲", "★", "♦"]
        : ["✦", "✧", "⋆", "·", "°"];

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 300,
      y: -(Math.random() * 250 + 80),
      rotation: Math.random() * 720 - 360,
      scale: 0.5 + Math.random() * 1,
      delay: Math.random() * 300,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), duration);
    return () => clearTimeout(timer);
  }, [trigger, duration, type]);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-particle"
          style={{
            position: "fixed",
            left: "50%",
            top: "40%",
            fontSize: `${14 * p.scale}px`,
            color,
            animationDuration: `${duration}ms`,
            animationDelay: `${p.delay}ms`,
            ["--tx" as string]: `${p.x}px`,
            ["--ty" as string]: `${p.y}px`,
            ["--rot" as string]: `${p.rotation}deg`,
          }}
        >
          {p.shape}
        </span>
      ))}
      <style>{`
        .confetti-particle {
          animation: confetti-burst ease-out forwards;
          opacity: 0;
        }
        @keyframes confetti-burst {
          0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Simple inline sparkle effect — a few stars that pulse and fade.
 */
export function InlineSparkle({
  show,
  color = "#fbbf24",
}: {
  show: boolean;
  color?: string;
}) {
  if (!show) return null;

  return (
    <span className="inline-flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-sparkle"
          style={{
            color,
            animationDelay: `${i * 120}ms`,
          }}
        >
          ✦
        </span>
      ))}
      <style>{`
        .inline-sparkle {
          display: inline-block;
          animation: sparkle-pulse 0.6s ease-in-out forwards;
          font-size: 0.7em;
        }
        @keyframes sparkle-pulse {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </span>
  );
}
