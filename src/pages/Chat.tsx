import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  createSession,
  getTutorResponse,
  isShortcutAttempt,
  calculateScore,
  type TutorState,
  type SessionQuestion,
} from "@/lib/socratic-tutor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Terminal,
  Send,
  Lightbulb,
  Trophy,
  RotateCcw,
  Sparkles,
  Star,
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

interface ChatMessage {
  id: string;
  role: "tutor" | "student";
  content: string;
  timestamp: number;
}

function HintMeter({
  hintLevel,
  maxLevel,
}: {
  hintLevel: number;
  maxLevel: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: maxLevel }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-5 rounded-full transition-all duration-300 ${
            i < hintLevel
              ? hintLevel <= 1
                ? "bg-emerald-400"
                : hintLevel <= 2
                  ? "bg-amber-400"
                  : "bg-rose-400"
              : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

function ScoreDisplay({
  points,
  className = "",
}: {
  points: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-2xl bg-purple-500/15 px-2.5 py-0.5 text-xs font-semibold text-purple-300 ${className}`}
    >
      <Star className="h-3 w-3" />
      {points}
    </span>
  );
}

export default function Chat() {
  const navigate = useNavigate();
  const character = useQuery(api.characters.getCharacter);

  const [session, setSession] = useState<TutorState | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const themeColor = character
    ? COLOR_THEMES[character.colorTheme] || "#c084fc"
    : "#c084fc";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startSession = useCallback(() => {
    const newSession = createSession(5);
    setSession(newSession);
    setMessages([
      {
        id: "welcome",
        role: "tutor",
        content: `Hey there! I'm your study buddy. I won't just hand you answers on a silver platter — I'll nudge you to think it through yourself. Ready to flex those brain muscles? 🧠`,
        timestamp: Date.now(),
      },
      {
        id: `q-${newSession.questions[0].id}`,
        role: "tutor",
        content: `**Question 1** (${newSession.questions[0].subject} · ${newSession.questions[0].difficulty})\n\n${newSession.questions[0].question}`,
        timestamp: Date.now() + 1,
      },
    ]);
  }, []);

  useEffect(() => {
    if (!session) {
      startSession();
    }
  }, [session, startSession]);

  const currentQuestion = session
    ? session.sessionQuestions[session.currentIndex]
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session || !currentQuestion || isGenerating) return;

    const studentMsg: ChatMessage = {
      id: `s-${Date.now()}`,
      role: "student",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInput("");
    setIsGenerating(true);

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

    const result = getTutorResponse(
      currentQuestion.question,
      studentMsg.content,
      currentQuestion.hintLevel
    );

    const updatedSession = { ...session };
    const sq = { ...updatedSession.sessionQuestions[updatedSession.currentIndex] };

    if (result.isCorrect) {
      const points = calculateScore(
        sq.question.basePoints,
        sq.hintsUsed
      );
      sq.solved = true;
      sq.pointsAwarded = points;
      updatedSession.totalPoints += points;
      updatedSession.sessionQuestions[updatedSession.currentIndex] = sq;

      const tutorMsg: ChatMessage = {
        id: `t-${Date.now()}`,
        role: "tutor",
        content: `${result.response}\n\n**+${points} points** ${sq.hintsUsed === 0 ? "(No hints needed! 🏆)" : sq.hintsUsed <= 2 ? `(${sq.hintsUsed} hint${sq.hintsUsed > 1 ? "s" : ""} used)` : ""}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, tutorMsg]);

      setTimeout(() => {
        const nextIndex = updatedSession.currentIndex + 1;
        if (nextIndex < updatedSession.questions.length) {
          updatedSession.currentIndex = nextIndex;
          setSession({ ...updatedSession });

          const nextQ = updatedSession.sessionQuestions[nextIndex];
          setMessages((prev) => [
            ...prev,
            {
              id: `q-${nextQ.question.id}`,
              role: "tutor",
              content: `**Question ${nextIndex + 1}** (${nextQ.question.subject} · ${nextQ.question.difficulty})\n\n${nextQ.question.question}`,
              timestamp: Date.now(),
            },
          ]);
        } else {
          updatedSession.currentIndex = nextIndex;
          setSession({ ...updatedSession });

          const totalPossible = updatedSession.sessionQuestions.reduce(
            (sum, sq) => sum + calculateScore(sq.question.basePoints, 0),
            0
          );
          const percentage = Math.round(
            (updatedSession.totalPoints / totalPossible) * 100
          );

          setMessages((prev) => [
            ...prev,
            {
              id: "complete",
              role: "tutor",
              content: `🏆 **Session Complete!**\n\nYou scored **${updatedSession.totalPoints} points** out of a possible ${totalPossible} (${percentage}%).\n\n${
                percentage >= 90
                  ? "Absolute legend! You crushed every single one! 🎉"
                  : percentage >= 70
                    ? "Solid work! Your brain is warming up nicely! 🔥"
                    : percentage >= 50
                      ? "Not bad at all! A few more rounds and you'll be unstoppable! 💪"
                      : "Every try makes you stronger — the comeback arc starts now! 🚀"
              }\n\nReady for another round of brain gains?`,
              timestamp: Date.now(),
            },
          ]);
        }
      }, 1200);
    } else if (result.isRevealed) {
      sq.hintsUsed++;
      sq.hintLevel = result.newHintLevel;
      updatedSession.sessionQuestions[updatedSession.currentIndex] = sq;

      setMessages((prev) => [
        ...prev,
        {
          id: `t-${Date.now()}`,
          role: "tutor",
          content: result.response,
          timestamp: Date.now(),
        },
      ]);
    } else {
      if (!isShortcutAttempt(studentMsg.content)) {
        sq.hintsUsed++;
      }
      sq.hintLevel = result.newHintLevel;
      updatedSession.sessionQuestions[updatedSession.currentIndex] = sq;

      setMessages((prev) => [
        ...prev,
        {
          id: `t-${Date.now()}`,
          role: "tutor",
          content: result.response,
          timestamp: Date.now(),
        },
      ]);
    }

    setSession({ ...updatedSession });
    setIsGenerating(false);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-grid">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `${themeColor}08` }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/5 px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all duration-250"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="h-4 w-px bg-white/10" />
          {character && (
            <MascotCharacter color={themeColor} size={32} isTalking={isGenerating} />
          )}
          <div>
            <p className="text-sm font-semibold text-foreground">
              {character?.name || "Study Buddy"}
            </p>
            <p className="text-[11px] text-muted-foreground/60">
              Socratic Tutor · {currentQuestion?.question.subject || "Ready"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {session && (
            <>
              <HintMeter
                hintLevel={currentQuestion?.hintLevel || 0}
                maxLevel={4}
              />
              <ScoreDisplay points={session.totalPoints} />
            </>
          )}
          <button
            onClick={() => {
              setSession(null);
              setMessages([]);
              startSession();
            }}
            className="clay-btn rounded-2xl bg-white/[0.03] p-2 text-muted-foreground hover:text-foreground"
            title="New session"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-4">
        <div className="mx-auto max-w-2xl space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.role === "student" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "student"
                      ? "bg-purple-500/20 text-foreground"
                      : "clay-card text-foreground"
                  }`}
                >
                  {msg.content.split("\n").map((line, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return (
                            <strong key={j} className="font-semibold">
                              {part.slice(2, -2)}
                            </strong>
                          );
                        }
                        return <span key={j}>{part}</span>;
                      })}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="clay-card flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:300ms]" />
                </div>
                thinking...
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="relative z-10 border-t border-white/5 px-6 py-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl items-center gap-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              currentQuestion?.solved
                ? "Waiting for next question..."
                : "Type your answer or ask a question..."
            }
            disabled={isGenerating || currentQuestion?.solved}
            className="clay-input flex-1 rounded-2xl"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isGenerating || currentQuestion?.solved}
            className="clay-primary rounded-2xl px-4 py-2.5 disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        {currentQuestion && !currentQuestion.solved && (
          <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-muted-foreground/40">
            {currentQuestion.hintsUsed === 0
              ? "Try to answer on your own first — you'll earn more points!"
              : `${currentQuestion.hintsUsed} hint${currentQuestion.hintsUsed > 1 ? "s" : ""} used · Fewer hints = higher score`}
          </p>
        )}
      </div>
    </div>
  );
}
