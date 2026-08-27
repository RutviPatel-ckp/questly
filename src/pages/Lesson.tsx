import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  ArrowLeft,
  Settings,
  Terminal,
} from "lucide-react";

const COLOR_THEMES: Record<string, string> = {
  Sunset: "#fb923c",
  Ocean: "#38bdf8",
  Forest: "#34d399",
  Lavender: "#c084fc",
  Berry: "#f472b6",
  Honey: "#fbbf24",
  Mint: "#2dd4bf",
  Coral: "#fb7185",
};

const DICEBEAR_BASE = "https://api.dicebear.com/9.x/big-smile/svg";

function CompanionAvatar({
  name,
  size,
  className = "",
}: {
  name: string;
  size: number;
  className?: string;
}) {
  const seed = encodeURIComponent(name);
  return (
    <img
      src={`${DICEBEAR_BASE}?seed=${seed}&size=${size}`}
      alt={`${name}'s avatar`}
      width={size}
      height={size}
      className={`rounded-full bg-white object-cover ${className}`}
    />
  );
}

const LESSON_TEXT = `Welcome to your first lesson! Today we're going to learn about the water cycle.

The water cycle is the journey water takes as it circulates from the land to the sky and back again. Here's how it works:

First, the sun heats up water in rivers, lakes, and oceans. This turns the water into vapor, which rises into the air. This process is called evaporation.

As the vapor rises, it cools down and forms tiny water droplets in clouds. This is called condensation. It's the same thing that happens when you see fog on a cold morning!

When the clouds get heavy enough, the water falls back to Earth as rain or snow. This is called precipitation.

The water then flows into rivers and lakes, and the whole cycle starts again!

Great job learning about the water cycle today. Remember: evaporation, condensation, precipitation. You've got this!`;

export default function Lesson() {
  const navigate = useNavigate();
  const character = useQuery(api.characters.getCharacter);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sentencesRef = useRef<string[]>([]);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setIsTalking(false);
    setProgress(0);
    setCurrentSentenceIndex(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    utteranceRef.current = null;
  }, []);

  const speak = useCallback(() => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsTalking(true);

      const totalLength = sentencesRef.current.join(" ").length;
      const currentLength = sentencesRef.current
        .slice(0, currentSentenceIndex)
        .join(" ").length;
      const startProgress = (currentLength / totalLength) * 100;

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }
            return 100;
          }
          return prev + 0.3;
        });
      }, 50);

      return;
    }

    sentencesRef.current = LESSON_TEXT.match(/[^.!?]+[.!?]+/g) || [
      LESSON_TEXT,
    ];
    setCurrentSentenceIndex(0);
    setProgress(0);

    const totalLength = LESSON_TEXT.length;

    const utterance = new SpeechSynthesisUtterance(LESSON_TEXT);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find(
        (v) => v.lang.startsWith("en") && v.name.includes("Google")
      ) ||
      voices.find((v) => v.lang.startsWith("en-US")) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsTalking(false);
      setProgress(100);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsTalking(false);
      setProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    utterance.onboundary = (event) => {
      if (event.name === "sentence") {
        setCurrentSentenceIndex((prev) => prev + 1);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsTalking(true);

    const estimatedDuration =
      (totalLength / (utterance.rate * 150)) * 1000;
    const incrementMs = 50;
    const progressPerTick = (incrementMs / estimatedDuration) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + progressPerTick;
        if (next >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          return 100;
        }
        return next;
      });
    }, incrementMs);
  }, [isPaused, currentSentenceIndex]);

  const pauseSpeaking = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsTalking(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!isPlaying) {
      speak();
    } else if (isPaused) {
      speak();
    } else {
      pauseSpeaking();
    }
  }, [isPlaying, isPaused, speak, pauseSpeaking]);

  const themeColor = character
    ? COLOR_THEMES[character.colorTheme] || "#c084fc"
    : "#c084fc";

  if (character === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-grid">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen overflow-hidden bg-grid">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-lg px-6 py-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-8 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <Card className="clay-card-lg border-0 p-8 text-center">
            <CardContent className="space-y-4">
              <div className="clay-card mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/15">
                <Terminal className="h-8 w-8 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                No companion yet
              </h2>
              <p className="text-muted-foreground">
                Create your study companion first, then come back for lessons.
              </p>
              <Button
                onClick={() => navigate("/create-character")}
                className="clay-glow mt-4 rounded-xl bg-purple-500 px-6 py-2.5 font-semibold text-white hover:bg-purple-400"
              >
                Create Companion
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `${themeColor}08` }}
        />
        <div className="absolute bottom-1/4 -right-40 h-[400px] w-[400px] rounded-full bg-purple-600/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 py-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => {
              stopSpeaking();
              navigate("/dashboard");
            }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <div className="clay-card flex items-center gap-2 rounded-xl px-3 py-1.5">
            <CompanionAvatar name={character.name} size={24} />
            <span className="text-sm font-medium text-foreground">
              {character.name}
            </span>
          </div>
        </div>

        {/* Character */}
        <div className="mb-8 flex flex-col items-center">
          <motion.div
            animate={
              isTalking
                ? {
                    scale: [1, 1.08, 0.95, 1.06, 1],
                    rotate: [0, -3, 3, -2, 0],
                    y: [0, -6, 0, -3, 0],
                  }
                : {
                    scale: [1, 1.015, 1],
                    y: [0, -4, 0],
                  }
            }
            transition={
              isTalking
                ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
            }
            className="clay-card-lg flex items-center justify-center rounded-full p-1.5"
            style={{ backgroundColor: `${themeColor}15` }}
          >
            <CompanionAvatar name={character.name} size={192} />
          </motion.div>

          <motion.p
            key={isTalking ? "talking" : "idle"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-sm text-muted-foreground"
          >
            {isTalking
              ? `${character.name} is teaching you...`
              : isPlaying && !isPaused
                ? `${character.name} is thinking...`
                : `${character.name} is ready to teach`}
          </motion.p>
        </div>

        {/* Lesson card */}
        <Card className="clay-card-lg border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">🌊 The Water Cycle</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Science · 5 min read
                </p>
              </div>
              <div
                className="clay-card flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${themeColor}15` }}
              >
                {isTalking ? (
                  <Volume2 className="h-5 w-5" style={{ color: themeColor }} />
                ) : (
                  <VolumeX className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="clay-input h-3 overflow-hidden rounded-full p-0">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: themeColor }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
            </div>

            {/* Lesson text */}
            <div className="clay-input rounded-2xl p-5">
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                {LESSON_TEXT}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={stopSpeaking}
                disabled={!isPlaying}
                variant="outline"
                size="icon"
                className="clay-btn h-12 w-12 rounded-2xl border-white/5 bg-white/[0.03]"
              >
                <Square className="h-5 w-5" />
              </Button>

              <Button
                onClick={togglePlayPause}
                className="clay-glow flex h-16 w-16 items-center justify-center rounded-full p-0"
                style={{ backgroundColor: themeColor }}
              >
                {isPlaying && !isPaused ? (
                  <Pause className="h-6 w-6 text-white" />
                ) : (
                  <Play className="ml-1 h-6 w-6 text-white" />
                )}
              </Button>

              <Button
                onClick={() => navigate("/create-character")}
                variant="outline"
                size="icon"
                className="clay-btn h-12 w-12 rounded-2xl border-white/5 bg-white/[0.03]"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="clay-card mt-6 rounded-2xl p-5"
        >
          <p className="text-sm font-medium text-foreground">
            💡 Fun Fact
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            About 97% of Earth's water is saltwater in the oceans. Only about
            3% is freshwater — and most of that is locked in ice caps!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
