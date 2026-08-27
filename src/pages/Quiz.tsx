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
  Terminal,
  Users,
  Copy,
  Check,
  Trophy,
  Star,
  ArrowRight,
  Loader2,
  RotateCcw,
  Zap,
} from "lucide-react";
import MascotCharacter from "@/components/MascotCharacter";

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

type QuizPhase = "lobby" | "waiting" | "active" | "results";

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

  const themeColor = character
    ? COLOR_THEMES[character.colorTheme] || "#c084fc"
    : "#c084fc";

  // Poll room state every 2 seconds
  const room = useQuery(
    api.quiz.getRoom,
    roomCode ? { roomCode } : "skip"
  );

  // Handle room state changes
  useEffect(() => {
    if (!room) return;

    if (room.status === "waiting" && phase === "waiting") {
      // Still waiting
    }

    if (room.status === "active" && phase !== "active" && phase !== "results") {
      // Game started — load questions
      const qs = room.questions
        .map((id) => QUIZ_QUESTIONS.find((q) => q.id === id))
        .filter(Boolean) as QuizQuestion[];
      setQuestions(qs);
      setPhase("active");
      setSelectedAnswer(null);
    }

    if (room.status === "finished" && phase !== "results") {
      setPhase("results");
      // Record activity
      recordActivity().catch(() => {});
    }
  }, [room, phase, recordActivity]);

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

  const themeColorVal = character
    ? COLOR_THEMES[character.colorTheme] || "#c084fc"
    : "#c084fc";

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `${themeColorVal}10` }}
        />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 py-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-muted-foreground">
              Brainly<span className="text-purple-400"> Weird</span>
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
                <h1 className="text-2xl font-bold text-foreground">
                  Quiz Challenge
                </h1>
                <p className="mt-1 text-muted-foreground">
                  Challenge a friend to a head-to-head quiz!
                </p>
              </div>

              <div className="space-y-4">
                {/* Create Room */}
                <Card className="clay-card-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      Create a Room
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                      Generate a room code and share it with a friend.
                    </p>
                    <Button
                      onClick={handleCreateRoom}
                      className="clay-glow w-full rounded-xl bg-purple-500 text-white hover:bg-purple-400"
                    >
                      Create Room
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Join Room */}
                <Card className="clay-card-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-400" />
                      Join a Room
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Enter the 6-character room code from your friend.
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
                        className="clay-btn rounded-xl bg-amber-500 px-6 text-white hover:bg-amber-400 disabled:opacity-30"
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
                <MascotCharacter color={themeColorVal} size={100} />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Room Created!
              </h2>
              <p className="text-muted-foreground mb-6">
                Share this code with your friend:
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
                className="clay-btn rounded-xl border-white/5 bg-white/[0.03] mb-4"
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
                Waiting for opponent to join...
              </div>
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
                <div className="clay-card flex items-center gap-2 rounded-xl px-4 py-2">
                  <span className="text-sm font-semibold text-foreground">
                    {room.hostName}
                  </span>
                  <span className="text-lg font-bold" style={{ color: themeColorVal }}>
                    {hostScore}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Q{(room.currentQuestion || 0) + 1}/{totalQuestions}
                </div>
                <div className="clay-card flex items-center gap-2 rounded-xl px-4 py-2">
                  <span className="text-lg font-bold" style={{ color: themeColorVal }}>
                    {guestScore}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {room.guestName || "Opponent"}
                  </span>
                </div>
              </div>

              {/* Question */}
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
                      const isRevealed =
                        selectedAnswer !== null;

                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          disabled={selectedAnswer !== null}
                          className={`clay-btn w-full rounded-xl p-4 text-left text-sm font-medium transition-all ${
                            isRevealed && isCorrect
                              ? "bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/50"
                              : isRevealed && isSelected && !isCorrect
                                ? "bg-rose-500/20 text-rose-300 ring-2 ring-rose-500/50"
                                : isSelected
                                  ? "bg-purple-500/20 text-purple-300"
                                  : "bg-white/[0.03] text-foreground hover:bg-white/[0.06]"
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
                      {room.hostAnswers[room.currentQuestion] !== undefined &&
                      room.guestAnswers[room.currentQuestion] !== undefined
                        ? "Both players answered — next question coming..."
                        : "Waiting for opponent to answer..."}
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
              <div className="text-center mb-6">
                <MascotCharacter color={themeColorVal} size={100} />
                <h2 className="text-2xl font-bold text-foreground mt-4">
                  {hostScore > guestScore
                    ? isHost
                      ? "You Won! 🏆"
                      : `${room.hostName} Wins!`
                    : guestScore > hostScore
                      ? isHost
                        ? `${room.guestName} Wins!`
                        : "You Won! 🏆"
                      : "It's a Tie! 🤝"}
                </h2>
              </div>

              {/* Score comparison */}
              <Card className="clay-card-lg border-0 mb-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">{room.hostName}</p>
                      <p className="text-3xl font-bold" style={{ color: themeColorVal }}>
                        {hostScore}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {hostScore}/{totalQuestions} correct
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        vs
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">{room.guestName || "Opponent"}</p>
                      <p className="text-3xl font-bold" style={{ color: themeColorVal }}>
                        {guestScore}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {guestScore}/{totalQuestions} correct
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stars */}
              <div className="clay-card rounded-2xl p-5 mb-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Stars earned (including friend bonus!)
                </p>
                <div className="flex justify-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-8 w-8 ${
                        i <
                        (hostScore >= guestScore && isHost
                          ? scoreAnswers(room.questions, room.hostAnswers).stars
                          : scoreAnswers(room.questions, room.guestAnswers).stars)
                          ? "text-amber-400 fill-amber-400"
                          : "text-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  +5 bonus stars for playing with a friend!
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setPhase("lobby");
                    setRoomCode("");
                    setSelectedAnswer(null);
                  }}
                  variant="outline"
                  className="clay-btn flex-1 rounded-xl border-white/5 bg-white/[0.03]"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Play Again
                </Button>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="clay-glow flex-1 rounded-xl bg-purple-500 text-white hover:bg-purple-400"
                >
                  Back to Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
