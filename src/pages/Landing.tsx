import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Crown,
  BookOpen,
  Swords,
  Shield,
  Map,
  Sparkles,
  ArrowRight,
  Castle,
  Gem,
  Scroll,
} from "lucide-react";

const features = [
  {
    icon: Castle,
    title: "Create Your Companion",
    description:
      "Design a unique study companion with its own personality, theme, and voice. Your companion guides you through every lesson.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Map,
    title: "Explore Kingdoms of Knowledge",
    description:
      "Each subject is a kingdom to conquer. Progress through chapters, master topics, and claim your rightful place among scholars.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Swords,
    title: "Battle in Quiz Duels",
    description:
      "Challenge fellow adventurers to head-to-head quiz battles. Prove your knowledge and earn glory for your kingdom.",
    color: "text-crimson-400",
    bg: "bg-rose-500/10",
  },
  {
    icon: Scroll,
    title: "Learn from the Wise Old King",
    description:
      "The royal advisor guides you through tricky problems with gentle wisdom — never giving the answer, always helping you find it yourself.",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    icon: Gem,
    title: "Collect Coins & Stars",
    description:
      "Earn coins for every chapter you complete. Collect three coins to forge a Star. Climb the ranks from Squire to Legend of the Realm.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Shield,
    title: "Shield of Mastery",
    description:
      "Track your progress with the Shield of Mastery — it fills with color as you grow stronger in each subject. Show it off with pride.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
];

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      {/* Background accents — fantasy aurora */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-amber-600/6 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-purple-600/6 blur-[100px]" />
        <div className="absolute bottom-0 -left-40 h-[400px] w-[400px] rounded-full bg-purple-800/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-6">
        {/* Nav */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="clay-card flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 p-1.5">
              <Crown className="h-5 w-5 text-amber-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Quest<span className="text-amber-400">ly</span>
            </span>
          </div>
          <Button
            onClick={() =>
              navigate(
                isAuthenticated ? "/dashboard" : "/auth?returnTo=/dashboard"
              )
            }
            className="clay-primary rounded-xl px-5 py-2 text-sm font-medium"
          >
            {isLoading
              ? "..."
              : isAuthenticated
                ? "Kingdom Map"
                : "Begin Your Quest"}
            {!isLoading && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
          </Button>
        </nav>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mt-24 text-center md:mt-32"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="clay-card mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/15"
          >
            <Crown className="h-10 w-10 text-amber-400" />
          </motion.div>

          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Every lesson is a{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-purple-400 bg-clip-text text-transparent">
              quest for knowledge
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Questly turns learning into a fantasy adventure. Create your
            companion, conquer kingdoms of knowledge, and rise through the
            ranks — from Squire to Legend of the Realm.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() =>
                navigate(
                  isAuthenticated
                    ? "/dashboard"
                    : "/auth?returnTo=/create-character"
                )
              }
              className="clay-glow rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-gray-900 hover:bg-amber-400"
              size="lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Create Your Companion
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                navigate(
                  isAuthenticated ? "/dashboard" : "/auth?returnTo=/dashboard"
                )
              }
              className="clay-ghost rounded-xl px-8 py-3 text-sm font-medium"
              size="lg"
            >
              Enter the Kingdom
            </Button>
          </div>
        </motion.section>

        {/* Feature grid */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-28"
        >
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400/80">
              The Realm Awaits
            </p>
            <h2 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">
              Everything a true scholar needs
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.08, duration: 0.45 }}
                className="clay-card clay-tile group p-5"
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${feature.bg}`}
                >
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="mb-1.5 text-[15px] font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Bottom CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-24 mb-16"
        >
          <div className="clay-card-lg mx-auto max-w-2xl px-10 py-12 text-center" style={{ background: "linear-gradient(135deg, oklch(0.95 0.04 85), oklch(0.92 0.06 140))" }}>
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400/80">
              Your Quest Begins Now
            </p>
            <h2 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">
              Will you rise to become a Legend of the Realm?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Create your companion, choose your kingdom, and let the adventure
              begin. Every chapter conquered brings you closer to greatness.
            </p>
            <Button
              onClick={() =>
                navigate(
                  isAuthenticated
                    ? "/create-character"
                    : "/auth?returnTo=/create-character"
                )
              }
              className="clay-glow mt-8 rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-gray-900 hover:bg-amber-400"
              size="lg"
            >
              Create Your First Companion
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-3 border-t border-amber-200/30 pb-8 pt-8 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground/60">
            <Crown className="h-3.5 w-3.5" />
            Questly
          </div>
          <p className="text-xs text-muted-foreground/40">
            Every lesson is a quest. Every quest makes you stronger.
          </p>
        </footer>
      </div>
    </div>
  );
}
