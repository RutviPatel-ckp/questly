import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useQuery, useAction } from "convex/react";
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
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import MascotCharacter, { type MascotReaction } from "@/components/MascotCharacter";
import Confetti from "@/components/Confetti";
import { playCheer, playPop } from "@/lib/sounds";
import { FALLBACK_LESSONS } from "@/lib/onboarding-data";

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

type LessonState = "loading" | "ready" | "error";

export default function Lesson() {
  const navigate = useNavigate();
  const character = useQuery(api.characters.getCharacter);
  const generateLesson = useAction(api.lessons.generateLesson);

  const [lessonText, setLessonText] = useState("");
  const [lessonState, setLessonState] = useState<LessonState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mascotReaction, setMascotReaction] = useState<MascotReaction>("idle");
  const [showConfetti, setShowConfetti] = useState(false);

  // Use refs to avoid stale closures in speak/pause callbacks
  const isPausedRef = useRef(false);
  const lessonTextRef = useRef("");
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  // Keep refs in sync
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  useEffect(() => {
    lessonTextRef.current = lessonText;
  }, [lessonText]);

  const themeColor = character
    ? COLOR_THEMES[character.colorTheme] || "#c084fc"
    : "#c084fc";

  // Redirect to onboarding if no profile
  useEffect(() => {
    if (character && character !== null && !character.grade) {
      navigate("/onboarding");
    }
  }, [character, navigate]);

  // Generate or load lesson
  const loadLesson = useCallback(
    async (forceRegenerate = false) => {
      if (
        !character?.grade ||
        !character?.subject ||
        !character?.region ||
        !character?.topic
      )
        return;

      setLessonState("loading");
      setErrorMessage("");
      setIsUsingFallback(false);
      setLessonText("");

      try {
        const result = await generateLesson({
          grade: character.grade,
          subject: character.subject,
          region: character.region,
          topic: character.topic,
          companionName: character.name,
          companionDescription: character.description,
        });

        setLessonText(result.content);
        setLessonState("ready");
        // Celebrate!
        setShowConfetti(true);
        setMascotReaction("happy");
        playCheer();
        setTimeout(() => setMascotReaction("idle"), 3000);
      } catch (error) {
        console.error("Lesson generation failed:", error);
        const fallback =
          FALLBACK_LESSONS[character.subject] ||
          FALLBACK_LESSONS["General Knowledge"];
        setLessonText(fallback);
        setIsUsingFallback(true);
        setLessonState("error");
        setErrorMessage(
          error instanceof Error && error.message === "TIMEOUT"
            ? "Timed out waiting for response — showing a standard lesson"
            : "Couldn't generate a personalized lesson"
        );
      }
    },
    [character, generateLesson]
  );

  // Auto-load on mount
  useEffect(() => {
    if (character?.grade) {
      loadLesson();
    }
  }, [character?.grade, loadLesson]);

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
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const speak = useCallback(() => {
    const text = lessonTextRef.current;
    if (!text) return;

    // Resume from pause
    if (isPausedRef.current) {
      window.speechSynthesis.resume();
      isPausedRef.current = false;
      setIsPaused(false);
      setIsTalking(true);

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

    // Fresh start
    setProgress(0);
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
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

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsTalking(true);

    const totalLength = text.length;
    const estimatedDuration = (totalLength / (0.9 * 150)) * 1000;
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
  }, []);

  const pauseSpeaking = useCallback(() => {
    window.speechSynthesis.pause();
    isPausedRef.current = true;
    setIsPaused(true);
    setIsTalking(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    playPop();
    if (!isPlaying) {
      speak();
    } else if (isPaused) {
      speak();
    } else {
      pauseSpeaking();
    }
  }, [isPlaying, isPaused, speak, pauseSpeaking]);

  // Loading / null guard
  if (character === undefined || character === null || !character.grade) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-grid">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
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

      <Confetti trigger={showConfetti} color={themeColor} type="sparkles" />

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
            <MascotCharacter color={themeColor} size={24} />
            <span className="text-sm font-medium text-foreground">
              {character.name}
            </span>
          </div>
        </div>

        {/* Character — no Framer Motion wrapper, mascot handles its own animation */}
        <div className="mb-8 flex flex-col items-center">
          <div
            className="clay-card-lg flex items-center justify-center rounded-full p-1.5"
            style={{ backgroundColor: `${themeColor}15` }}
          >
            <MascotCharacter
              color={themeColor}
              size={200}
              reaction={mascotReaction || (isTalking ? "talking" : "idle")}
              accessories={character?.accessories}
            />
          </div>

          <motion.p
            key={isTalking ? "talking" : lessonState}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-sm text-muted-foreground"
          >
            {isTalking
              ? `${character.name} is vibing while you listen...`
              : lessonState === "loading"
                ? `${character.name} is cooking up something fun...`
                : lessonState === "error"
                  ? `${character.name} had a hiccup, but has a backup ready!`
                  : `${character.name} is pumped to teach you!`}
          </motion.p>
        </div>

        {/* Lesson card */}
        <Card className="clay-card-lg border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {character.topic || "Today's Lesson"}
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  {character.subject} · {character.grade}
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
            {/* Loading state */}
            {lessonState === "loading" && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2
                  className="h-8 w-8 animate-spin mb-4"
                  style={{ color: themeColor }}
                />
                <p className="text-sm text-muted-foreground text-center">
                  {character.name} is cooking up something fun to teach
                  you... 🍳
                </p>
                <p className="text-xs text-muted-foreground/50 mt-2">
                  Great lessons can't be rushed!
                </p>
              </div>
            )}

            {/* Error banner with retry */}
            {lessonState === "error" && (
              <div className="clay-card rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {isUsingFallback
                      ? "Oops! The personal touch hit a snag"
                      : "Something went sideways"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {errorMessage || "No worries — we've got a backup lesson ready for you."}
                  </p>
                </div>
                <Button
                  onClick={() => loadLesson(true)}
                  variant="outline"
                  size="sm"
                  className="clay-btn shrink-0 border-white/5 bg-white/[0.03] text-xs"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Try again
                </Button>
              </div>
            )}

            {/* Progress bar */}
            {lessonState !== "loading" && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="clay-input h-3 overflow-hidden rounded-full p-0">
                  <div
                    className="h-full rounded-full transition-[width] duration-100 ease-linear"
                    style={{
                      backgroundColor: themeColor,
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Lesson text */}
            {lessonState !== "loading" && lessonText && (
              <div className="clay-input rounded-2xl p-5">
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                  {lessonText}
                </p>
              </div>
            )}

            {/* Controls */}
            {lessonState !== "loading" && lessonText && (
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
                  onClick={() => loadLesson(true)}
                  variant="outline"
                  size="icon"
                  className="clay-btn h-12 w-12 rounded-2xl border-white/5 bg-white/[0.03]"
                  title="Regenerate lesson"
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Study tip — only when lesson is loaded */}
        {lessonState === "ready" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="clay-card mt-6 rounded-2xl p-5"
          >
            <p className="text-sm font-medium text-foreground">
              💡 Pro tip from {character.name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Follow along with the text while listening — it's like a
              superpower for your memory. You've got this! 💪
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
