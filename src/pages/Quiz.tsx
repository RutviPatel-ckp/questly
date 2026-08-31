import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  pickQuestions,
  pickQuestionsByTopic,
  scoreAnswers,
  QUIZ_QUESTIONS,
  BATTLE_TOPICS,
  type QuizQuestion,
  type BattleTopic,
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
  Timer,
  ChevronRight,
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

const BATTLE_QUESTIONS_COUNT = 3;
const TIMER_SECONDS = 30;

type QuizPhase = "lobby" | "topic-select" | "treasure" | "waiting" | "countdown" | "active" | "results";

interface BattleRoom {
  _id: string;
  roomCode: string;
  hostUserId: string;
  hostName: string;
  guestUserId?: string;
  guestName?: string;
  status: string;
  currentQuestion: number;
  hostAnswers: number[];
  guestAnswers: number[];
  hostScore: number;
  guestScore: number;
  questions: string[];
  battleTopic?: string;
  createdAt: number;
}

export default function Quiz() {
  const navigate = useNavigate();
  const character = useQuery(api.characters.getCharacter);
  const createRoom = useMutation(api.quiz.createRoom);
  const createBotRoom = useMutation(api.quiz.createBotRoom);
  const joinRoom = useMutation(api.quiz.joinRoom);
  const submitAnswer = useMutation(api.quiz.submitAnswer);
  const recordActivity = useMutation(api.quiz.recordActivity);
  const addStars = useMutation(api.quiz.addStars);
  const awardAchievement = useMutation(api.quiz.awardAchievement);

  // Phase management
  const [phase, setPhase] = useState<QuizPhase>("lobby");
  const [battleMode, setBattleMode] = useState<"bot" | "friend">("bot");
  const [roomCode, setRoomCode] = useState("");
  const [joinInput, setJoinInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isHost, setIsHost] = useState(true);

  // Battle state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [mascotReaction, setMascotReaction] = useState<MascotReaction>("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [starAwarded, setStarAwarded] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Topic
  const [selectedTopic, setSelectedTopic] = useState<BattleTopic | null>(null);

  // Treasure
  const [chestOpened, setChestOpened] = useState(false);

  // Bot simulation
  const [botSimAnswers, setBotSimAnswers] = useState<(number | null)[]>([]);
  const [currentBotScore, setCurrentBotScore] = useState(0);
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const botAnsweredRef = useRef<Set<number>>(new Set());

  // Per-question round results
  const [roundResults, setRoundResults] = useState<(boolean | null)[]>([]);

  const themeColor = character
    ? COLOR_THEMES[character.colorTheme] || "#fbbf24"
    : "#fbbf24";

  const room: BattleRoom | null | undefined = useQuery(
    api.quiz.getRoom,
    roomCode ? { roomCode } : "skip"
  );

  // ========== COMPUTED ==========
  const currentQIndex = room?.currentQuestion ?? 0;
  const currentQ = questions[currentQIndex] ?? null;
  const totalQuestions = questions.length || BATTLE_QUESTIONS_COUNT;
  const hostScore = room?.hostScore ?? 0;
  const guestScore = room?.guestScore ?? 0;
  const myScore = isHost ? hostScore : guestScore;
  const opponentScore = isHost ? guestScore : hostScore;
  const myResult = room ? scoreAnswers(room.questions, isHost ? room.hostAnswers : room.guestAnswers) : { correct: 0, total: 0, stars: 0 };
  const iWon = myScore > opponentScore;
  const tie = myScore === opponentScore && myScore > 0;

  // ========== TIMER ==========
  const startTimer = useCallback(() => {
    setTimeLeft(TIMER_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [stopTimer]);

  // ========== PHASE TRANSITIONS ==========
  useEffect(() => {
    if (!room) return;

    // Waiting -> Active (friend joined)
    if (room.status === "active" && phase === "waiting") {
      const qs = room.questions
        .map((id) => QUIZ_QUESTIONS.find((q) => q.id === id))
        .filter(Boolean) as QuizQuestion[];
      setQuestions(qs);
      setPhase("countdown");
      setCountdown(3);
    }

    // Bot room starts immediately
    if (room.status === "active" && phase === "treasure" && battleMode === "bot") {
      // This shouldn't happen since we skip treasure for bot
    }

    // Finished
    if (room.status === "finished" && phase !== "results") {
      stopTimer();
      setPhase("results");
      recordActivity().catch(() => {});
    }
  }, [room, phase, battleMode, recordActivity, stopTimer]);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("active");
      setSelectedAnswer(null);
      startTimer();
      // Start bot simulation for bot rooms
      if (battleMode === "bot") {
        scheduleBotAnswers();
      }
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown, startTimer, battleMode]);

  // Timer runs out — auto-submit for user and advance
  useEffect(() => {
    if (phase !== "active" || timeLeft > 0 || selectedAnswer !== null) return;
    // Time ran out — user didn't answer
    handleAnswer(-1);
  }, [timeLeft, phase, selectedAnswer]);

  // ========== BOT SIMULATION ==========
  const scheduleBotAnswers = useCallback(() => {
    // Clear any existing bot timers
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    botAnsweredRef.current.clear();

    // For each question, schedule a bot answer at random time (8-28s)
    const scheduleForQuestion = (qIdx: number) => {
      if (qIdx >= totalQuestions) return;
      const delay = (8 + Math.random() * 20) * 1000; // 8-28 seconds
      botTimerRef.current = setTimeout(() => {
        if (botAnsweredRef.current.has(qIdx)) return;
        // Bot answers
        const q = questions[qIdx];
        if (!q) return;
        // 65% chance correct
        const botAnswer = Math.random() < 0.65
          ? q.correctIndex
          : [0, 1, 2, 3].filter((i) => i !== q.correctIndex)[Math.floor(Math.random() * 3)];
        botAnsweredRef.current.add(qIdx);
        setBotSimAnswers((prev) => {
          const next = [...prev];
          next[qIdx] = botAnswer;
          return next;
        });
        // Calculate bot score
        setBotSimAnswers((prev) => {
          let score = 0;
          for (let i = 0; i <= qIdx; i++) {
            const pq = questions[i];
            const ba = i === qIdx ? botAnswer : prev[i];
            if (pq && ba === pq.correctIndex) score++;
          }
          setCurrentBotScore(score);
          return prev;
        });
      }, delay);
    };

    scheduleForQuestion(0);
  }, [questions, totalQuestions]);

  // ========== HANDLERS ==========
  const handleSelectTopic = (topic: BattleTopic) => {
    setSelectedTopic(topic);
    if (battleMode === "bot") {
      setPhase("treasure");
    } else {
      setPhase("treasure");
    }
  };

  const handleOpenChest = async () => {
    setChestOpened(true);
    playPop();

    // After reveal animation, create the room
    setTimeout(async () => {
      if (!selectedTopic) return;
      const qs = pickQuestionsByTopic(selectedTopic.id, BATTLE_QUESTIONS_COUNT);
      const qIds = qs.map((q) => q.id);
      setQuestions(qs);

      try {
        if (battleMode === "bot") {
          const code = await createBotRoom({
            questionIds: qIds,
            battleTopic: selectedTopic.name,
          });
          setRoomCode(code);
          setIsHost(true);
          setBotSimAnswers(new Array(BATTLE_QUESTIONS_COUNT).fill(null));
          setCurrentBotScore(0);
          botAnsweredRef.current.clear();
          setRoundResults(new Array(BATTLE_QUESTIONS_COUNT).fill(null));
          setPhase("countdown");
          setCountdown(3);
        } else {
          const code = await createRoom({
            questionIds: qIds,
            battleTopic: selectedTopic.name,
          });
          setRoomCode(code);
          setIsHost(true);
          setPhase("waiting");
        }
      } catch (e) {
        console.error("Failed to create room:", e);
        setPhase("lobby");
      }
    }, 2200); // Wait for chest animation
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
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    stopTimer();

    const q = currentQ;
    if (!q || !room) return;

    const correct = answerIndex >= 0 && answerIndex === q.correctIndex;
    setLastAnswerCorrect(correct);

    // Record round result
    setRoundResults((prev) => {
      const next = [...prev];
      next[currentQIndex] = correct;
      return next;
    });

    if (correct) {
      playCorrect();
      setMascotReaction("happy");
    } else if (answerIndex >= 0) {
      playIncorrect();
      setMascotReaction("sad");
    } else {
      setMascotReaction("sad");
    }

    setTimeout(() => setMascotReaction("idle"), 2000);

    try {
      // For bot rooms, submit timeout (-1 mapped to 0) or actual answer
      const submitIdx = answerIndex >= 0 ? answerIndex : 0;
      await submitAnswer({
        roomCode,
        questionIndex: currentQIndex,
        answerIndex: submitIdx,
      });
    } catch (e) {
      console.error("Failed to submit answer:", e);
    }

    // For bot rooms, advance to next question after delay
    if (battleMode === "bot") {
      setTimeout(() => {
        if (currentQIndex + 1 < totalQuestions) {
          // Advance locally — the room might already be advanced
          // Reset for next question
          setSelectedAnswer(null);
          setLastAnswerCorrect(null);
          startTimer();
          // Schedule next bot answer
          const nextIdx = currentQIndex + 1;
          const delay = (8 + Math.random() * 20) * 1000;
          if (botTimerRef.current) clearTimeout(botTimerRef.current);
          botTimerRef.current = setTimeout(() => {
            if (botAnsweredRef.current.has(nextIdx)) return;
            const nq = questions[nextIdx];
            if (!nq) return;
            const ba = Math.random() < 0.65
              ? nq.correctIndex
              : [0, 1, 2, 3].filter((i) => i !== nq.correctIndex)[Math.floor(Math.random() * 3)];
            botAnsweredRef.current.add(nextIdx);
            setBotSimAnswers((prev) => {
              const nn = [...prev];
              nn[nextIdx] = ba;
              return nn;
            });
            let score = 0;
            for (let i = 0; i <= nextIdx; i++) {
              const pq = questions[i];
              const pa = i === nextIdx ? ba : botSimAnswers[i];
              if (pq && pa === pq.correctIndex) score++;
            }
            setCurrentBotScore(score);
          }, delay);
        }
      }, 1500);
    }
  };

  // Results phase
  useEffect(() => {
    if (phase === "results") {
      setShowConfetti(true);
      setMascotReaction("happy");
      playFanfare();
      setTimeout(() => setMascotReaction("idle"), 3000);
      if (iWon && !starAwarded) {
        setStarAwarded(true);
        addStars({ amount: 1 }).catch(() => {});
        awardAchievement({ achievementId: "beat-friend" }).catch(() => {});
      }
    }
  }, [phase]);

  const resetBattle = () => {
    setPhase("lobby");
    setRoomCode("");
    setJoinInput("");
    setSelectedAnswer(null);
    setShowConfetti(false);
    setStarAwarded(false);
    setChestOpened(false);
    setSelectedTopic(null);
    setBotSimAnswers([]);
    setCurrentBotScore(0);
    botAnsweredRef.current.clear();
    setRoundResults([]);
    setLastAnswerCorrect(null);
    stopTimer();
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
  };

  // ========== RENDER ==========
  const timerColor = timeLeft > 15 ? "#34d399" : timeLeft > 7 ? "#fbbf24" : "#fb7185";

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
                {/* Bot Battle */}
                <Card
                  className={`clay-card-lg border-0 cursor-pointer transition-all duration-250 ${
                    battleMode === "bot" ? "ring-2 ring-amber-400/50" : ""
                  }`}
                  onClick={() => setBattleMode("bot")}
                >
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span className="text-lg">🤖</span>
                      Train with Bot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Practice against a training bot to sharpen your skills!
                    </p>
                  </CardContent>
                </Card>

                {/* Friend Battle */}
                <Card
                  className={`clay-card-lg border-0 cursor-pointer transition-all duration-250 ${
                    battleMode === "friend" ? "ring-2 ring-amber-400/50" : ""
                  }`}
                  onClick={() => setBattleMode("friend")}
                >
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-amber-400" />
                      Challenge a Friend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Generate a battle code and share it with your opponent.
                    </p>
                  </CardContent>
                </Card>

                {/* Join (only in friend mode) */}
                {battleMode === "friend" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card className="clay-card-lg border-0">
                      <CardContent className="pt-6 space-y-3">
                        <p className="text-xs text-muted-foreground">
                          Or enter a battle code from your opponent:
                        </p>
                        <div className="flex gap-2">
                          <Input
                            value={joinInput}
                            onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
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
                  </motion.div>
                )}

                {/* Start Battle Button */}
                <Button
                  onClick={() => setPhase("topic-select")}
                  className="clay-primary w-full rounded-2xl py-3 font-semibold text-base"
                >
                  {battleMode === "bot" ? "Choose Your Quest" : "Create Battle Room"}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ========== TOPIC SELECT ========== */}
          {phase === "topic-select" && (
            <motion.div
              key="topic-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-foreground">
                  ⚔️ Choose Your Battlefield
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Select a topic for your {battleMode === "bot" ? "training" : "battle"} quiz
                </p>
                <p className="mt-1 text-xs text-amber-400/80">
                  3 questions · 30 seconds each · First to answer wins!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {BATTLE_TOPICS.map((topic) => (
                  <motion.button
                    key={topic.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectTopic(topic)}
                    className="clay-card clay-tile p-5 text-left transition-all duration-250 hover:ring-2"
                    style={{ ["--tw-ring-color" as string]: topic.color + "80" }}
                  >
                    <span className="text-3xl block mb-2">{topic.emoji}</span>
                    <h3 className="text-sm font-bold text-foreground">{topic.name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      3 {topic.name} questions
                    </p>
                  </motion.button>
                ))}
              </div>

              <Button
                onClick={() => setPhase("lobby")}
                variant="ghost"
                className="clay-ghost w-full mt-4 rounded-2xl"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </motion.div>
          )}

          {/* ========== TREASURE CHEST REVEAL ========== */}
          {phase === "treasure" && selectedTopic && (
            <motion.div
              key="treasure"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              {!chestOpened ? (
                <>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg font-bold text-foreground mb-8 text-center"
                  >
                    🎁 Open the Treasure Chest to reveal your quest!
                  </motion.p>

                  {/* Treasure Chest */}
                  <motion.button
                    whileHover={{ scale: 1.08, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenChest}
                    className="relative cursor-pointer focus:outline-none"
                  >
                    {/* Glow behind chest */}
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 40px 10px rgba(251,191,36,0.3)",
                          "0 0 80px 20px rgba(251,191,36,0.5)",
                          "0 0 40px 10px rgba(251,191,36,0.3)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-3xl"
                    />

                    {/* Sparkles around chest */}
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3], rotate: [0, 15, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                      className="absolute -top-4 -left-4 text-2xl"
                    >
                      ✨
                    </motion.div>
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5], rotate: [0, -10, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
                      className="absolute -top-2 -right-6 text-xl"
                    >
                      💫
                    </motion.div>
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4], y: [0, -5, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                      className="absolute -bottom-3 right-0 text-lg"
                    >
                      ⭐
                    </motion.div>

                    {/* Chest body */}
                    <div className="relative w-48 h-40">
                      {/* Chest base */}
                      <div className="absolute bottom-0 w-full h-24 rounded-b-2xl rounded-t-lg"
                        style={{ background: "linear-gradient(180deg, #8B6914, #654A0E)" }}
                      >
                        {/* Wood grain lines */}
                        <div className="absolute inset-0 rounded-b-2xl overflow-hidden opacity-30">
                          <div className="absolute top-4 left-4 right-4 h-[1px] bg-amber-200/40" />
                          <div className="absolute top-8 left-6 right-6 h-[1px] bg-amber-200/40" />
                          <div className="absolute top-12 left-3 right-3 h-[1px] bg-amber-200/40" />
                          <div className="absolute top-16 left-5 right-5 h-[1px] bg-amber-200/40" />
                        </div>
                        {/* Metal bands */}
                        <div className="absolute top-3 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-sm" />
                        <div className="absolute bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-sm" />
                        {/* Lock */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-700 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-amber-800" />
                        </div>
                      </div>

                      {/* Chest lid */}
                      <motion.div
                        className="absolute top-0 w-full h-20 rounded-t-2xl"
                        style={{ background: "linear-gradient(180deg, #A07820, #8B6914)" }}
                        animate={!chestOpened ? {} : { rotateX: -70, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        {/* Lid metal band */}
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-sm" />
                        {/* Lid highlight */}
                        <div className="absolute top-2 left-4 right-4 h-[1px] bg-amber-300/30" />
                      </motion.div>

                      {/* Glow when hovering */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
                        animate={{
                          background: [
                            "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)",
                            "radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)",
                            "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </motion.button>

                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mt-8 text-sm text-amber-400 font-medium"
                  >
                    Tap the chest to begin! ✨
                  </motion.p>
                </>
              ) : (
                /* Chest opened — reveal topic */
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-7xl mb-6"
                  >
                    {selectedTopic.emoji}
                  </motion.div>
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-3xl font-extrabold text-foreground mb-3"
                    style={{ color: selectedTopic.color }}
                  >
                    {selectedTopic.name}!
                  </motion.h2>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-sm text-muted-foreground"
                  >
                    Get ready for {BATTLE_QUESTIONS_COUNT} questions...
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ========== WAITING (Friend mode) ========== */}
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
              <p className="text-sm text-muted-foreground mb-2">
                Share this battle code with your opponent:
              </p>
              {selectedTopic && (
                <p className="text-xs mb-4 font-medium" style={{ color: selectedTopic.color }}>
                  Topic: {selectedTopic.emoji} {selectedTopic.name}
                </p>
              )}

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
              {selectedTopic && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 text-center"
                >
                  <span className="text-5xl">{selectedTopic.emoji}</span>
                  <p className="mt-2 text-lg font-bold" style={{ color: selectedTopic.color }}>
                    {selectedTopic.name}
                  </p>
                </motion.div>
              )}

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

          {/* ========== ACTIVE BATTLE ========== */}
          {phase === "active" && currentQ && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex gap-4">
                {/* Main battle area */}
                <div className="flex-1 min-w-0">
                  {/* Timer bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4" style={{ color: timerColor }} />
                        <span className="text-sm font-bold" style={{ color: timerColor }}>
                          {timeLeft}s
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        Round {currentQIndex + 1}/{totalQuestions}
                      </div>
                    </div>
                    {/* Timer bar */}
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: timerColor }}
                        animate={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Subject badge */}
                  {selectedTopic && (
                    <div className="mb-3 text-center">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                        style={{ backgroundColor: selectedTopic.color + "20", color: selectedTopic.color }}
                      >
                        {selectedTopic.emoji} {selectedTopic.name}
                      </span>
                    </div>
                  )}

                  {/* Mascot */}
                  <div className="flex justify-center mb-3">
                    <MascotCharacter
                      color={themeColor}
                      size={70}
                      reaction={mascotReaction || "idle"}
                      accessories={character?.accessories}
                    />
                  </div>

                  {/* Question Card */}
                  <Card className="clay-card-lg border-0">
                    <CardContent className="p-5 space-y-4">
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                        {currentQ.subject}
                      </p>
                      <h2 className="text-base font-bold text-foreground leading-snug">
                        {currentQ.question}
                      </h2>

                      <div className="space-y-2.5">
                        {currentQ.options.map((opt, i) => {
                          const isSelected = selectedAnswer === i;
                          const isCorrect = i === currentQ.correctIndex;
                          const isRevealed = selectedAnswer !== null;

                          // Bot answer indicator
                          const botAnswer = battleMode === "bot" ? botSimAnswers[currentQIndex] : null;
                          const isBotAnswer = botAnswer === i;
                          const showBotIndicator = isRevealed && isBotAnswer && battleMode === "bot";

                          return (
                            <button
                              key={i}
                              onClick={() => handleAnswer(i)}
                              disabled={selectedAnswer !== null}
                              className={`clay-btn w-full rounded-2xl p-3.5 text-left text-sm font-medium transition-all duration-250 ${
                                isRevealed && isCorrect
                                  ? "bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/50"
                                  : isRevealed && isSelected && !isCorrect
                                    ? "bg-rose-500/20 text-rose-300 ring-2 ring-rose-500/50"
                                    : isRevealed && showBotIndicator
                                      ? "bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/30"
                                      : isSelected
                                        ? "bg-amber-500/20 text-amber-300"
                                        : "bg-amber-100/40 text-foreground hover:bg-amber-100/60"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs">
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className="flex-1">{opt}</span>
                                {showBotIndicator && (
                                  <span className="text-[10px] text-purple-400 font-medium">🤖 Bot</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {selectedAnswer !== null && (
                        <motion.p
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center text-xs text-muted-foreground"
                        >
                          {lastAnswerCorrect === true
                            ? "🎉 Nailed it! Lightning fast!"
                            : lastAnswerCorrect === false
                              ? "😅 Not quite — keep fighting!"
                              : "⏰ Time's up! Moving to the next question..."}
                        </motion.p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Side Panel — Scoreboard */}
                <div className="hidden sm:block w-48 flex-shrink-0">
                  <div className="sticky top-8 space-y-3">
                    {/* Score comparison */}
                    <div className="clay-card rounded-2xl p-4">
                      <div className="text-center mb-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Scoreboard</p>
                      </div>

                      {/* My score */}
                      <div className="flex items-center gap-2 mb-3 p-2 rounded-xl bg-amber-500/10">
                        <Shield className="h-4 w-4 text-amber-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-muted-foreground truncate">You</p>
                          <p className="text-lg font-bold" style={{ color: themeColor }}>{myScore}</p>
                        </div>
                      </div>

                      {/* Opponent score */}
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-500/10">
                        <Swords className="h-4 w-4 text-purple-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-muted-foreground truncate">
                            {battleMode === "bot" ? "🤖 Bot" : room?.guestName || "Rival"}
                          </p>
                          <p className="text-lg font-bold text-purple-400">{opponentScore}</p>
                        </div>
                      </div>
                    </div>

                    {/* Round indicators */}
                    <div className="clay-card rounded-2xl p-4">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide text-center mb-2">
                        Rounds
                      </p>
                      <div className="space-y-2">
                        {Array.from({ length: totalQuestions }).map((_, i) => {
                          const isCompleted = roundResults[i] !== null && roundResults[i] !== undefined;
                          const isCurrent = i === currentQIndex;
                          const result = roundResults[i];

                          return (
                            <div
                              key={i}
                              className={`flex items-center gap-2 text-xs ${
                                isCurrent ? "font-bold" : ""
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                                  isCompleted
                                    ? result
                                      ? "bg-emerald-500/30 text-emerald-400"
                                      : "bg-rose-500/30 text-rose-400"
                                    : isCurrent
                                      ? "bg-amber-500/30 text-amber-400 ring-2 ring-amber-400/50"
                                      : "bg-white/5 text-muted-foreground"
                                }`}
                              >
                                {isCompleted ? (result ? "✓" : "✗") : i + 1}
                              </div>
                              <span className={`${
                                isCurrent ? "text-foreground" : "text-muted-foreground"
                              }`}>
                                Q{i + 1}
                                {isCompleted && result !== null && (
                                  <span className="ml-1 text-[10px]">
                                    {result ? "✅" : "❌"}
                                  </span>
                                )}
                                {isCurrent && !isCompleted && (
                                  <span className="ml-1 text-[10px] text-amber-400">◀</span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bot indicator */}
                    {battleMode === "bot" && (
                      <div className="clay-card rounded-2xl p-3 text-center">
                        <p className="text-[10px] text-muted-foreground">🤖 Training Bot</p>
                        <p className="text-xs text-purple-400 font-medium mt-1">
                          Thinking...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== RESULTS ========== */}
          {phase === "results" && (
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
                      : `${isHost ? (room?.guestName || "The Bot") : (room?.hostName || "The Bot")} bested you! Train harder! 💪`}
                </h2>
                {selectedTopic && (
                  <p className="mt-2 text-sm" style={{ color: selectedTopic.color }}>
                    {selectedTopic.emoji} {selectedTopic.name} Battle
                  </p>
                )}
              </div>

              {/* Battle results */}
              <Card className="clay-card-lg border-0 mb-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-center">
                      <div className="clay-card flex h-12 w-12 items-center justify-center rounded-t-full mx-auto mb-2 bg-amber-500/15 border-b-2 border-amber-500/30">
                        <span className="text-lg">🛡️</span>
                      </div>
                      <p className="text-sm text-muted-foreground">You</p>
                      <p className="text-3xl font-bold" style={{ color: themeColor }}>
                        {myScore}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {myResult.correct}/{myResult.total} correct
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
                        <span className="text-lg">{battleMode === "bot" ? "🤖" : "⚔️"}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {battleMode === "bot" ? "Bot" : (room?.guestName || "Rival")}
                      </p>
                      <p className="text-3xl font-bold text-purple-400">
                        {opponentScore}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isHost ? scoreAnswers(room?.questions || [], room?.guestAnswers || []).correct : scoreAnswers(room?.questions || [], room?.hostAnswers || []).correct}/{totalQuestions} correct
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Round breakdown */}
              <Card className="clay-card-lg border-0 mb-4">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide text-center mb-3">
                    Round-by-Round
                  </p>
                  <div className="flex justify-center gap-3">
                    {roundResults.map((result, i) => (
                      <div key={i} className="text-center">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                            result === true
                              ? "bg-emerald-500/20 text-emerald-400"
                              : result === false
                                ? "bg-rose-500/20 text-rose-400"
                                : "bg-white/5 text-muted-foreground"
                          }`}
                        >
                          {result === true ? "✓" : result === false ? "✗" : "—"}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Q{i + 1}</p>
                      </div>
                    ))}
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
                onClick={resetBattle}
                className="clay-primary w-full rounded-2xl py-2.5 font-semibold"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Battle Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
