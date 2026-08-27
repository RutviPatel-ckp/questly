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

  // Load voices
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

  // Cleanup on unmount
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

      // Restart progress tracking
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

    // Split text into sentences for tracking
    sentencesRef.current = LESSON_TEXT.match(/[^.!?]+[.!?]+/g) || [
      LESSON_TEXT,
    ];
    setCurrentSentenceIndex(0);
    setProgress(0);

    const totalLength = LESSON_TEXT.length;

    const utterance = new SpeechSynthesisUtterance(LESSON_TEXT);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    // Try to pick a good English voice
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

    // Animate progress based on time estimate
    const estimatedDuration =
      (totalLength / (utterance.rate * 150)) * 1000; // rough ms estimate
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen overflow-hidden">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-lg px-6 py-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-8 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <Card className="clay-card-lg border-0 p-8 text-center">
            <CardContent className="space-y-4">
              <span className="text-5xl">👈</span>
              <h2 className="text-xl font-bold text-foreground">
                No character yet!
              </h2>
              <p className="text-muted-foreground">
                Create your study buddy first, then come back for lessons.
              </p>
              <Button
                onClick={() => navigate("/create-character")}
                className="clay-btn mt-4 rounded-2xl bg-purple-500 px-6 py-2.5 font-semibold text-white hover:bg-purple-600"
              >
                Create Character
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${themeColor}30` }}
        />
        <div className="absolute bottom-1/4 -left-48 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 py-8">
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
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: themeColor }}
            />
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
                    scale: [1, 1.06, 0.97, 1.04, 1],
                    rotate: [0, -2, 2, -1, 0],
                    y: [0, -4, 0, -2, 0],
                  }
                : { scale: 1, rotate: 0, y: 0 }
            }
            transition={
              isTalking
                ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.4, ease: "easeOut" }
            }
            className="clay-card-lg flex h-36 w-36 items-center justify-center rounded-full"
            style={{ backgroundColor: `${themeColor}20` }}
          >
            <div
              className="flex h-28 w-28 items-center justify-center rounded-full"
              style={{ backgroundColor: `${themeColor}40` }}
            >
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full text-4xl font-bold text-white shadow-lg"
                style={{ backgroundColor: themeColor }}
              >
                {character.name[0].toUpperCase()}
              </div>
            </div>
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
                : `${character.name} is ready to teach!`}
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
              <div className="clay-card flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                {isTalking ? (
                  <Volume2 className="h-5 w-5 text-purple-600" />
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
                className="clay-btn h-12 w-12 rounded-2xl border-gray-200"
              >
                <Square className="h-5 w-5" />
              </Button>

              <Button
                onClick={togglePlayPause}
                className="clay-btn flex h-16 w-16 items-center justify-center rounded-full p-0"
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
                className="clay-btn h-12 w-12 rounded-2xl border-gray-200"
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
