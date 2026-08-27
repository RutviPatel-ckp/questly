import { useMemo } from "react";

/**
 * Floating decorative shapes that drift upward continuously.
 * Creates a magical, alive background feel.
 *
 * Each shape gets randomized:
 * - Horizontal position (left: 0-100%)
 * - Animation duration (15-35s)
 * - Animation delay (0-20s)
 * - Drift direction (-40px to +40px horizontal)
 * - Rotation (0-360deg)
 * - Size (based on type)
 * - Color tint (purple, teal, amber, coral)
 */

type ShapeType = "circle" | "star" | "pencil" | "book" | "bulb";

interface Shape {
  type: ShapeType;
  left: string;
  size: string;
  duration: string;
  delay: string;
  drift: string;
  rotate: string;
  color: string;
}

const COLORS = [
  "oklch(0.72 0.17 275 / 0.10)",  // purple
  "oklch(0.72 0.16 175 / 0.08)",  // teal
  "oklch(0.78 0.15 85 / 0.08)",   // amber
  "oklch(0.7 0.18 335 / 0.07)",   // coral
  "oklch(0.75 0.17 145 / 0.06)",  // lime
];

const SHAPES: ShapeType[] = ["circle", "circle", "circle", "star", "star", "pencil", "book", "bulb"];

function generateShapes(count: number): Shape[] {
  const shapes: Shape[] = [];
  for (let i = 0; i < count; i++) {
    const type = SHAPES[i % SHAPES.length];
    shapes.push({
      type,
      left: `${Math.random() * 100}%`,
      size: type === "circle"
        ? `${20 + Math.random() * 40}px`
        : type === "star"
          ? "6px"
          : `${8 + Math.random() * 6}px`,
      duration: `${18 + Math.random() * 22}s`,
      delay: `${Math.random() * 20}s`,
      drift: `${-40 + Math.random() * 80}px`,
      rotate: `${Math.random() * 360}deg`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }
  return shapes;
}

export default function FloatingShapes({ count = 12 }: { count?: number }) {
  const shapes = useMemo(() => generateShapes(count), [count]);

  return (
    <div className="floating-shapes" aria-hidden="true">
      {shapes.map((shape, i) => (
        <div
          key={i}
          className={`floating-shape ${shape.type}`}
          style={{
            left: shape.left,
            width: shape.size,
            height: shape.type === "circle" ? shape.size : undefined,
            animationDuration: shape.duration,
            animationDelay: shape.delay,
            ["--float-drift" as string]: shape.drift,
            ["--float-rotate" as string]: shape.rotate,
            ["--float-color" as string]: shape.color,
          }}
        />
      ))}
    </div>
  );
}
