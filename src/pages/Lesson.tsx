import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useAction, useMutation } from "convex/react";
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
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Zap,
} from "lucide-react";
import MascotCharacter from "@/components/MascotCharacter";
import type { MascotReaction } from "@/components/MascotCharacter";
import Confetti from "@/components/Confetti";
import { playCheer, playPop, playCorrect, playIncorrect } from "@/lib/sounds";
import { FALLBACK_LESSONS, PARTS_PER_TOPIC, getPartTitle, getInlineTestQuestions } from "@/lib/onboarding-data";
import { getCharacterVoiceSettings, applyVoiceToUtterance } from "@/lib/voice";
import FloatingShapes from "@/components/FloatingShapes";

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

type LessonPhase = "loading" | "ready" | "error" | "finished" | "test";

export default function Lesson() {
  const navigate = useNavigate();
  const character = useQuery(api.characters.getCharacter);
  const generateLesson = useAction(api.lessons.generateLesson);
  const advancePart = useMutation(api.lessons.advancePart);

  const [lessonText, setLessonText] = useState("");
  const [phase, setPhase] = useState<LessonPhase>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mascotReaction, setMascotReaction] = useState<MascotReaction>("idle");
  const [showConfetti, setShowConfetti] = useState(false);

  const [testAnswers, setTestAnswers] = useState<(number | null)[]>([]);
  const [testSubmitted, setTestSubmitted] = useState(false);

  const isPausedRef = useRef(false);
  const lessonTextRef = useRef("");
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { lessonTextRef.current = lessonText; }, [lessonText]);

  const themeColor = character ? COLOR_THEMES[character.colorTheme] || "#c084fc" : "#c084fc";
  const currentPart = character?.currentPart || 1;
  const totalParts = PARTS_PER_TOPIC;
  const partTitle = useMemo(() => character ? getPartTitle(character.subject || "", character.topic || "", currentPart) : "", [character, currentPart]);
  const testQuestions = useMemo(() => character ? getInlineTestQuestions(character.topic || "", currentPart) : [], [character, currentPart]);
  const testCorrectCount = useMemo(() => {
    if (!testSubmitted) return 0;
    let c = 0;
    testQuestions.forEach((q, i) => { if (testAnswers[i] === q.correctIndex) c++; });
    return c;
  }, [testSubmitted, testAnswers, testQuestions]);
  const testPassed = testCorrectCount >= Math.ceil(testQuestions.length * 0.5);

  useEffect(() => {
    if (character && character !== null && !character.grade) navigate("/onboarding");
  }, [character, navigate]);

  const loadLesson = useCallback(async () => {
    if (!character?.grade || !character?.subject || !character?.region || !character?.topic) return;
    setPhase("loading");
    setErrorMessage("");
    setIsUsingFallback(false);
    setLessonText("");
    setTestAnswers([]);
    setTestSubmitted(false);
    try {
      const result = await generateLesson({
        grade: character.grade, subject: character.subject, region: character.region,
        topic: character.topic, part: currentPart, totalParts, partTitle,
        companionName: character.name, companionDescription: character.description,
      });
      setLessonText(result.content);
      setPhase("ready");
      setShowConfetti(true);
      setMascotReaction("happy");
      playCheer();
      setTimeout(() => setMascotReaction("idle"), 3000);
    } catch (error) {
      const fallback = FALLBACK_LESSONS[character.subject] || FALLBACK_LESSONS["General Knowledge"];
      setLessonText(fallback);
      setIsUsingFallback(true);
      setPhase("error");
      setErrorMessage(error instanceof Error && error.message === "TIMEOUT" ? "Timed out — showing a standard lesson" : "Couldn't generate a personalized lesson");
    }
  }, [character, generateLesson, currentPart, totalParts, partTitle]);

  useEffect(() => { if (character?.grade) loadLesson(); }, [character?.grade, loadLesson]);
  useEffect(() => () => { window.speechSynthesis.cancel(); if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false); setIsPaused(false); setIsTalking(false); setProgress(0);
    if (progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; }
  }, []);

  const speak = useCallback(() => {
    const text = lessonTextRef.current;
    if (!text) return;
    if (isPausedRef.current) {
      window.speechSynthesis.resume();
      isPausedRef.current = false; setIsPaused(false); setIsTalking(true);
      progressIntervalRef.current = setInterval(() => { setProgress(p => p >= 100 ? (clearInterval(progressIntervalRef.current!), 100) : p + 0.3); }, 50);
      return;
    }
    setProgress(0); window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    applyVoiceToUtterance(utterance, getCharacterVoiceSettings(character?.voiceTone, character?.pitchPreference, character?.description || ""));
    utterance.onend = () => { setIsPlaying(false); setIsTalking(false); setProgress(100); setPhase("finished"); if (progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; } };
    utterance.onerror = () => { setIsPlaying(false); setIsTalking(false); setProgress(0); if (progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; } };
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true); setIsTalking(true);
    const dur = (text.length / (0.9 * 150)) * 1000;
    const inc = 50; const ppt = (inc / dur) * 100;
    progressIntervalRef.current = setInterval(() => { setProgress(p => { const n = p + ppt; if (n >= 100) { clearInterval(progressIntervalRef.current!); return 100; } return n; }); }, inc);
  }, [character]);

  const pauseSpeaking = useCallback(() => {
    window.speechSynthesis.pause(); isPausedRef.current = true; setIsPaused(true); setIsTalking(false);
    if (progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; }
  }, []);

  const togglePlayPause = useCallback(() => { playPop(); if (!isPlaying) speak(); else if (isPaused) speak(); else pauseSpeaking(); }, [isPlaying, isPaused, speak, pauseSpeaking]);

  const handleRepeatLesson = useCallback(() => { playPop(); setPhase("loading"); setTestAnswers([]); setTestSubmitted(false); loadLesson(); }, [loadLesson]);
  const handleStartTest = useCallback(() => { playPop(); setPhase("test"); setTestAnswers(testQuestions.map(() => null)); setTestSubmitted(false); }, [testQuestions]);
  const handleTestAnswer = useCallback((qi: number, ai: number) => { if (testSubmitted) return; playPop(); setTestAnswers(p => { const n = [...p]; n[qi] = ai; return n; }); }, [testSubmitted]);
  const handleSubmitTest = useCallback(async () => {
    if (testAnswers.some(a => a === null)) return;
    playPop(); setTestSubmitted(true);
    if (testCorrectCount >= Math.ceil(testQuestions.length * 0.5)) {
      playCorrect(); setMascotReaction("happy"); setShowConfetti(true); setTimeout(() => setMascotReaction("idle"), 3000);
      try { await advancePart(); } catch (e) { console.error("Failed to advance:", e); }
    } else { playIncorrect(); setMascotReaction("sad"); setTimeout(() => setMascotReaction("idle"), 2000); }
  }, [testAnswers, testCorrectCount, testQuestions, advancePart]);
  const handleBackToLesson = useCallback(() => { playPop(); setPhase("ready"); setTestAnswers([]); setTestSubmitted(false); }, []);
  const handleGoToNextPart = useCallback(() => { playPop(); setPhase("loading"); setTestAnswers([]); setTestSubmitted(false); loadLesson(); }, [loadLesson]);

  if (character === undefined || character === null || !character.grade) {
    return <div className="flex min-h-screen items-center justify-center bg-grid"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      <FloatingShapes count={10} />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]" style={{ backgroundColor: `${themeColor}12` }} />
        <div className="absolute bottom-1/4 -right-40 h-[400px] w-[400px] rounded-full bg-purple-600/8 blur-[100px]" />
        <div className="absolute top-1/3 -left-32 h-[300px] w-[300px] rounded-full bg-teal-500/5 blur-[100px]" />
      </div>
      <Confetti trigger={showConfetti} color={themeColor} type="sparkles" />

      <div className="relative mx-auto max-w-2xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button onClick={() => { stopSpeaking(); navigate("/dashboard"); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all duration-250">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </button>
          <div className="clay-card flex items-center gap-2 rounded-2xl px-3.5 py-1.5">
            <MascotCharacter color={themeColor} size={24} />
            <span className="text-sm font-medium text-foreground">{character.name}</span>
          </div>
        </div>

        {/* Part progress indicator */}
        {totalParts > 1 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">{partTitle}</span>
              <span className="text-xs font-bold" style={{ color: themeColor }}>Part {currentPart} of {totalParts}</span>
            </div>
            <div className="clay-input h-2 overflow-hidden rounded-full p-0">
              <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ backgroundColor: themeColor, width: `${(currentPart / totalParts) * 100}%` }} />
            </div>
            <div className="flex justify-between mt-1.5">
              {Array.from({ length: totalParts }).map((_, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold ${i + 1 < currentPart ? "text-white" : i + 1 === currentPart ? "text-white ring-2 ring-offset-1" : "bg-white/10 text-muted-foreground"}`}
                    style={i + 1 <= currentPart ? { backgroundColor: themeColor } : undefined}>
                    {i + 1 < currentPart ? "✓" : i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Character */}
        <div className="mb-8 flex flex-col items-center">
          <div className={`mascot-glow clay-card-lg flex items-center justify-center rounded-full p-1.5 ${isTalking ? "is-talking" : ""}`}
            style={{ backgroundColor: `${themeColor}15`, ["--mascot-glow-color" as string]: `${themeColor}30` }}>
            <MascotCharacter color={themeColor} size={200} reaction={mascotReaction || (isTalking ? "talking" : "idle")} accessories={character?.accessories} />
          </div>
          <motion.p key={isTalking ? "talking" : phase} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center text-sm text-muted-foreground">
            {isTalking ? `${character.name} is vibing while you listen...`
              : phase === "loading" ? `${character.name} is cooking up something fun...`
              : phase === "error" ? `${character.name} had a hiccup, but has a backup ready!`
              : phase === "finished" ? `${character.name} finished the lesson! What's next? 🎉`
              : phase === "test" ? (testSubmitted ? (testPassed ? `${character.name} is so proud of you! 🌟` : `${character.name} says: "No worries, let's try again!" 💪`) : `Quick check — how well did you listen? 🤔`)
              : `${character.name} is pumped to teach you!`}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {/* Loading */}
          {phase === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="clay-card-lg border-0"><CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" style={{ color: themeColor }} />
                  <p className="text-sm text-muted-foreground text-center">{character.name} is cooking up something fun to teach you... 🍳</p>
                  <p className="text-xs text-muted-foreground/50 mt-2">Great lessons can't be rushed!</p>
                </div>
              </CardContent></Card>
            </motion.div>
          )}

          {/* Error */}
          {phase === "error" && (
            <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="clay-card-lg border-0"><CardContent className="p-6 space-y-4">
                <div className="clay-card rounded-2xl p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{isUsingFallback ? "Oops! The personal touch hit a snag" : "Something went sideways"}</p>
                    <p className="text-xs text-muted-foreground mt-1">{errorMessage || "No worries — we've got a backup lesson ready for you."}</p>
                  </div>
                </div>
                <div className="clay-input rounded-2xl p-5"><p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">{lessonText}</p></div>
                <div className="flex items-center justify-center gap-4">
                  <Button onClick={stopSpeaking} disabled={!isPlaying} variant="outline" size="icon" className="clay-btn h-12 w-12 rounded-2xl border-white/5 bg-white/[0.03]"><Square className="h-5 w-5" /></Button>
                  <Button onClick={togglePlayPause} className="clay-glow flex h-16 w-16 items-center justify-center rounded-full p-0" style={{ backgroundColor: themeColor }}>
                    {isPlaying && !isPaused ? <Pause className="h-6 w-6 text-white" /> : <Play className="ml-1 h-6 w-6 text-white" />}
                  </Button>
                  <Button onClick={() => loadLesson()} variant="outline" size="icon" className="clay-btn h-12 w-12 rounded-2xl border-white/5 bg-white/[0.03]" title="Regenerate"><RefreshCw className="h-5 w-5" /></Button>
                </div>
              </CardContent></Card>
            </motion.div>
          )}

          {/* Lesson ready / playing / finished */}
          {(phase === "ready" || phase === "finished") && lessonText && (
            <motion.div key="lesson" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="clay-card-lg border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{partTitle || character.topic || "Today's Lesson"}</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">{character.subject} · {character.grade}</p>
                    </div>
                    <div className="clay-card flex h-10 w-10 items-center justify-center rounded-2xl" style={{ backgroundColor: `${themeColor}15` }}>
                      {isTalking ? <Volume2 className="h-5 w-5" style={{ color: themeColor }} /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground"><span>Narration</span><span>{Math.round(progress)}%</span></div>
                    <div className="clay-input h-3 overflow-hidden rounded-full p-0">
                      <div className="h-full rounded-full transition-[width] duration-100 ease-linear" style={{ backgroundColor: themeColor, width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="clay-input rounded-2xl p-5"><p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">{lessonText}</p></div>

                  {phase === "ready" && (
                    <div className="flex items-center justify-center gap-4">
                      <Button onClick={stopSpeaking} disabled={!isPlaying} variant="outline" size="icon" className="clay-btn h-12 w-12 rounded-2xl border-white/5 bg-white/[0.03]"><Square className="h-5 w-5" /></Button>
                      <Button onClick={togglePlayPause} className="clay-glow flex h-16 w-16 items-center justify-center rounded-full p-0" style={{ backgroundColor: themeColor }}>
                        {isPlaying && !isPaused ? <Pause className="h-6 w-6 text-white" /> : <Play className="ml-1 h-6 w-6 text-white" />}
                      </Button>
                      <Button onClick={() => loadLesson()} variant="outline" size="icon" className="clay-btn h-12 w-12 rounded-2xl border-white/5 bg-white/[0.03]" title="Regenerate"><RefreshCw className="h-5 w-5" /></Button>
                    </div>
                  )}

                  {/* End-of-lesson choice screen */}
                  {phase === "finished" && !isPlaying && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">🎉 Lesson Complete!</p>
                        <p className="text-sm text-muted-foreground mt-1">What would you like to do next?</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleRepeatLesson} className="clay-card clay-tile group flex flex-col items-center gap-3 rounded-2xl p-5 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${themeColor}15` }}>
                            <RotateCcw className="h-6 w-6" style={{ color: themeColor }} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground group-hover:text-purple-300 transition-colors">Repeat This Lesson</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Listen again from the start</p>
                          </div>
                        </button>
                        <button onClick={handleStartTest} className="clay-card clay-tile group flex flex-col items-center gap-3 rounded-2xl p-5 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15">
                            <Zap className="h-6 w-6 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground group-hover:text-purple-300 transition-colors">Quick Check ✨</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Test what you learned</p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {phase === "ready" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="clay-card mt-6 rounded-2xl p-5">
                  <p className="text-sm font-medium text-foreground">💡 Pro tip from {character.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Follow along with the text while listening — it's like a superpower for your memory. You've got this! 💪</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Inline test */}
          {phase === "test" && (
            <motion.div key="test" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="clay-card-lg border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5" style={{ color: themeColor }} /> Quick Check
                      </CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">{partTitle} · {testQuestions.length} questions</p>
                    </div>
                    {!testSubmitted && <Button onClick={handleBackToLesson} variant="outline" size="sm" className="clay-ghost rounded-2xl text-xs">Back to Lesson</Button>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {testQuestions.map((q, qi) => (
                    <div key={qi} className="space-y-2.5">
                      <p className="text-sm font-medium text-foreground">{qi + 1}. {q.question}</p>
                      <div className="grid grid-cols-1 gap-2">
                        {q.options.map((opt, oi) => {
                          const isSelected = testAnswers[qi] === oi;
                          const isCorrect = oi === q.correctIndex;
                          return (
                            <button key={oi} onClick={() => handleTestAnswer(qi, oi)} disabled={testSubmitted}
                              className={`clay-btn w-full rounded-2xl p-3 text-left text-sm font-medium transition-all duration-250 ${
                                testSubmitted && isCorrect ? "bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/50"
                                : testSubmitted && isSelected && !isCorrect ? "bg-rose-500/20 text-rose-300 ring-2 ring-rose-500/50"
                                : isSelected ? "bg-purple-500/20 text-purple-300"
                                : "bg-white/[0.03] text-foreground hover:bg-white/[0.06]"
                              }`}>
                              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">{String.fromCharCode(65 + oi)}</span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {!testSubmitted ? (
                    <Button onClick={handleSubmitTest} disabled={testAnswers.some(a => a === null)} className="clay-primary w-full rounded-2xl py-2.5 font-semibold disabled:opacity-30">
                      Submit Answers <CheckCircle2 className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="clay-card rounded-2xl p-5 text-center">
                        <p className="text-2xl font-bold" style={{ color: themeColor }}>{testCorrectCount}/{testQuestions.length}</p>
                        <p className="text-sm text-muted-foreground mt-1">{testPassed ? "🎉 Amazing work! You passed!" : "💪 Almost there! Give it another shot!"}</p>
                      </div>
                      <div className="flex gap-3">
                        {!testPassed ? (
                          <Button onClick={handleRepeatLesson} className="clay-primary flex-1 rounded-2xl py-2.5 font-semibold"><RotateCcw className="mr-2 h-4 w-4" /> Review & Retry</Button>
                        ) : (
                          <Button onClick={handleGoToNextPart} className="clay-primary flex-1 rounded-2xl py-2.5 font-semibold">
                            {currentPart < totalParts ? "Next Part" : "Back to Dashboard"} <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
