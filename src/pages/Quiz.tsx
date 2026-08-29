import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  pickQuestions,
  scoreAnswers,
  QUIZ_QUESTIONS,
  type QuizQuestion,
} from "@/lib/quiz-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Crown,
  Users,
  Copy,
  Check,
  Trophy,
  Star,
  ArrowRight,
  Loader2,
  RotateCcw,
  Zap,
  Swords,
  Shield,
} from "lucide-react";
import MascotCharacter, { type MascotReaction } from "@/components/MascotCharacter";
import Confetti from "@/components/Confetti";
import { playCorrect, playIncorrect, playFanfare, playPop } from "@/lib/sounds";
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

const QUESTIONS_PER_QUIZ = 5;

type QuizPhase = "lobby" | "waiting" | "countdown" | "active" | "results";

export default function Quiz() {
  const navigate = useNavigate();
  const character = useQuery(api.characters.getCharacter);
  const createRoom = useMutation(api.quiz.createRoom);
  const joinRoom = useMutation(api.quiz.joinRoom);
  const submitAnswer = useMutation(api.quiz.submitAnswer);
  const recordActivity = useMutation(api.quiz.recordActivity);
  const addStars = useMutation(api.quiz.addStars);
  const awardAchievement = useMutation(api.quiz.awardAchievement);

  const [phase, setPhase] = useState<QuizPhase>("lobby");
  const [roomCode, setRoomCode] = useState("");
  const [joinInput, setJoinInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isHost, setIsHost] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [mascotReaction, setMascotReaction] = useState<MascotReaction>("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [starAwarded, setStarAwarded] = useState(false);
  const [isBotRoom, setIsBotRoom] = useState(false);

  const themeColor = character
    ? COLOR_THEMES[character.colorTheme] || "#fbbf24"
    : "#fbbf24";

  const room = useQuery(
    api.quiz.getRoom,
    roomCode ? { roomCode } : "skip"
  );

  useEffect(() => {
    if (!room) return;

    if (room.status === "waiting" && phase === "waiting") {
      // Still waiting
    }

    if (room.status === "active" && phase !== "active" && phase !== "results" && phase !== "countdown") {
      const qs = room.questions
        .map((id) => QUIZ_QUESTIONS.find((q) => q.id === id))
        .filter(Boolean) as QuizQuestion[];
      setQuestions(qs);
      // Start countdown
      setPhase("countdown");
      setCountdown(3);
    }

    if (room.status === "finished" && phase !== "results") {
      setPhase("results");
      recordActivity().catch(() => {});
    }
  }, [room, phase, recordActivity]);

  // Countdown timer
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("active");
      setSelectedAnswer(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  const handleCreateRoom = async () => {
    const q = pickQuestions(QUESTIONS_PER_QUIZ);
    try {
      const code = await createRoom({ questionIds: q.map((q) => q.id) });
      setRoomCode(code);
      setPhase("waiting");
      setIsHost(true);
    } catch (e) {
      console.error("Failed to create room:", e);
    }
  };

  const createBotRoom = useMutation(api.quiz.createBotRoom);

  const handleStartBotBattle = async () => {
    const q = pickQuestions(QUESTIONS_PER_QUIZ);
    try {
      const code = await createBotRoom({ questionIds: q.map((q) => q.id) });
      setRoomCode(code);
      setIsHost(true);
      setIsBotRoom(true);
      // Bot rooms start immediately, skip waiting phase
      setPhase("countdown");
      setCountdown(3);
    } catch (e) {
      console.error("Failed to create bot room:", e);
    }
  };

  const handleJoin = async () => {
    const code = joinInput.trim().toUpperCase();
    if (code.length !== 6) return;
    try {
      await joinRoom({ roomCode: code });
      setRoomCode(code);
      setIsHost(false);
    } catch (e) {
      console.error("Failed to join room:", e);
    }
  };

  const handleAnswer = async (answerIndex: number) => {
    if (selectedAnswer !== null || !room) return;
    setSelectedAnswer(answerIndex);

    const q = QUIZ_QUESTIONS.find((q) => q.id === room.questions[room.currentQuestion]);
    const correct = q ? answerIndex === q.correctIndex : false;
    setLastAnswerCorrect(correct);

    if (correct) {
      playCorrect();
      setMascotReaction("happy");
    } else {
      playIncorrect();
      setMascotReaction("sad");
    }

    setTimeout(() => setMascotReaction("idle"), 2000);

    const qIndex = room.currentQuestion;
    try {
      await submitAnswer({
        roomCode,
        questionIndex: qIndex,
        answerIndex,
      });
    } catch (e) {
      console.error("Failed to submit answer:", e);
    }
  };

  const currentQ = room
    ? QUIZ_QUESTIONS.find((q) => q.id === room.questions[room.currentQuestion])
    : questions[0];

  const hostScore = room?.hostScore ?? 0;
  const guestScore = room?.guestScore ?? 0;
  const totalQuestions = room?.questions.length ?? QUESTIONS_PER_QUIZ;

  const hostResult = room ? scoreAnswers(room.questions, room.hostAnswers) : { correct: 0, total: 0, stars: 0 };
  const guestResult = room ? scoreAnswers(room.questions, room.guestAnswers) : { correct: 0, total: 0, stars: 0 };
  const myResult = isHost ? hostResult : guestResult;
  const iWon = isHost ? hostScore > guestScore : guestScore > hostScore;
  const tie = hostScore === guestScore;

  useEffect(() => {
    if (phase === "results") {
      setShowConfetti(true);
      setMascotReaction("happy");
      playFanfare();
      setTimeout(() => setMascotReaction("idle"), 3000);
      // Award star for winning
      if (iWon && !starAwarded) {
        setStarAwarded(true);
        addStars({ amount: 1 }).catch(() => {});
        awardAchievement({ achievementId: "beat_a_friend" }).catch(() => {});
      }
    }
  }, [phase]);

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      <FloatingShapes count={12} />
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `${themeColor}12` }}
        />
        <div className="absolute bottom-0 -right-40 h-[400px] w-[400px] rounded-full bg-purple-600/8 blur-[100px]" />
        <div className="absolute top-1/2 -left-40 h-[350px] w-[350px] rounded-full bg-rose-500/5 blur-[100px]" />
      </div>

      <Confetti trigger={showConfetti} color={themeColor} type="confetti" />

      <div className="relative mx-auto max-w-2xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all duration-250"
          >
            <ArrowLeft className="h-4 w-4" />
            Kingdom
          </button>
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-muted-foreground">
              Quiz <span className="text-amber-400">Battle</span>
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ========== LOBBY ========== */}
          {phase === "lobby" && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-8 text-center">
                {/* Battle banners */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="clay-card flex h-16 w-12 items-center justify-center rounded-t-full bg-amber-500/15 border-b-4 border-amber-500/30">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">You</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Swords className="h-8 w-8 text-amber-400" />
                    <p className="text-[10px] font-medium text-amber-400">VS</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="clay-card flex h-16 w-12 items-center justify-center rounded-t-full bg-purple-500/15 border-b-4 border-purple-500/30">
                      <span className="text-2xl">⚔️</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">Challenger</span>
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-foreground">
                  Quiz Battle
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Challenge a fellow adventurer to a head-to-head duel!
                </p>
                <p className="mt-1 text-xs text-amber-400/80">
                  Winner earns 1 ⭐ Star!
                </p>
              </div>

              <div className="space-y-4">
                <Card className="clay-card-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-amber-400" />
                      Summon a Challenger
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                      Generate a battle code and share it with your opponent.
                    </p>
                  <Button
                    onClick={handleCreateRoom}
                    className="clay-primary w-full rounded-2xl py-2.5 font-semibold"
                  >
                    Create Battle Room
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  </CardContent>
                </Card>

                <Card className="clay-card-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span className="text-lg">\ud83e\udd16</span>
                      Train with Bot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                      Practice against a training bot to sharpen your skills!
                    </p>
                    <Button
                      onClick={handleStartBotBattle}
                      className="clay-primary w-full rounded-2xl py-2.5 font-semibold"
                    >
                      Start Bot Battle
                      <Zap className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="clay-card-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-amber-400" />
                      Accept a Challenge
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Enter the battle code from your opponent.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        value={joinInput}
                        onChange={(e) =>
                          setJoinInput(e.target.value.toUpperCase())
                        }
                        placeholder="ABC123"
                        maxLength={6}
                        className="clay-input text-center text-lg font-mono tracking-widest uppercase"
                      />
                      <Button
                        onClick={handleJoin}
                        disabled={joinInput.trim().length !== 6}
                        className="clay-primary rounded-2xl px-6 font-semibold disabled:opacity-30"
                      >
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* ========== WAITING ========== */}
          {phase === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="mb-6">
                <MascotCharacter color={themeColor} size={100} reaction="happy" accessories={character?.accessories} />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Challenge Issued! 🎯
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Share this battle code with your opponent:
              </p>

              <div className="clay-card-lg mx-auto max-w-xs rounded-2xl p-6 mb-6">
                <p className="text-3xl font-mono font-bold tracking-[0.3em] text-center text-foreground">
                  {roomCode || "..."}
                </p>
              </div>

              <Button
                onClick={() => {
                  navigator.clipboard.writeText(roomCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                variant="outline"
                className="clay-ghost rounded-2xl mb-4"
              >
                {copied ? (
                  <Check className="mr-2 h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy Code"}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning for worthy opponents...
              </div>
            </motion.div>
          )}

          {/* ========== COUNTDOWN ========== */}
          {phase === "countdown" && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <p className="text-8xl font-extrabold" style={{ color: themeColor }}>
                    {countdown > 0 ? countdown : "⚔️"}
                  </p>
                  <p className="mt-4 text-lg font-semibold text-foreground">
                    {countdown > 0 ? "Prepare for Battle!" : "FIGHT!"}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* ========== ACTIVE QUIZ ========== */}
          {phase === "active" && room && currentQ && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Scoreboard */}
              <div className="mb-6 flex items-center justify-between">
                <div className="clay-card flex items-center gap-2 rounded-2xl px-4 py-2.5">
                  <Shield className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-foreground">
                    {room.hostName}
                  </span>
                  <span className="text-lg font-bold" style={{ color: themeColor }}>
                    {hostScore}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Round {(room.currentQuestion || 0) + 1}/{totalQuestions}
                </div>
                <div className="clay-card flex items-center gap-2 rounded-2xl px-4 py-2.5">
                  <span className="text-lg font-bold" style={{ color: themeColor }}>
                    {guestScore}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {room.guestName || "Challenger"}
                  </span>
                  <Swords className="h-4 w-4 text-purple-400" />
                </div>
              </div>

              {/* Mascot + Question */}
              <div className="flex justify-center mb-4">
                <MascotCharacter
                  color={themeColor}
                  size={80}
                  reaction={mascotReaction || "idle"}
                  accessories={character?.accessories}
                />
              </div>
              <Card className="clay-card-lg border-0">
                <CardContent className="p-6 space-y-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {currentQ.subject}
                  </p>
                  <h2 className="text-lg font-bold text-foreground leading-snug">
                    {currentQ.question}
                  </h2>

                  <div className="space-y-3">
                    {currentQ.options.map((opt, i) => {
                      const isSelected = selectedAnswer === i;
                      const isCorrect = i === currentQ.correctIndex;
                      const isRevealed = selectedAnswer !== null;

                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          disabled={selectedAnswer !== null}
                          className={`clay-btn w-full rounded-2xl p-4 text-left text-sm font-medium transition-all duration-250 ${
                            isRevealed && isCorrect
                              ? "bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/50"
                              : isRevealed && isSelected && !isCorrect
                                ? "bg-rose-500/20 text-rose-300 ring-2 ring-rose-500/50"
                                : isSelected
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-amber-100/40 text-foreground hover:bg-amber-100/60"
                          }`}
                        >
                          <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">
                            {String.fromCharCode(65 + i)}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {selectedAnswer !== null && (
                    <p className="text-center text-xs text-muted-foreground">
                      {lastAnswerCorrect === true
                        ? "🎉 Nailed it!"
                        : lastAnswerCorrect === false
                          ? "😅 Almost! Keep fighting..."
                          : "Waiting for your opponent..."}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ========== RESULTS ========== */}
          {phase === "results" && room && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Victory/Defeat banner */}
              <div className="text-center mb-6">
                <MascotCharacter
                  color={themeColor}
                  size={100}
                  reaction={tie ? "idle" : "happy"}
                  accessories={character?.accessories}
                />
                <h2 className="text-2xl font-bold text-foreground mt-4">
                  {tie
                    ? "What a battle! It's a draw! 🤝"
                    : iWon
                      ? "⚔️ Victory! You conquered the challenger! 🏆"
                      : `${isHost ? room.guestName : room.hostName} bested you in combat! Train harder! 💪`}
                </h2>
              </div>

              {/* Battle results with crests */}
              <Card className="clay-card-lg border-0 mb-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-center">
                      <div className="clay-card flex h-12 w-12 items-center justify-center rounded-t-full mx-auto mb-2 bg-amber-500/15 border-b-2 border-amber-500/30">
                        <span className="text-lg">🛡️</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{room.hostName}</p>
                      <p className="text-3xl font-bold" style={{ color: themeColor }}>
                        {hostScore}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {hostScore}/{totalQuestions} correct
                      </p>
                    </div>
                    <div className="text-center">
                      <Swords className="h-6 w-6 text-amber-400 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Battle Result
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="clay-card flex h-12 w-12 items-center justify-center rounded-t-full mx-auto mb-2 bg-purple-500/15 border-b-2 border-purple-500/30">
                        <span className="text-lg">⚔️</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {room.guestName || "Challenger"}
                      </p>
                      <p className="text-3xl font-bold" style={{ color: themeColor }}>
                        {guestScore}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {guestScore}/{totalQuestions} correct
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Star reward */}
              {iWon && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="clay-card rounded-2xl p-5 text-center mb-4"
                >
                  <p className="text-sm font-medium text-foreground">Battle Victory Reward</p>
                  <p className="text-lg font-bold text-amber-300 mt-1">+1 ⭐ Star</p>
                  <p className="text-xs text-muted-foreground mt-1">Winner of the battle earns a Star!</p>
                </motion.div>
              )}

              <Button
                onClick={() => {
                  setPhase("lobby");
                  setRoomCode("");
                  setJoinInput("");
                  setSelectedAnswer(null);
                  setShowConfetti(false);
                }}
                className="clay-primary w-full rounded-2xl py-2.5 font-semibold"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Challenge Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
