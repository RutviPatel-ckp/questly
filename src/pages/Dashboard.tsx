import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
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
  GraduationCap,
  Sparkles,
  BookOpen,
  LogOut,
} from "lucide-react";

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

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const character = useQuery(api.characters.getCharacter);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const themeColor = character
    ? COLOR_THEMES[character.colorTheme] || "#c084fc"
    : "#c084fc";

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${themeColor}20` }}
        />
        <div className="absolute bottom-1/4 -left-48 h-80 w-80 rounded-full bg-purple-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="clay-card flex h-9 w-9 items-center justify-center rounded-xl p-1.5"
              style={{ backgroundColor: `${themeColor}30` }}
            >
              <GraduationCap
                className="h-5 w-5"
                style={{ color: themeColor }}
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Nudge
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleSignOut}
            className="clay-btn gap-2 rounded-xl border-gray-200 text-sm"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </header>

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">
            Hey{user?.name ? `, ${user.name}` : ""}! 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            {character
              ? `Your buddy ${character.name} is ready to teach.`
              : "Create your study buddy to get started!"}
          </p>
        </motion.div>

        {/* Character card (if exists) */}
        {character && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6"
          >
            <Card className="clay-card-lg border-0">
              <CardContent className="flex items-center gap-5 p-6">
                <div
                  className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-md"
                  style={{ backgroundColor: themeColor }}
                >
                  {character.name[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-foreground">
                    {character.name}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                    {character.description}
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/create-character")}
                  variant="outline"
                  className="clay-btn shrink-0 rounded-xl border-gray-200 text-sm"
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Character Creation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <button
              onClick={() => navigate("/create-character")}
              className="clay-card group w-full cursor-pointer p-0 text-left transition-all hover:scale-[1.02]"
            >
              <CardHeader>
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${themeColor}20` }}
                >
                  <Sparkles className="h-6 w-6" style={{ color: themeColor }} />
                </div>
                <CardTitle className="text-base">
                  {character ? "Edit Character" : "Create Character"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {character
                    ? "Update your buddy's name, description, or color theme."
                    : "Design your study buddy — give it a name, description, and color."}
                </p>
              </CardContent>
            </button>
          </motion.div>

          {/* Lessons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <button
              onClick={() =>
                character ? navigate("/lesson") : navigate("/create-character")
              }
              className="clay-card group w-full cursor-pointer p-0 text-left transition-all hover:scale-[1.02]"
            >
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-base">Start Lesson</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {character
                    ? `Hear ${character.name} read today's lesson out loud.`
                    : "Create a character first to unlock lessons!"}
                </p>
              </CardContent>
            </button>
          </motion.div>
        </div>

        {/* Version note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center text-xs text-muted-foreground/60"
        >
          Nudge v1 · Character + Read-Aloud Lessons
        </motion.p>
      </div>
    </div>
  );
}
