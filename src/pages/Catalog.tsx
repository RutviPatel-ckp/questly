import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Terminal,
  ArrowLeft,
  Search,
  BookOpen,
  Beaker,
  Calculator,
  Globe,
  Code,
  Palette,
  Clock,
  Eye,
  MessageSquare,
} from "lucide-react";

const CATALOG_ITEMS = [
  {
    id: "1",
    title: "Introduction to the Water Cycle",
    description:
      "Learn how evaporation, condensation, and precipitation shape our planet's water supply.",
    category: "Science",
    icon: Beaker,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    readTime: "5 min",
    views: 128,
    comments: 12,
  },
  {
    id: "2",
    title: "Python Basics: Variables & Types",
    description:
      "A beginner-friendly walkthrough of Python's core data types and how to use them.",
    category: "Programming",
    icon: Code,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    readTime: "8 min",
    views: 256,
    comments: 34,
  },
  {
    id: "3",
    title: "The Pythagorean Theorem Explained",
    description:
      "Why a² + b² = c² matters, with real-world examples and practice problems.",
    category: "Math",
    icon: Calculator,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    readTime: "6 min",
    views: 189,
    comments: 21,
  },
  {
    id: "4",
    title: "World History: The Silk Road",
    description:
      "Trace the ancient trade routes that connected East and West for over a millennium.",
    category: "History",
    icon: Globe,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    readTime: "10 min",
    views: 94,
    comments: 8,
  },
  {
    id: "5",
    title: "Color Theory for Digital Design",
    description:
      "Master the fundamentals of color harmony, contrast, and palette creation.",
    category: "Design",
    icon: Palette,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    readTime: "7 min",
    views: 167,
    comments: 19,
  },
  {
    id: "6",
    title: "Photosynthesis: Energy from Light",
    description:
      "Understand how plants convert sunlight into food and why this process sustains all life.",
    category: "Science",
    icon: Beaker,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    readTime: "6 min",
    views: 203,
    comments: 15,
  },
];

const CATEGORIES = ["All", "Science", "Programming", "Math", "History", "Design"];

export default function Catalog() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems = useMemo(() => {
    return CATALOG_ITEMS.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/8 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-40 h-[400px] w-[400px] rounded-full bg-teal-600/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-muted-foreground">
              Brainly<span className="text-purple-400"> Weird</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">Catalog</h1>
          <p className="mt-1 text-muted-foreground">
            Browse lessons, resources, and content shared by your team.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lessons, topics, or keywords..."
              className="clay-input pl-10 py-3 text-sm"
            />
          </div>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`clay-btn rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-purple-500 text-white"
                  : "bg-white/[0.03] text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Results count */}
        <p className="mb-4 text-xs text-muted-foreground/60">
          {filteredItems.length} {filteredItems.length === 1 ? "result" : "results"}
        </p>

        {/* Catalog grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredItems.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
              onClick={() => navigate(`/content/${item.id}`)}
              className="clay-card group p-5 text-left transition-all hover:bg-white/[0.02]"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${item.bg}`}
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-foreground group-hover:text-purple-300 transition-colors line-clamp-1">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground/60">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {item.views}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {item.comments}
                </span>
                <span className="ml-auto rounded-lg bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {item.category}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card className="clay-card border-0">
            <CardContent className="py-12 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/30" />
              <p className="mt-3 text-sm text-muted-foreground">
                No results found for "{searchQuery}".
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                variant="link"
                className="mt-2 text-purple-400 hover:text-purple-300"
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
