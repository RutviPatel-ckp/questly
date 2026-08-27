import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Crown,
  Sparkles,
  LogOut,
  ArrowRight,
  Flame,
  Swords,
  Bell,
  BellOff,
  Map,
  Scroll,
  MessageSquare,
  Trophy,
  Shield,
} from "lucide-react";
import {
  ACHIEVEMENTS,
  ACCESSORIES,
  getCurrentRank,
  getNextRank,
  RANKS,
} from "@/lib/quiz-data";
import {
  isPushSupported,
  getPermissionState,
  subscribeToPush,
  unsubscribeFromPush,
  registerServiceWorker,
  showStreakReminder,
} from "@/lib/notifications";
import MascotCharacter from "@/components/MascotCharacter";
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

const quickActions = [
  {
    icon: Scroll,
    title: "Start a Quest",
    description: "Continue learning with your companion in the kingdom.",
    href: "/lesson",
    color: "text-amber-400",
    bg: "bg-amber-500/12",
  },
  {
    icon: MessageSquare,
    title: "The Wise Old King",
    description: "Consult the royal advisor for guided study and Socratic wisdom.",
    href: "/chat",
    color: "text-purple-400",
    bg: "bg-purple-500/12",
  },
  {
    icon: Swords,
    title: "Quiz Battle",
    description: "Challenge a friend to a head-to-head battle and earn Stars.",
    href: "/quiz",
    color: "text-rose-400",
    bg: "bg-rose-500/12",
  },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const character = useQuery(api.characters.getCharacter);
  const subStatus = useQuery(api.notifications.getSubscriptionStatus);
  const subscribe = useMutation(api.notifications.subscribe);
  const unsubscribe = useMutation(api.notifications.unsubscribe);
  const recordActivity = useMutation(api.notifications.recordDailyActivity);

  const [notifSupported, setNotifSupported] = useState(false);
  const [notifPermission, setNotifPermission] =
    useState<NotificationPermission>("default");
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    const supported = isPushSupported();
    setNotifSupported(supported);
    setNotifPermission(getPermissionState());
    if (supported) {
      registerServiceWorker();
    }
  }, []);

  useEffect(() => {
    if (character && character.streak && character.streak > 0) {
      const today = new Date().toISOString().split("T")[0];
      if (character.lastActiveDate !== today) {
        setShowStreakBanner(true);
        if (Notification.permission === "granted") {
          showStreakReminder(character.name, character.streak);
        }
      }
    }
    if (character) {
      recordActivity();
    }
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
        if (pushSub) {
          await subscribe(pushSub);
        }
        setNotifPermission(getPermissionState());
      }
    } catch (err) {
      console.error("Notification toggle failed:", err);
    }
    setNotifLoading(false);
  };

  const themeColor = character
    ? COLOR_THEMES[character.colorTheme] || "#fbbf24"
    : "#fbbf24";

  const totalStars = character?.totalStars || 0;
  const coins = character?.coins || 0;
  const currentRank = getCurrentRank(totalStars);
  const nextRank = getNextRank(totalStars);
  const rankProgress = nextRank
    ? ((totalStars - currentRank.minStars) / (nextRank.minStars - currentRank.minStars)) * 100
    : 100;

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      <FloatingShapes count={14} />
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `${themeColor}12` }}
        />
        <div className="absolute bottom-0 -right-40 h-[400px] w-[400px] rounded-full bg-purple-600/8 blur-[100px]" />
        <div className="absolute top-1/2 -left-40 h-[350px] w-[350px] rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="clay-card flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500/15 p-1.5">
              <Crown className="h-5 w-5 text-amber-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Quest<span className="text-amber-400">ly</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {notifSupported && (
              <Button
                type="button"
                variant="outline"
                onClick={toggleNotifications}
                disabled={notifLoading}
                className="clay-ghost gap-2 rounded-2xl px-3 py-2 text-sm"
                title={
                  subStatus?.subscribed
                    ? "Disable notifications"
                    : "Enable streak reminders"
                }
              >
                {subStatus?.subscribed ? (
                  <Bell className="h-4 w-4 text-amber-400" />
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
              className="clay-ghost gap-2 rounded-2xl px-3 py-2 text-sm"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>

        {/* Streak reminder banner */}
        {showStreakBanner && character && character.streak && character.streak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-6 clay-card flex items-center gap-4 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-500/20">
              <Flame className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                🔥 Don't lose your streak!
              </p>
              <p className="text-xs text-muted-foreground">
                {character.name} misses you! You've got a {character.streak}-day streak going — keep it alive with a quick quest!
              </p>
            </div>
            <Button
              onClick={() => navigate("/lesson")}
              size="sm"
              className="clay-btn shrink-0 rounded-2xl bg-orange-500/20 text-xs font-medium text-orange-300 hover:bg-orange-500/30 hover:text-orange-200"
            >
              Start Quest
            </Button>
            <button
              onClick={() => setShowStreakBanner(false)}
              className="text-muted-foreground/50 hover:text-muted-foreground text-xs transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-2xl font-bold text-foreground">
            Hail, {user?.name || "Adventurer"}! {currentRank.icon}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {character
              ? `${character.name} is eager to guide you on your next quest!`
              : "Your adventure awaits — create a companion to begin!"}
          </p>
        </motion.div>

        {/* Rank Path + Currencies Row */}
        <div className="grid gap-5 md:grid-cols-3 mb-10">
          {/* Rank Path Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="md:col-span-2"
          >
            <Card className="clay-card-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Map className="h-4 w-4 text-amber-400" />
                    Kingdom Rank
                  </CardTitle>
                  <span className="text-xs font-bold" style={{ color: currentRank.color }}>
                    {currentRank.name}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Winding path visual */}
                <div className="relative mb-4">
                  <div className="clay-input h-3 overflow-hidden rounded-full p-0">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        backgroundColor: currentRank.color,
                        width: `${Math.min(rankProgress, 100)}%`,
                      }}
                    />
                  </div>
                  {nextRank && (
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      {nextRank.minStars - totalStars} more Stars to reach{" "}
                      <span className="font-bold" style={{ color: nextRank.color }}>
                        {nextRank.name}
                      </span>
                    </p>
                  )}
                </div>

                {/* Rank milestones */}
                <div className="flex items-center justify-between">
                  {RANKS.map((rank, i) => {
                    const isReached = totalStars >= rank.minStars;
                    const isCurrent = currentRank.id === rank.id;
                    return (
                      <div key={rank.id} className="flex flex-col items-center gap-1">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all ${
                            isCurrent
                              ? "ring-2 ring-offset-1 ring-offset-background scale-110"
                              : isReached
                                ? ""
                                : "opacity-30 grayscale"
                          }`}
                          style={
                            isCurrent
                              ? { backgroundColor: rank.color }
                              : isReached
                                ? { backgroundColor: `${rank.color}30` }
                                : { backgroundColor: "oklch(1 0 0 / 0.05)" }
                          }
                        >
                          {rank.icon}
                        </div>
                        <span
                          className={`text-[9px] font-medium ${
                            isCurrent ? "text-foreground" : "text-muted-foreground/60"
                          }`}
                        >
                          {rank.name.split(" ")[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Companion + Currencies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <Card className="clay-card-lg border-0 h-full">
              <CardHeader>
                <CardTitle className="text-sm">Your Companion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {character ? (
                  <div className="flex flex-col items-center gap-3">
                    <MascotCharacter
                      color={themeColor}
                      size={56}
                      accessories={character?.accessories}
                    />
                    <p className="text-sm font-bold text-foreground">
                      {character.name}
                    </p>

                    {/* Coins */}
                    <div className="clay-card flex w-full items-center gap-2.5 rounded-2xl p-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-sm">
                        🪙
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold text-foreground">
                          {coins}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Coins
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">
                          {coins}/3
                        </p>
                        <p className="text-[9px] text-amber-400/70">
                          {3 - coins === 3 ? "0 ⭐" : `${3 - coins} → ⭐`}
                        </p>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="clay-card flex w-full items-center gap-2.5 rounded-2xl p-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-sm">
                        ⭐
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold text-foreground">
                          {totalStars}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Stars
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-lg font-bold text-muted-foreground">
                      ?
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      No companion yet
                    </p>
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

        {/* Start Quest CTA */}
        {character && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-10"
          >
            <Button
              onClick={() => navigate("/lesson")}
              className="clay-glow w-full rounded-2xl py-3 text-sm font-semibold bg-amber-500 text-gray-900 hover:bg-amber-400"
            >
              <Scroll className="mr-2 h-4 w-4" />
              Continue Your Quest
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <p className="section-label mb-4">Quick Actions</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {quickActions.map((action, i) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
                onClick={() => navigate(action.href)}
                className="clay-card clay-tile group flex items-start gap-4 p-4 text-left"
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${action.bg}`}
                >
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-amber-300 transition-colors">
                    {action.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Achievements shelf */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10"
        >
          <p className="section-label mb-4">Achievements</p>
          <div className="flex flex-wrap gap-2.5">
            {ACHIEVEMENTS.map((ach) => {
              const earned = (character?.achievements || []).includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`clay-card clay-tile flex items-center gap-2 rounded-2xl px-3.5 py-2.5 ${
                    earned ? "" : "opacity-30 grayscale"
                  }`}
                  title={ach.description}
                >
                  <span className="text-lg">{ach.icon}</span>
                  <span className="text-xs font-medium text-foreground">
                    {ach.name}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Accessories shelf */}
        {character && totalStars > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <p className="section-label mb-4">Royal Gear</p>
            <div className="flex flex-wrap gap-2.5">
              {ACCESSORIES.map((acc) => {
                const unlocked = totalStars >= acc.cost;
                const equipped = (character.accessories || []).includes(acc.id);
                return (
                  <div
                    key={acc.id}
                    className={`clay-card clay-tile flex items-center gap-2 rounded-2xl px-3.5 py-2.5 ${
                      !unlocked ? "opacity-25 grayscale" : ""
                    } ${equipped ? "ring-2 ring-amber-500/50" : ""}`}
                    title={`${acc.name}${!unlocked ? ` (${acc.cost} Stars to unlock)` : equipped ? " (equipped)" : ""}`}
                  >
                    <span className="text-lg">{acc.icon}</span>
                    <span className="text-xs font-medium text-foreground">
                      {acc.name}
                    </span>
                    {!unlocked && (
                      <span className="text-[10px] text-muted-foreground">
                        🔒 {acc.cost}⭐
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <p className="mt-12 text-center text-xs text-muted-foreground/40">
          Questly v1 · Every lesson is a quest ⚔️
        </p>
      </div>
    </div>
  );
}
