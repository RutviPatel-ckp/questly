import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Crown,
  LogOut,
  Flame,
  Swords,
  Bell,
  BellOff,
  MessageSquare,
  BookOpen,
  Lock,
  Trophy,
  ChevronRight,
} from "lucide-react";
import {
  ACHIEVEMENTS,
  getCurrentRank,
  getNextRank,
} from "@/lib/quiz-data";
import {
  SUBJECT_REALMS,
  TOPICS_BY_SUBJECT,
} from "@/lib/onboarding-data";
import {
  isPushSupported,
  getPermissionState,
  subscribeToPush,
  unsubscribeFromPush,
  registerServiceWorker,
  showStreakReminder,
} from "@/lib/notifications";
import MascotCharacter from "@/components/MascotCharacter";
import PowerRing from "@/components/PowerRing";
import FloatingShapes from "@/components/FloatingShapes";

const COMPANION_MESSAGES = [
  "Keep going! Every lesson makes you stronger! ⚔️",
  "I believe in you! Let's conquer another chapter! 📚",
  "You're on a roll! Don't stop now! 🔥",
  "The realm needs your wisdom! Time for a quest! 🏰",
  "I've prepared something fun for you today! ✨",
  "Your dedication inspires even the Wise Old King! 👑",
  "Another chapter, another step toward greatness! 🌟",
  "Ready for your next adventure? I know you are! 💪",
];

const ARENA_TIERS = [
  { name: "Apprentice Meadow", minStars: 0, icon: "🌿" },
  { name: "Scholar's Glade", minStars: 5, icon: "📖" },
  { name: "Sage's Grove", minStars: 15, icon: "🌳" },
  { name: "Royal Garden", minStars: 30, icon: "🏰" },
  { name: "Grandmaster's Peak", minStars: 60, icon: "👑" },
];

const FRUIT_COLORS: Record<string, string> = {
  Math: "#7c3aed",
  Science: "#059669",
  History: "#d97706",
  English: "#dc2626",
  "General Knowledge": "#0891b2",
  "Computer Science": "#2563eb",
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const character = useQuery(api.characters.getCharacter);
  const subStatus = useQuery(api.notifications.getSubscriptionStatus);
  const subscribe = useMutation(api.notifications.subscribe);
  const unsubscribe = useMutation(api.notifications.unsubscribe);
  const recordActivity = useMutation(api.notifications.recordDailyActivity);

  const [notifSupported, setNotifSupported] = useState(false);
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  const companionMsg = useMemo(() => {
    const idx = Math.floor(Math.random() * COMPANION_MESSAGES.length);
    return COMPANION_MESSAGES[idx];
  }, []);

  useEffect(() => {
    setNotifSupported(isPushSupported());
    if (isPushSupported()) registerServiceWorker();
  }, []);

  useEffect(() => {
    if (character?.streak && character.streak > 0) {
      const today = new Date().toISOString().split("T")[0];
      if (character.lastActiveDate !== today) {
        setShowStreakBanner(true);
        if (Notification.permission === "granted") {
          showStreakReminder(character.name, character.streak);
        }
      }
    }
    if (character) recordActivity();
  }, [character, recordActivity]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const toggleNotifications = async () => {
    if (!notifSupported) return;
    setNotifLoading(true);
    try {
      if (subStatus?.subscribed) {
        await unsubscribeFromPush();
        await unsubscribe();
      } else {
        const pushSub = await subscribeToPush();
        if (pushSub) await subscribe(pushSub);
      }
    } catch (err) {
      console.error("Notification toggle failed:", err);
    }
    setNotifLoading(false);
  };

  const totalStars = character?.totalStars || 0;
  const coins = character?.coins || 0;
  const currentRank = getCurrentRank(totalStars);
  const nextRank = getNextRank(totalStars);
  const totalLessonsCompleted = character?.totalPartsCompleted || 0;

  // Calculate per-subject progress (0-5 topics each = 0-20 chapters)
  const subjectProgress = useMemo(() => {
    const progress: Record<string, number> = {};
    Object.keys(SUBJECT_REALMS).forEach((subject) => {
      const topicCount = (TOPICS_BY_SUBJECT[subject] || []).length;
      const maxChapters = topicCount * 4;
      progress[subject] = Math.min(100, (totalLessonsCompleted / Math.max(maxChapters, 1)) * 100);
    });
    return progress;
  }, [totalLessonsCompleted]);

  const ringProgress = Math.min(100, (totalStars / 30) * 100);

  // Current arena tier
  const currentArena = ARENA_TIERS.reduce((best, tier) =>
    totalStars >= tier.minStars ? tier : best, ARENA_TIERS[0]);

  // Earned achievements count
  const earnedCount = ACHIEVEMENTS.filter(a =>
    (character?.achievements || []).includes(a.id)).length;

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      <FloatingShapes count={14} />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px] bg-emerald-300/15" />
        <div className="absolute bottom-0 -right-40 h-[400px] w-[400px] rounded-full bg-amber-200/15 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-6">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="clay-card flex h-9 w-9 items-center justify-center rounded-2xl p-1.5">
              <Crown className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-lg font-bold tracking-tight text-amber-900">
              Quest<span className="text-amber-600">ly</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {notifSupported && (
              <Button
                type="button"
                variant="outline"
                onClick={toggleNotifications}
                disabled={notifLoading}
                className="clay-ghost gap-2 rounded-2xl px-3 py-2 text-sm text-amber-800"
              >
                {subStatus?.subscribed ? (
                  <Bell className="h-4 w-4 text-amber-600" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {subStatus?.subscribed ? "Alerts On" : "Remind Me"}
                </span>
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleSignOut}
              className="clay-ghost gap-2 rounded-2xl px-3 py-2 text-sm text-amber-800"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>

        {/* Streak reminder */}
        {showStreakBanner && character?.streak && character.streak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 clay-card flex items-center gap-3 rounded-2xl bg-orange-50 p-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-100">
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-amber-900">🔥 Don't lose your streak!</p>
              <p className="text-[11px] text-amber-700/70">
                {character.name} misses you! {character.streak}-day streak.
              </p>
            </div>
            <Button onClick={() => navigate("/lesson")} size="sm" className="clay-primary shrink-0 rounded-2xl text-xs font-semibold">
              Start
            </Button>
            <button onClick={() => setShowStreakBanner(false)} className="text-amber-400 hover:text-amber-600 text-xs">✕</button>
          </motion.div>
        )}

        {/* ============================================
            TREE LAYOUT
            ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">

          {/* Main Tree */}
          <div className="space-y-0">

            {/* === CLOUDS (Top) — Ring, Companion, Currencies === */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              {/* Cloud shapes */}
              <div className="absolute -top-4 left-0 right-0 h-8">
                <div className="mx-auto w-48 h-full rounded-full bg-white/40 blur-sm" />
              </div>

              <div className="clay-card-lg rounded-b-[40px] border-0 p-6 pt-8"
                style={{ background: "linear-gradient(180deg, oklch(0.97 0.02 200 / 0.8), oklch(0.96 0.015 85 / 0.95))" }}>

                {/* Companion + motivational message */}
                {character && (
                  <div className="flex flex-col items-center mb-4">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="mb-2"
                    >
                      <MascotCharacter characterType={character.characterType} size={72} />
                    </motion.div>
                    <div className="clay-card rounded-2xl px-4 py-2 max-w-xs text-center">
                      <p className="text-xs text-amber-800 font-medium">{companionMsg}</p>
                    </div>
                  </div>
                )}

                {/* Ring + Currencies row */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  {/* Power Ring */}
                  <div className="flex flex-col items-center">
                    <PowerRing progress={ringProgress} size={180} subjectProgress={subjectProgress} />
                    <p className="mt-2 text-[11px] text-amber-700/60 text-center">
                      {currentArena.icon} {currentArena.name}
                    </p>
                    {nextRank && (
                      <p className="text-[10px] text-amber-600/50 text-center">
                        {nextRank.minStars - totalStars}⭐ to {nextRank.name}
                      </p>
                    )}
                  </div>

                  {/* Coin & Star counters */}
                  <div className="flex flex-col gap-3">
                    <div className="clay-card flex items-center gap-3 rounded-2xl px-4 py-3">
                      <span className="text-2xl">🪙</span>
                      <div>
                        <p className="text-xl font-bold text-amber-900">{coins}</p>
                        <p className="text-[10px] text-amber-700/60">Lecture Coins</p>
                      </div>
                      <div className="ml-2">
                        <div className="clay-input h-2 w-14 overflow-hidden rounded-full p-0">
                          <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${(coins % 3) / 3 * 100}%` }} />
                        </div>
                        <p className="text-[9px] text-amber-600/50 mt-0.5">{coins % 3}/3 → ⭐</p>
                      </div>
                    </div>
                    <div className="clay-card flex items-center gap-3 rounded-2xl px-4 py-3">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <p className="text-xl font-bold text-amber-900">{totalStars}</p>
                        <p className="text-[10px] text-amber-700/60">Stars · {currentRank.name} {currentRank.icon}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* === TRUNK (Connecting element) === */}
            <div className="flex justify-center -my-2 relative z-10">
              <div className="w-4 h-12 rounded-b-xl" style={{ background: "linear-gradient(180deg, oklch(0.55 0.10 120), oklch(0.40 0.08 100))" }} />
            </div>

            {/* === CANOPY — Subject Fruits (Arena Levels) === */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="clay-card-lg rounded-2xl border-0 p-5"
                style={{ background: "linear-gradient(180deg, oklch(0.94 0.03 140 / 0.6), oklch(0.96 0.015 85 / 0.95))" }}>
                <p className="section-label mb-4 text-center">🌳 Knowledge Tree — Subject Kingdoms</p>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                  {Object.entries(SUBJECT_REALMS).map(([subject, realm], i) => {
                    const topics = TOPICS_BY_SUBJECT[subject] || [];
                    const completedChapters = totalLessonsCompleted;
                    const topicProgress = topics.map((topic, idx) => {
                      const topicStart = idx * 4;
                      const topicEnd = topicStart + 4;
                      if (completedChapters >= topicEnd) return "completed";
                      if (completedChapters >= topicStart) return "current";
                      return "locked";
                    });
                    const currentTopicIdx = topicProgress.findIndex(s => s === "current");
                    const unlockedTopics = topicProgress.filter(s => s !== "locked").length;
                    const fruitColor = FRUIT_COLORS[subject] || "#d97706";

                    return (
                      <motion.button
                        key={subject}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.06 }}
                        onClick={() => navigate(`/realm/${encodeURIComponent(subject)}`)}
                        className="clay-card clay-tile group text-left relative overflow-hidden"
                      >
                        {/* Fruit color top accent */}
                        <div className="h-1.5 w-full rounded-t-2xl" style={{ backgroundColor: fruitColor }} />
                        <CardContent className="p-3.5">
                          {/* Fruit icon + name */}
                          <div className="flex items-center gap-2.5 mb-3">
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg"
                              style={{ backgroundColor: `${fruitColor}18` }}
                            >
                              {realm.icon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-amber-900 group-hover:text-amber-700 transition-colors">
                                {subject}
                              </p>
                              <p className="text-[10px] text-amber-700/50">
                                {unlockedTopics}/{topics.length} levels
                              </p>
                            </div>
                          </div>

                          {/* Level progression (mini arena map) */}
                          <div className="space-y-1.5">
                            {topics.map((topic, idx) => {
                              const status = topicProgress[idx];
                              return (
                                <div key={topic} className="flex items-center gap-2">
                                  <div
                                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                                      status === "completed"
                                        ? "text-white"
                                        : status === "current"
                                          ? "text-white ring-2 ring-offset-1"
                                          : "bg-amber-100/60 text-amber-400"
                                    }`}
                                    style={status !== "locked" ? { backgroundColor: fruitColor } : undefined}
                                  >
                                    {status === "completed" ? "✓" : idx + 1}
                                  </div>
                                  <p className={`text-[10px] truncate ${
                                    status === "locked" ? "text-amber-400/50" : "text-amber-800"
                                  }`}>
                                    {topic}
                                  </p>
                                  {status === "locked" && <Lock className="h-2.5 w-2.5 text-amber-400/40 shrink-0" />}
                                </div>
                              );
                            })}
                          </div>

                          {/* Enter arrow */}
                          <div className="mt-2 flex justify-end">
                            <div
                              className="h-6 w-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ backgroundColor: `${fruitColor}20` }}
                            >
                              <ChevronRight className="h-3.5 w-3.5" style={{ color: fruitColor }} />
                            </div>
                          </div>
                        </CardContent>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* === ROOTS — Quick Actions === */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Root trunk connectors */}
              <div className="flex justify-center -my-1 relative z-10">
                <div className="flex gap-8">
                  <div className="w-3 h-6 rounded-b-lg" style={{ background: "linear-gradient(180deg, oklch(0.55 0.10 120), oklch(0.45 0.06 80))" }} />
                  <div className="w-3 h-8 rounded-b-lg" style={{ background: "linear-gradient(180deg, oklch(0.55 0.10 120), oklch(0.45 0.06 80))" }} />
                  <div className="w-3 h-6 rounded-b-lg" style={{ background: "linear-gradient(180deg, oklch(0.55 0.10 120), oklch(0.45 0.06 80))" }} />
                </div>
              </div>

              <div className="clay-card-lg rounded-t-[40px] border-0 p-5"
                style={{ background: "linear-gradient(180deg, oklch(0.96 0.015 85 / 0.95), oklch(0.92 0.04 80 / 0.7))" }}>
                <p className="section-label mb-3 text-center">🌿 Roots of Knowledge</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    onClick={() => navigate("/lesson")}
                    className="clay-card clay-tile group flex flex-col items-center gap-2 p-4 text-center"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100/60">
                      <BookOpen className="h-6 w-6 text-amber-600" />
                    </div>
                    <p className="text-sm font-semibold text-amber-900">Continue Quest</p>
                    <p className="text-[10px] text-amber-700/50">Resume your lesson</p>
                  </button>
                  <button
                    onClick={() => navigate("/chat")}
                    className="clay-card clay-tile group flex flex-col items-center gap-2 p-4 text-center"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100/60">
                      <MessageSquare className="h-6 w-6 text-purple-500" />
                    </div>
                    <p className="text-sm font-semibold text-amber-900">The Wise Old King</p>
                    <p className="text-[10px] text-amber-700/50">Royal tutor awaits</p>
                  </button>
                  <button
                    onClick={() => navigate("/quiz")}
                    className="clay-card clay-tile group flex flex-col items-center gap-2 p-4 text-center"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100/60">
                      <Swords className="h-6 w-6 text-rose-500" />
                    </div>
                    <p className="text-sm font-semibold text-amber-900">Quiz Battle</p>
                    <p className="text-[10px] text-amber-700/50">Challenge a friend</p>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* === SIDE PANEL — Achievements Treasure Chests === */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="sticky top-6 space-y-3">
              {/* Arena badge */}
              <div className="clay-card rounded-2xl p-4 text-center">
                <div className="text-3xl mb-1">{currentArena.icon}</div>
                <p className="text-[11px] font-bold text-amber-900">{currentArena.name}</p>
                <p className="text-[10px] text-amber-700/50">{currentRank.icon} {currentRank.name}</p>
              </div>

              {/* Treasure chests */}
              <div className="clay-card rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🏆</span>
                  <p className="section-label">Treasures</p>
                </div>
                <p className="text-[10px] text-amber-700/50 mb-3">
                  {earnedCount}/{ACHIEVEMENTS.length} collected
                </p>
                <div className="space-y-2">
                  {ACHIEVEMENTS.map((ach) => {
                    const earned = (character?.achievements || []).includes(ach.id);
                    return (
                      <div
                        key={ach.id}
                        className={`flex items-center gap-2 rounded-xl px-2.5 py-2 transition-all ${
                          earned
                            ? "bg-amber-50/80"
                            : "opacity-30 grayscale"
                        }`}
                        title={ach.description}
                      >
                        <span className="text-base shrink-0">{earned ? "📦" : "🔒"}</span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-amber-900 truncate">{ach.name}</p>
                          <p className="text-[9px] text-amber-700/50 truncate">{ach.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Mobile achievements (shown below tree on small screens) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:hidden mt-6"
        >
          <div className="clay-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏆</span>
              <p className="section-label">Treasures</p>
              <span className="text-[10px] text-amber-700/50 ml-auto">{earnedCount}/{ACHIEVEMENTS.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ACHIEVEMENTS.map((ach) => {
                const earned = (character?.achievements || []).includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`clay-card flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 ${
                      earned ? "" : "opacity-30 grayscale"
                    }`}
                    title={ach.description}
                  >
                    <span className="text-sm">{earned ? "📦" : "🔒"}</span>
                    <span className="text-[10px] font-medium text-amber-900">{ach.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-[10px] text-amber-700/30">
          Questly v1 · Every lesson is a quest ⚔️
        </p>
      </div>
    </div>
  );
}
