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
  Terminal,
  Sparkles,
  Search,
  Upload,
  MessageSquare,
  LogOut,
  ArrowRight,
  Settings,
  Flame,
  Swords,
  Bell,
  BellOff,
} from "lucide-react";
import {
  ACHIEVEMENTS,
  ACCESSORIES,
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
    icon: MessageSquare,
    title: "Study Buddy",
    description: "Solve problems step-by-step with a Socratic tutor. Earn more points for fewer hints.",
    href: "/chat",
    color: "text-purple-400",
    bg: "bg-purple-500/12",
  },
  {
    icon: Search,
    title: "Browse Catalog",
    description: "Explore shared lessons and resources from your team.",
    href: "/catalog",
    color: "text-teal-400",
    bg: "bg-teal-500/12",
  },
  {
    icon: Upload,
    title: "Create Content",
    description: "Upload notes, questions, or resources for your team.",
    href: "/content/create",
    color: "text-amber-400",
    bg: "bg-amber-500/12",
  },
  {
    icon: Swords,
    title: "Quiz Challenge",
    description: "Challenge a friend to a head-to-head quiz and earn bonus stars.",
    href: "/quiz",
    color: "text-rose-400",
    bg: "bg-rose-500/12",
  },
  {
    icon: Settings,
    title: "Admin Panel",
    description: "Manage users, content, and workspace settings.",
    href: "/admin",
    color: "text-sky-400",
    bg: "bg-sky-500/12",
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
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");
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
    ? COLOR_THEMES[character.colorTheme] || "#c084fc"
    : "#c084fc";

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `${themeColor}08` }}
        />
        <div className="absolute bottom-0 -right-40 h-[400px] w-[400px] rounded-full bg-purple-600/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="clay-card flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-500/15 p-1.5">
              <Terminal className="h-5 w-5 text-purple-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Brainly<span className="text-purple-400"> Weird</span>
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
                title={subStatus?.subscribed ? "Disable notifications" : "Enable streak reminders"}
              >
                {subStatus?.subscribed ? (
                  <Bell className="h-4 w-4 text-purple-400" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {subStatus?.subscribed ? "Notifications On" : "Remind Me"}
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
                {character.name} misses you! You've got a {character.streak}-day streak going — keep it alive with a quick lesson!
              </p>
            </div>
            <Button
              onClick={() => navigate("/lesson")}
              size="sm"
              className="clay-btn shrink-0 rounded-2xl bg-orange-500/20 text-xs font-medium text-orange-300 hover:bg-orange-500/30 hover:text-orange-200"
            >
              Start Lesson
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
            Hey{user?.name ? `, ${user.name}` : ""} 👋
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {character
              ? `${character.name} is hyped to teach you something new today!`
              : "Let's get you a study buddy — it only takes a minute!"}
          </p>
        </motion.div>

        {/* Character card + Quick stats */}
        <div className="grid gap-5 md:grid-cols-2 mb-10">
          {/* Character card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="clay-card-lg border-0">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {character ? (
                    <MascotCharacter color={themeColor} size={44} />
                  ) : (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-white/5 text-sm font-bold text-muted-foreground">
                      ?
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-sm">
                      {character ? character.name : "No buddy yet 👋"}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {character
                        ? character.description
                        : "Your future study buddy is waiting to be born!"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <Button
                  onClick={() =>
                    character
                      ? navigate("/lesson")
                      : navigate("/create-character")
                  }
                  className="clay-primary w-full rounded-2xl py-2.5 text-sm font-semibold"
                >
                  {character ? "🚀 Start Lesson" : "✨ Create Companion"}
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
                {character && (
                  <Button
                    onClick={() => navigate("/chat")}
                    variant="outline"
                    className="clay-ghost w-full rounded-2xl py-2.5 text-sm font-medium"
                  >
                    <MessageSquare className="mr-2 h-3.5 w-3.5" />
                    Study Buddy Chat
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <Card className="clay-card-lg border-0 h-full">
              <CardHeader>
                <CardTitle className="text-sm">Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="clay-card rounded-2xl p-3.5 flex items-center gap-3">
                    <Flame className="h-6 w-6 text-orange-400 flex-shrink-0" />
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {character?.streak || 0}
                      </p>
                      <p className="text-[11px] text-muted-foreground">Day Streak</p>
                    </div>
                  </div>
                  <div className="clay-card rounded-2xl p-3.5 flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-amber-400 flex-shrink-0" />
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {character?.totalStars || 0}
                      </p>
                      <p className="text-[11px] text-muted-foreground">Stars</p>
                    </div>
                  </div>
                  <div className="clay-card rounded-2xl p-3.5">
                    <p className="text-lg font-bold text-foreground">
                      {character ? "1" : "0"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Companion</p>
                  </div>
                  <div className="clay-card rounded-2xl p-3.5">
                    <p className="text-lg font-bold text-foreground">1</p>
                    <p className="text-[11px] text-muted-foreground">Lesson</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick actions grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <p className="section-label mb-4">Quick Actions</p>
          <div className="grid gap-3 sm:grid-cols-2">
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
                  <p className="text-sm font-semibold text-foreground group-hover:text-purple-300 transition-colors">
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
        {character && (character.totalStars || 0) > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <p className="section-label mb-4">Accessories</p>
            <div className="flex flex-wrap gap-2.5">
              {ACCESSORIES.map((acc) => {
                const unlocked = (character.totalStars || 0) >= acc.cost;
                const equipped = (character.accessories || []).includes(acc.id);
                return (
                  <div
                    key={acc.id}
                    className={`clay-card clay-tile flex items-center gap-2 rounded-2xl px-3.5 py-2.5 ${
                      !unlocked ? "opacity-25 grayscale" : ""
                    } ${equipped ? "ring-2 ring-purple-500/50" : ""}`}
                    title={`${acc.name}${!unlocked ? ` (${acc.cost} stars to unlock)` : equipped ? " (equipped)" : ""}`}
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
          Brainly Weird v1 · Making learning delightfully weird ✨
        </p>
      </div>
    </div>
  );
}
