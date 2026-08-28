import { useState, useEffect, useRef } from "react";
import MascotCharacter from "./MascotCharacter";

interface WiseOldKingProps {
  isTalking?: boolean;
  size?: number;
  className?: string;
}

/**
 * The Wise Old King — a scholarly dragon character used in the chat interface.
 * Uses the dragon character images with the same animation system as MascotCharacter.
 *
 * When isTalking is true, shows the talking pose with energetic bounce.
 * When idle, shows the idle pose with gentle breathing animation.
 */
export default function WiseOldKing({
  isTalking = false,
  size = 64,
  className = "",
}: WiseOldKingProps) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Glow ring behind the king when talking */}
      {isTalking && (
        <div
          className="absolute inset-0 rounded-full blur-md animate-pulse"
          style={{
            backgroundColor: "#4a9e7a30",
            transform: "scale(1.2)",
          }}
        />
      )}
      <MascotCharacter
        characterType="dragon"
        size={size}
        isTalking={isTalking}
        reaction={isTalking ? "talking" : "idle"}
      />
    </div>
  );
}
