import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Volume2, GraduationCap } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Create Your Buddy",
    description:
      "Design a fun character that's uniquely yours — from a sarcastic mango to a wise owl.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Volume2,
    title: "Listen & Learn",
    description:
      "Your character reads lessons out loud with personality, making study time feel like story time.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: BookOpen,
    title: "Stay Focused",
    description:
      "Short, engaging lessons keep you on track without feeling overwhelmed.",
    color: "bg-blue-100 text-blue-600",
  },
];

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Floating clay blobs for background texture */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute top-1/3 -left-48 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-8">
        {/* Nav */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="clay-card flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500 p-2">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Nudge
            </span>
          </div>
          <Button
            onClick={() =>
              navigate(
                isAuthenticated ? "/dashboard" : "/auth?returnTo=/dashboard"
              )
            }
            className="clay-btn rounded-2xl bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-600"
          >
            {isLoading
              ? "..."
              : isAuthenticated
                ? "Dashboard"
                : "Get Started"}
          </Button>
        </nav>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mt-20 text-center md:mt-28"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="clay-card-lg mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-400 to-purple-600"
          >
            <span className="text-5xl">🥭</span>
          </motion.div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
            Your personal
            <br />
            <span className="bg-gradient-to-r from-purple-500 via-orange-400 to-pink-500 bg-clip-text text-transparent">
              study buddy
            </span>{" "}
            awaits
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Create a fun character, give it a personality, and let it teach you.
            Learning feels different when your buddy is a sarcastic mango who
            loves basketball.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              onClick={() =>
                navigate(
                  isAuthenticated
                    ? "/dashboard"
                    : "/auth?returnTo=/create-character"
                )
              }
              className="clay-btn rounded-2xl bg-purple-500 px-8 py-3 text-base font-semibold text-white hover:bg-purple-600"
              size="lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Create Your Buddy
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                navigate(
                  isAuthenticated ? "/dashboard" : "/auth?returnTo=/dashboard"
                )
              }
              className="clay-btn rounded-2xl border-purple-200 bg-white px-8 py-3 text-base font-semibold text-purple-600 hover:bg-purple-50"
              size="lg"
            >
              See How It Works
            </Button>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-24 grid gap-6 md:grid-cols-3"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
              className="clay-card p-6"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${feature.color}`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-24 mb-16"
        >
          <div className="clay-card-lg mx-auto max-w-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Ready to meet your buddy?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              It takes 30 seconds. Type a fun description, pick a color, and
              you're off to the races.
            </p>
            <Button
              onClick={() =>
                navigate(
                  isAuthenticated
                    ? "/create-character"
                    : "/auth?returnTo=/create-character"
                )
              }
              className="clay-btn mt-8 rounded-2xl bg-gradient-to-r from-purple-500 to-orange-400 px-8 py-3 text-base font-semibold text-white hover:from-purple-600 hover:to-orange-500"
              size="lg"
            >
              Let's Go!
            </Button>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="pb-8 text-center text-sm text-muted-foreground">
          Nudge — Learning made fun, one character at a time.
        </footer>
      </div>
    </div>
  );
}
