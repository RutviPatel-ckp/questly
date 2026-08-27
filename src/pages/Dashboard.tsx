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
  Terminal,
  Sparkles,
  BookOpen,
  Search,
  Upload,
  MessageSquare,
  LogOut,
  ArrowRight,
  Settings,
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

const quickActions = [
  {
    icon: Search,
    title: "Browse Catalog",
    description: "Explore shared lessons and resources from your team.",
    href: "/catalog",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Upload,
    title: "Create Content",
    description: "Upload notes, questions, or resources for your team.",
    href: "/content/create",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    icon: MessageSquare,
    title: "Messages",
    description: "Check discussions and comments from your peers.",
    href: "/dashboard",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Settings,
    title: "Admin Panel",
    description: "Manage users, content, and workspace settings.",
    href: "/admin",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
];

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
    <div className="min-h-screen overflow-hidden bg-grid">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `${themeColor}08` }}
        />
        <div className="absolute bottom-0 -right-40 h-[400px] w-[400px] rounded-full bg-purple-600/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-6">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="clay-card flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 p-1.5">
              <Terminal className="h-5 w-5 text-purple-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Brainly<span className="text-purple-400"> Weird</span>
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleSignOut}
            className="clay-btn gap-2 rounded-xl border-white/5 bg-white/[0.03] text-sm text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
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
            Hey{user?.name ? `, ${user.name}` : ""} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            {character
              ? `Your companion "${character.name}" is ready to teach.`
              : "Set up your first learning companion to get started."}
          </p>
        </motion.div>

        {/* Character card + Companion CTA */}
        <div className="grid gap-5 md:grid-cols-2 mb-8">
          {/* Character card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="clay-card-lg border-0">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: themeColor }}
                  >
                    {character ? character.name[0].toUpperCase() : "?"}
                  </div>
                  <div>
                    <CardTitle className="text-sm">
                      {character ? character.name : "No Companion Yet"}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {character
                        ? character.description
                        : "Create a study companion to unlock lessons"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() =>
                    character
                      ? navigate("/lesson")
                      : navigate("/create-character")
                  }
                  className="clay-btn w-full rounded-xl bg-purple-500/15 text-sm font-medium text-purple-300 hover:bg-purple-500/25 hover:text-purple-200"
                >
                  {character ? "Start Lesson" : "Create Companion"}
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
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
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="clay-card rounded-xl p-3">
                    <p className="text-2xl font-bold text-foreground">
                      {character ? "1" : "0"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Companions
                    </p>
                  </div>
                  <div className="clay-card rounded-xl p-3">
                    <p className="text-2xl font-bold text-foreground">1</p>
                    <p className="text-xs text-muted-foreground">Lessons</p>
                  </div>
                  <div className="clay-card rounded-xl p-3">
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Posts</p>
                  </div>
                  <div className="clay-card rounded-xl p-3">
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Messages</p>
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
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60 mb-4">
            Quick Actions
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((action, i) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
                onClick={() => navigate(action.href)}
                className="clay-card group flex items-start gap-4 p-4 text-left transition-all hover:bg-white/[0.02]"
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${action.bg}`}
                >
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-purple-300 transition-colors">
                    {action.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent activity placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60 mb-4">
            Recent Activity
          </p>
          <Card className="clay-card border-0">
            <CardContent className="py-10 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/30" />
              <p className="mt-3 text-sm text-muted-foreground">
                No recent activity yet. Start a lesson or browse the catalog.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <p className="mt-10 text-center text-xs text-muted-foreground/40">
          Brainly Weird v1 · Companions & Interactive Lessons
        </p>
      </div>
    </div>
  );
}
