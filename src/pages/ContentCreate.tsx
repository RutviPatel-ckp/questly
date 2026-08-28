import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ArrowLeft,
  Terminal,
  Upload,
  FileText,
  Link,
  Image,
  Check,
  Loader2,
} from "lucide-react";

const CATEGORIES = [
  "Science",
  "Programming",
  "Math",
  "History",
  "Design",
  "General",
];

const CONTENT_TYPES = [
  { id: "lesson", label: "Lesson", icon: FileText, description: "A structured learning resource" },
  { id: "link", label: "Link", icon: Link, description: "A useful external resource" },
  { id: "note", label: "Note", icon: Image, description: "A quick note or observation" },
];

export default function ContentCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("General");
  const [contentType, setContentType] = useState("lesson");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSaving(true);
    // Simulate save
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => navigate("/catalog"), 1200);
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
          <h1 className="text-2xl font-bold text-foreground">Create Content</h1>
          <p className="mt-1 text-muted-foreground">
            Share a lesson, resource, or note with your team.
          </p>
        </motion.div>

        {saved ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="clay-card-lg border-0">
              <CardContent className="py-12 text-center">
                <div className="clay-card mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15">
                  <Check className="h-8 w-8 text-emerald-400" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-foreground">
                  Content published!
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Redirecting you to the catalog...
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <form onSubmit={handleSave}>
            {/* Content type selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
                Content type
              </p>
              <div className="grid grid-cols-3 gap-3">
                {CONTENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setContentType(type.id)}
                    className={`clay-btn flex flex-col items-center gap-2 rounded-2xl p-4 transition-all ${
                      contentType === type.id
                        ? "bg-purple-500/15 ring-2 ring-purple-500/50 ring-offset-2 ring-offset-background"
                        : "bg-amber-50/40"
                    }`}
                  >
                    <type.icon
                      className={`h-5 w-5 ${contentType === type.id ? "text-purple-400" : "text-muted-foreground"}`}
                    />
                    <span
                      className={`text-sm font-medium ${contentType === type.id ? "text-purple-300" : "text-muted-foreground"}`}
                    >
                      {type.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground/50 text-center">
                      {type.description}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Form fields */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="clay-card-lg border-0">
                <CardHeader>
                  <CardTitle className="text-sm">Details</CardTitle>
                  <CardDescription>
                    Give your content a title and description so others can find it.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Title
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Introduction to Photosynthesis"
                      className="clay-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Description
                    </label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="A short summary of what this covers"
                      className="clay-input"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`clay-btn rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                            category === cat
                              ? "bg-purple-500 text-white"
                              : "bg-amber-50/40 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Content
                    </label>
                    <Textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your lesson content here. Use ## for section headers."
                      className="clay-input min-h-[200px] resize-none text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex items-center justify-between"
            >
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="clay-btn border-amber-200/30 bg-amber-50/40 text-muted-foreground hover:bg-amber-100/50"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  disabled={!title.trim() || isSaving}
                  className="clay-glow bg-purple-500 text-white hover:bg-purple-400 disabled:opacity-30"
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Publish
                </Button>
              </div>
            </motion.div>
          </form>
        )}
      </div>
    </div>
  );
}
