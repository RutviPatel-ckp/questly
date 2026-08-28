import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Clock,
  Eye,
  MessageSquare,
  Heart,
  Share2,
  Send,
  Terminal,
} from "lucide-react";

const MOCK_CONTENT: Record<string, {
  title: string;
  description: string;
  body: string;
  category: string;
  author: string;
  readTime: string;
  views: number;
  comments: { author: string; text: string; time: string }[];
}> = {
  "1": {
    title: "Introduction to the Water Cycle",
    description:
      "Learn how evaporation, condensation, and precipitation shape our planet's water supply.",
    category: "Science",
    author: "Alex Chen",
    readTime: "5 min",
    views: 128,
    body: `The water cycle is one of the most fundamental processes on Earth. It describes the continuous movement of water through different states and locations — from oceans to atmosphere to land and back again.

## Evaporation

When the sun heats water in rivers, lakes, and oceans, the water turns into vapor and rises into the air. This process is called evaporation. About 90% of evaporation comes from oceans.

## Condensation

As water vapor rises, it cools and forms tiny droplets around dust particles in the atmosphere. These droplets come together to form clouds. This is condensation — the same process that causes fog on cold mornings.

## Precipitation

When cloud droplets combine and grow heavy enough, they fall back to Earth as rain, snow, sleet, or hail. This is precipitation, and it's how freshwater reaches the ground.

## Collection

After precipitation, water flows into rivers, lakes, and oceans through runoff and groundwater. From there, the cycle begins again.

Understanding the water cycle helps us appreciate how interconnected our planet's systems really are.`,
    comments: [
      { author: "Maya R.", text: "The section on condensation finally made it click for me!", time: "2h ago" },
      { author: "Jordan K.", text: "Great breakdown. Could you do one on the carbon cycle next?", time: "5h ago" },
      { author: "Sam W.", text: "Love the real-world examples.", time: "1d ago" },
    ],
  },
};

const DEFAULT_CONTENT = {
  title: "Content Not Found",
  description: "This item doesn't exist or has been removed.",
  body: "",
  category: "Unknown",
  author: "Unknown",
  readTime: "0 min",
  views: 0,
  comments: [],
};

export default function ContentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const content = MOCK_CONTENT[id || ""] || DEFAULT_CONTENT;
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComment("");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/catalog")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Catalog
          </button>
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-muted-foreground">
              Brainly<span className="text-purple-400"> Weird</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Meta */}
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="rounded-lg bg-purple-500/15 px-2.5 py-1 font-medium text-purple-300">
              {content.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {content.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {content.views} views
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {content.comments.length} comments
            </span>
          </div>

          <h1 className="text-2xl font-bold text-foreground leading-tight">
            {content.title}
          </h1>
          <p className="mt-2 text-muted-foreground">{content.description}</p>

          <p className="mt-4 text-xs text-muted-foreground/60">
            by {content.author}
          </p>

          {/* Body */}
          {content.body && (
            <Card className="clay-card-lg border-0 mt-8">
              <CardContent className="p-6">
                <div className="prose prose-invert max-w-none text-sm leading-relaxed text-foreground/80">
                  {content.body.split("\n\n").map((para, i) => {
                    if (para.startsWith("## ")) {
                      return (
                        <h2
                          key={i}
                          className="mt-6 mb-3 text-lg font-bold text-foreground"
                        >
                          {para.replace("## ", "")}
                        </h2>
                      );
                    }
                    return (
                      <p key={i} className="mb-4">
                        {para}
                      </p>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => setLiked(!liked)}
              className={`clay-btn flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                liked
                  ? "bg-rose-500/15 text-rose-300"
                  : "bg-amber-50/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              {liked ? "Liked" : "Like"}
            </button>
            <button className="clay-btn flex items-center gap-2 rounded-xl bg-amber-50/40 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          {/* Comments */}
          <div className="mt-10">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Comments ({content.comments.length})
            </h3>

            <div className="space-y-3">
              {content.comments.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="clay-card rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {c.author}
                    </span>
                    <span className="text-xs text-muted-foreground/50">
                      {c.time}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {c.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Comment input */}
            <form onSubmit={handleSubmitComment} className="mt-4 flex gap-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="clay-input flex-1"
              />
              <Button
                type="submit"
                disabled={!comment.trim()}
                className="clay-btn rounded-xl bg-purple-500 px-4 text-white hover:bg-purple-400 disabled:opacity-30"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
