import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  MessageSquare,
  Upload,
  Search,
  LayoutDashboard,
  Shield,
  ArrowRight,
  Sparkles,
  Terminal,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Personal Dashboard",
    description:
      "Track your learning progress, revisit completed lessons, and pick up right where you left off — all in one place.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: MessageSquare,
    title: "Message & Comment",
    description:
      "Discuss topics with peers, leave feedback on shared content, and keep the conversation going inside every lesson.",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    icon: Upload,
    title: "Post & Upload",
    description:
      "Contribute your own notes, questions, or resources. The best study libraries are the ones everyone helps build.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Search,
    title: "Browse & Search",
    description:
      "Find exactly what you need from a growing catalog of community content — tagged, filtered, and instantly accessible.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    description:
      "Create a personalized study companion that reads lessons aloud and keeps you engaged from start to finish.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    icon: Shield,
    title: "Admin Controls",
    description:
      "Manage users, moderate content, and configure settings from a dedicated admin panel built for power users.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/8 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-teal-600/6 blur-[100px]" />
        <div className="absolute bottom-0 -left-40 h-[400px] w-[400px] rounded-full bg-purple-400/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-6">
        {/* Nav */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="clay-card flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 p-1.5">
              <Terminal className="h-5 w-5 text-purple-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Brainly<span className="text-purple-400"> Weird</span>
            </span>
          </div>
          <Button
            onClick={() =>
              navigate(
                isAuthenticated ? "/dashboard" : "/auth?returnTo=/dashboard"
              )
            }
            className="clay-btn rounded-xl bg-purple-500/15 px-5 py-2 text-sm font-medium text-purple-300 hover:bg-purple-500/25 hover:text-purple-200"
          >
            {isLoading
              ? "..."
              : isAuthenticated
                ? "Dashboard"
                : "Get Started"}
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
            className="clay-card mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-500/15"
          >
            <Sparkles className="h-10 w-10 text-purple-400" />
          </motion.div>

          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Learning should feel
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
              a little weird
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Brainly Weird turns any team's knowledge into an interactive
            learning experience. Create companions, share content, and let your
            people actually enjoy the process.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() =>
                navigate(
                  isAuthenticated
                    ? "/catalog"
                    : "/auth?returnTo=/create-character"
                )
              }
              className="clay-glow rounded-xl bg-purple-500 px-8 py-3 text-sm font-semibold text-white hover:bg-purple-400"
              size="lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Start Building
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                navigate(
                  isAuthenticated ? "/catalog" : "/auth?returnTo=/catalog"
                )
              }
              className="clay-btn rounded-xl border-white/5 bg-white/[0.03] px-8 py-3 text-sm font-medium text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
              size="lg"
            >
              Browse the Catalog
            </Button>
          </div>
        </motion.section>

        {/* Terminal-style feature grid */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-28"
        >
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-purple-400/80">
              What's inside
            </p>
            <h2 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">
              Everything your team needs
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.08, duration: 0.45 }}
                className="clay-card group p-5 transition-all hover:bg-white/[0.02]"
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
          <div className="clay-card-lg mx-auto max-w-2xl px-10 py-12 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-teal-400/80">
              Ready?
            </p>
            <h2 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">
              Build something your team will actually use
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Set up your workspace in minutes. Invite your team, create your
              first lesson, and watch engagement go up.
            </p>
            <Button
              onClick={() =>
                navigate(
                  isAuthenticated
                    ? "/create-character"
                    : "/auth?returnTo=/create-character"
                )
              }
              className="clay-glow mt-8 rounded-xl bg-purple-500 px-8 py-3 text-sm font-semibold text-white hover:bg-purple-400"
              size="lg"
            >
              Create Your First Companion
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-3 border-t border-white/5 pb-8 pt-8 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground/60">
            <Terminal className="h-3.5 w-3.5" />
            Brainly Weird
          </div>
          <p className="text-xs text-muted-foreground/40">
            Making learning a little weird, one lesson at a time.
          </p>
        </footer>
      </div>
    </div>
  );
}
