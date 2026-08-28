import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Crown,
  LogOut,
  ArrowRight,
  Flame,
  Swords,
  Bell,
  BellOff,
  MessageSquare,
  Star,
  BookOpen,
  Lock,
} from "lucide-react";
import {
  ACHIEVEMENTS,
  ACCESSORIES,
  getCurrentRank,
  getNextRank,
  RANKS,
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

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const character = useQuery(api.characters.getCharacter);
  const subStatus = useQuery(api.notifications.getSubscriptionStatus);
  const subscribe = useMutation(api.notifications.subscribe);
  const unsubscribe = useMutation(api.notifications.unsubscribe);
  const recordActivity = useMutation(api.notifications.recordDailyActivity);

  const [notifSupported, setNotifSupported] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    const supported = isPushSupported();
    setNotifSupported(supported);
    setNotifPermission(getPermissionState());
    if (supported) registerServiceWorker();
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
        setNotifPermission(getPermissionState());
      }
    } catch (err) {
      console.error("Notification toggle failed:", err);
    }
    setNotifLoading(false);
  };

  const themeColor = character?.colorTheme || "#fbbf24";
  const totalStars = character?.totalStars || 0;
  const coins = character?.coins || 0;
  const currentRank = getCurrentRank(totalStars);
  const nextRank = getNextRank(totalStars);
  const totalLessonsCompleted = character?.totalPartsCompleted || 0;
  const maxLessonsPerSubject = 25;

  // Calculate per-subject progress for the ring
  const subjectProgress: Record<string, number> = {};
  Object.keys(SUBJECT_REALMS).forEach((subject) => {
    const topics = TOPICS_BY_SUBJECT[subject] || [];
    subjectProgress[subject] = Math.min(100, (totalLessonsCompleted / Math.max(topics.length * 4, 1)) * 100);
  });

  // Overall ring progress based on stars
  const ringProgress = Math.min(100, (totalStars / 30) * 100);

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      <FloatingShapes count={14} />
      {/* Warm forest background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px] bg-emerald-300/15" />
        <div className="absolute bottom-0 -right-40 h-[400px] w-[400px] rounded-full bg-amber-200/15 blur-[100px]" />
        <div className="absolute top-1/2 -left-40 h-[350px] w-[350px] rounded-full bg-teal-200/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
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

        {/* Streak reminder banner */}
        {showStreakBanner && character?.streak && character.streak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-6 clay-card flex items-center gap-4 rounded-2xl border border-orange-300/30 bg-orange-50 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-100">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900">
                🔥 Don't lose your streak!
              </p>
              <p className="text-xs text-amber-700/70">
                {character.name} misses you! You've got a {character.streak}-day streak going.
              </p>
            </div>
            <Button
              onClick={() => navigate("/lesson")}
              size="sm"
              className="clay-primary shrink-0 rounded-2xl text-xs font-semibold"
            >
              Start Quest
            </Button>
            <button
              onClick={() => setShowStreakBanner(false)}
              className="text-amber-400 hover:text-amber-600 text-xs transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Welcome + Power Ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-amber-900 mb-1">
            Hail, {user?.name || "Adventurer"}! {currentRank.icon}
          </h1>
          <p className="text-sm text-amber-700/70 mb-6">
            {character
              ? `${character.name} is eager to guide you on your next quest!`
              : "Your adventure awaits — create a companion to begin!"}
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Power Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="clay-card-lg border-0">
                <CardContent className="p-6 flex flex-col items-center">
                  <p className="section-label mb-4">Ring of Primal Energies</p>
                  <PowerRing
                    progress={ringProgress}
                    size={220}
                    subjectProgress={subjectProgress}
                  />
                  <p className="mt-4 text-xs text-amber-700/60 text-center">
                    {totalStars} of 30 Stars · {currentRank.name}
                  </p>
                  {nextRank && (
                    <p className="text-[11px] text-amber-600/50 text-center mt-1">
                      {nextRank.minStars - totalStars} more Stars to reach{" "}
                      <span className="font-bold">{nextRank.name}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Companion + Currencies */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="clay-card-lg border-0 h-full">
                <CardContent className="p-6 flex flex-col items-center gap-4">
                  {character ? (
                    <>
                      <MascotCharacter
                        characterType={character.characterType}
                        size={64}
                      />
                      <p className="text-sm font-bold text-amber-900">{character.name}</p>
                      <p className="text-xs text-amber-700/60">{currentRank.icon} {currentRank.name}</p>

                      {/* Coins */}
                      <div className="clay-card flex w-full items-center gap-3 rounded-2xl p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg">
                          🪙
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold text-amber-900">{coins}</p>
                          <p className="text-[10px] text-amber-700/60">Coins</p>
                        </div>
                        <div className="text-right">
                          <div className="clay-input h-1.5 w-16 overflow-hidden rounded-full p-0">
                            <div
                              className="h-full rounded-full bg-amber-400 transition-all"
                              style={{ width: `${(coins / 3) * 100}%` }}
                            />
                          </div>
                          <p className="text-[9px] text-amber-600/50 mt-1">
                            {coins}/3 → ⭐
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="clay-card flex w-full items-center gap-3 rounded-2xl p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-lg">
                          ⭐
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold text-amber-900">{totalStars}</p>
                          <p className="text-[10px] text-amber-700/60">Stars</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-lg font-bold text-amber-400">
                        ?
                      </div>
                      <p className="text-xs text-amber-700/60 text-center">No companion yet</p>
                      <Button
                        onClick={() => navigate("/create-character")}
                        className="clay-primary w-full rounded-2xl py-2.5 text-sm font-semibold"
                      >
                        ✨ Create Companion
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Subject Realms Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <p className="section-label mb-4">Explore Kingdoms</p>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
            {Object.entries(SUBJECT_REALMS).map(([subject, realm], i) => (
              <motion.button
                key={subject}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                onClick={() => navigate(`/realm/${encodeURIComponent(subject)}`)}
                className="clay-card clay-tile group text-left"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg"
                      style={{ backgroundColor: `${realm.color}15` }}
                    >
                      {realm.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">
                        {realm.name}
                      </p>
                      <p className="text-[11px] text-amber-700/50 mt-0.5 line-clamp-2">
                        {realm.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <p className="section-label mb-4">Quick Actions</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              onClick={() => navigate("/lesson")}
              className="clay-card clay-tile group flex items-center gap-3 p-4 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
                <BookOpen className="h-5 w-5 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">
                  Continue Quest
                </p>
                <p className="text-[11px] text-amber-700/50">Pick up where you left off</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="clay-card clay-tile group flex items-center gap-3 p-4 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-50">
                <MessageSquare className="h-5 w-5 text-purple-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">
                  The Wise Old King
                </p>
                <p className="text-[11px] text-amber-700/50">Consult the royal advisor</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/quiz")}
              className="clay-card clay-tile group flex items-center gap-3 p-4 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50">
                <Swords className="h-5 w-5 text-rose-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">
                  Quiz Battle
                </p>
                <p className="text-[11px] text-amber-700/50">Challenge a friend</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <p className="section-label mb-4">Achievements</p>
          <div className="flex flex-wrap gap-2">
            {ACHIEVEMENTS.map((ach) => {
              const earned = (character?.achievements || []).includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`clay-card clay-tile flex items-center gap-2 rounded-2xl px-3 py-2 ${
                    earned ? "" : "opacity-30 grayscale"
                  }`}
                  title={ach.description}
                >
                  <span className="text-lg">{ach.icon}</span>
                  <span className="text-xs font-medium text-amber-900">{ach.name}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <p className="mt-12 text-center text-xs text-amber-700/30">
          Questly v1 · Every lesson is a quest ⚔️
        </p>
      </div>
    </div>
  );
}
