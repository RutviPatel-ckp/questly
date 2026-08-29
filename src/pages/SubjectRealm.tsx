import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, Lock, CheckCircle2, Play, ChevronLeft } from "lucide-react";
import { SUBJECT_REALMS, TOPICS_BY_SUBJECT, PARTS_PER_TOPIC, getPartTitle } from "@/lib/onboarding-data";
import MascotCharacter from "@/components/MascotCharacter";
import FloatingShapes from "@/components/FloatingShapes";

// Winding path positions for topics
const TOPIC_POSITIONS = [
  { x: 50, y: 8 },
  { x: 30, y: 24 },
  { x: 70, y: 40 },
  { x: 25, y: 56 },
  { x: 75, y: 72 },
];

// Chapter sub-node positions (relative, vertical list)
const CHAPTER_POSITIONS = [
  { x: 50, y: 5 },
  { x: 50, y: 25 },
  { x: 50, y: 45 },
  { x: 50, y: 65 },
];

export default function SubjectRealm() {
  const navigate = useNavigate();
  const { subject } = useParams<{ subject: string }>();
  const character = useQuery(api.characters.getCharacter);
  const saveProfile = useMutation(api.lessons.saveProfile);

  // Local state for expanded topic
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const realm = useMemo(() => {
    if (!subject) return null;
    const decoded = decodeURIComponent(subject);
    return SUBJECT_REALMS[decoded] || null;
  }, [subject]);

  const topics = useMemo(() => {
    if (!subject) return [];
    const decoded = decodeURIComponent(subject);
    return TOPICS_BY_SUBJECT[decoded] || [];
  }, [subject]);

  const handleSelectTopic = async (topic: string) => {
    if (!character || !subject) return;
    const decoded = decodeURIComponent(subject);
    // Save the topic but DON'T navigate - just expand it
    try {
      await saveProfile({
        subject: decoded,
        topic,
        region: character.region || "Other (General/Global)",
        grade: character.grade || "Grade 8",
      });
      setExpandedTopic(topic);
    } catch (e) {
      console.error("Failed to select topic:", e);
    }
  };

  const handleSelectChapter = (topic: string, chapter: number) => {
    // Navigate to lesson with the specific part
    navigate("/lesson");
  };

  const handleBackToTopics = () => {
    setExpandedTopic(null);
  };

  if (!realm || character === undefined || character === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-grid">
        <div className="animate-pulse text-muted-foreground">Loading realm...</div>
      </div>
    );
  }

  const currentTopic = character.topic;
  const currentSubject = character.subject;
  const isThisSubject = currentSubject === decodeURIComponent(subject || "");
  const currentPart = character.currentPart || 1;

  // Determine status of each topic
  const topicStatuses = topics.map((topic, idx) => {
    if (isThisSubject && currentTopic === topic) return "current" as const;
    if (isThisSubject && currentTopic && topics.indexOf(currentTopic) > idx) return "completed" as const;
    if (idx === 0) return "available" as const;
    if (isThisSubject && currentTopic) return idx <= topics.indexOf(currentTopic) + 1 ? "available" as const : "locked" as const;
    return "locked" as const;
  });

  // When a topic is expanded, show chapters
  if (expandedTopic) {
    const topicIdx = topics.indexOf(expandedTopic);
    const chapterStatuses = Array.from({ length: PARTS_PER_TOPIC }).map((_, ci) => {
      if (isThisSubject && currentTopic === expandedTopic) {
        if (ci + 1 < currentPart) return "completed" as const;
        if (ci + 1 === currentPart) return "current" as const;
        return "available" as const;
      }
      // If this is the topic after the current one, chapters are all available
      if (isThisSubject && currentTopic && topics.indexOf(currentTopic) + 1 === topicIdx) {
        if (ci === 0) return "current" as const;
        return "locked" as const;
      }
      // If completed topic, all chapters are completed
      if (topicStatuses[topicIdx] === "completed") return "completed" as const;
      // First chapter of first available topic
      if (topicStatuses[topicIdx] === "available" && ci === 0) return "current" as const;
      if (topicStatuses[topicIdx] === "available") return "locked" as const;
      return "locked" as const;
    });

    const unlockedCount = chapterStatuses.filter(s => s !== "locked").length;

    return (
      <div className="min-h-screen overflow-hidden bg-grid">
        <FloatingShapes count={6} />
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]"
            style={{ backgroundColor: `${realm.color}15` }} />
        </div>

        <div className="relative mx-auto max-w-lg px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={handleBackToTopics} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all duration-250">
              <ChevronLeft className="h-4 w-4" /> {realm.name}
            </button>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                Quest<span className="text-amber-600">ly</span>
              </span>
            </div>
          </div>

          {/* Topic Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
            <h1 className="text-xl font-bold text-amber-900 mb-1">{expandedTopic}</h1>
            <p className="text-xs text-amber-700/60">
              {unlockedCount} of {PARTS_PER_TOPIC} chapters unlocked · {realm.name}
            </p>
          </motion.div>

          {/* Chapter Nodes - vertical winding path */}
          <div className="relative mx-auto" style={{ maxWidth: "320px", minHeight: `${PARTS_PER_TOPIC * 140 + 40}px` }}>
            {/* Vertical path line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chapPathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={realm.color} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={realm.color} stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                d={`M 50 3 ${CHAPTER_POSITIONS.slice(0, PARTS_PER_TOPIC).map((pos, i) => {
                  const side = i % 2 === 0 ? -1 : 1;
                  return `Q ${50 + side * 15} ${pos.y + 8}, ${pos.x} ${pos.y + 10}`;
                }).join(" ")}`}
                fill="none" stroke="url(#chapPathGrad)" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 1" opacity="0.5"
              />
            </svg>

            {/* Chapter Nodes */}
            {Array.from({ length: PARTS_PER_TOPIC }).map((_, ci) => {
              const status = chapterStatuses[ci];
              const pos = CHAPTER_POSITIONS[ci] || { x: 50, y: ci * 20 + 5 };
              const chapterTitle = getPartTitle(character.subject || "", expandedTopic, ci + 1);
              const isClickable = status !== "locked";

              return (
                <motion.div
                  key={ci}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + ci * 0.12, type: "spring", stiffness: 200 }}
                  className="absolute"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, 0)" }}
                >
                  <button
                    onClick={() => isClickable && handleSelectChapter(expandedTopic, ci + 1)}
                    disabled={!isClickable}
                    className={`relative flex flex-col items-center gap-1.5 group ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
                  >
                    {/* Chapter node circle */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                        status === "current" ? "ring-4 ring-offset-2 ring-offset-background shadow-lg" :
                        status === "completed" ? "shadow-md" : "opacity-50"
                      }`}
                      style={{
                        backgroundColor: status === "locked" ? "oklch(0.88 0.03 85)" :
                          status === "completed" || status === "current" ? realm.color : `${realm.color}40`,
                      }}
                    >
                      {status === "completed" ? <CheckCircle2 className="h-5 w-5 text-white" /> :
                       status === "current" ? <Play className="h-5 w-5 text-white ml-0.5" /> :
                       status === "locked" ? <Lock className="h-4 w-4 text-amber-400/60" /> :
                       <span className="text-sm font-bold text-amber-800">{ci + 1}</span>}
                    </div>

                    {/* Chapter label */}
                    <div className={`clay-card px-3 py-1.5 rounded-xl text-center max-w-[200px] ${status === "locked" ? "opacity-40" : ""}`}>
                      <p className={`text-[10px] font-bold leading-tight ${status === "locked" ? "text-amber-500/50" : "text-amber-900"}`}>
                        {chapterTitle || `Chapter ${ci + 1}`}
                      </p>
                      <p className="text-[8px] text-amber-600/50 mt-0.5">
                        {status === "completed" ? "✅ Completed" : status === "current" ? "▶ Play this chapter" : "🔒 Complete previous first"}
                      </p>
                    </div>

                    {/* Coin earned indicator */}
                    {status === "completed" && (
                      <span className="text-[10px] text-amber-700">+1 🪙</span>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Companion */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <MascotCharacter characterType={character.characterType} size={72} isTalking={false} />
            <div className="clay-card rounded-2xl px-4 py-2 text-center">
              <p className="text-xs text-amber-800 font-medium">
                {chapterStatuses.every(s => s === "completed")
                  ? "🏆 All chapters complete! Go back and try the next topic!"
                  : chapterStatuses.includes("current")
                    ? "⚔️ Tap a chapter to begin learning!"
                    : "🌟 Complete previous chapters to unlock more!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default view: Topic winding path
  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      <FloatingShapes count={8} />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `${realm.color}15` }} />
      </div>

      <div className="relative mx-auto max-w-lg px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all duration-250">
            <ArrowLeft className="h-4 w-4" /> Kingdom
          </button>
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              Quest<span className="text-amber-600">ly</span>
            </span>
          </div>
        </div>

        {/* Realm Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
          <div className="inline-flex items-center justify-center rounded-full p-3 mb-3" style={{ backgroundColor: `${realm.color}18` }}>
            <span className="text-3xl">{realm.icon}</span>
          </div>
          <h1 className="text-xl font-bold text-amber-900 mb-1">{realm.name}</h1>
          <p className="text-xs text-amber-700/60">{realm.description}</p>
        </motion.div>

        {/* Winding Path with Topic Nodes */}
        <div className="relative" style={{ minHeight: `${topics.length * 130 + 60}px` }}>
          {/* Path line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={realm.color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={realm.color} stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path
              d={`M 50 5 ${topics.map((_, i) => {
                const pos = TOPIC_POSITIONS[i] || { x: 50, y: 8 + i * 18 };
                return `Q ${i % 2 === 0 ? pos.x - 18 : pos.x + 18} ${pos.y - 7}, ${pos.x} ${pos.y}`;
              }).join(" ")}`}
              fill="none" stroke="url(#pathGrad)" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="2 1" opacity="0.5"
            />
          </svg>

          {/* Level Nodes */}
          {topics.map((topic, index) => {
            const status = topicStatuses[index];
            const pos = TOPIC_POSITIONS[index] || { x: 50, y: 8 + index * 18 };
            const nodeSize = status === "current" ? "w-16 h-16" : "w-12 h-12";
            const isClickable = status !== "locked";
            // Count completed chapters for this topic
            const topicChaptersDone = (isThisSubject && currentTopic === topic) ? Math.max(0, currentPart - 1) :
              topicStatuses[index] === "completed" ? PARTS_PER_TOPIC : 0;

            return (
              <motion.div
                key={topic}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + index * 0.1, type: "spring", stiffness: 200 }}
                className="absolute"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <button
                  onClick={() => isClickable && handleSelectTopic(topic)}
                  disabled={!isClickable}
                  className={`relative flex flex-col items-center gap-1.5 group ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  {/* Coin dots */}
                  <div className="flex gap-0.5 mb-0.5">
                    {Array.from({ length: PARTS_PER_TOPIC }).map((_, ci) => (
                      <div key={ci} className={`w-2 h-2 rounded-full ${
                        ci < topicChaptersDone ? "bg-amber-400" : "bg-amber-200/50"
                      }`} />
                    ))}
                  </div>

                  {/* Main node */}
                  <div
                    className={`${nodeSize} rounded-full flex items-center justify-center transition-all duration-300 ${
                      status === "current" ? "ring-4 ring-offset-2 ring-offset-background shadow-lg" :
                      status === "completed" ? "shadow-md" : "opacity-60"
                    }`}
                    style={{
                      backgroundColor: status === "locked" ? "oklch(0.88 0.03 85)" :
                        status === "completed" || status === "current" ? realm.color : `${realm.color}40`,
                    }}
                  >
                    {status === "completed" ? <CheckCircle2 className="h-5 w-5 text-white" /> :
                     status === "current" ? <Play className="h-5 w-5 text-white ml-0.5" /> :
                     status === "locked" ? <Lock className="h-4 w-4 text-amber-400/60" /> :
                     <span className="text-sm font-bold text-amber-800">{index + 1}</span>}
                  </div>

                  {/* Level label */}
                  <div className={`clay-card px-3 py-1.5 rounded-xl text-center max-w-[140px] ${status === "locked" ? "opacity-40" : ""} ${status === "current" ? "ring-2" : ""}`}
                    style={status === "current" ? { boxShadow: `0 0 0 2px ${realm.color}40` } : undefined}
                  >
                    <p className={`text-[10px] font-bold leading-tight ${status === "locked" ? "text-amber-500/50" : "text-amber-900"}`}>
                      {topic}
                    </p>
                    <p className="text-[8px] text-amber-600/50 mt-0.5">
                      {status === "completed"
                        ? `${PARTS_PER_TOPIC}/${PARTS_PER_TOPIC} chapters · ✅`
                        : status === "current"
                          ? `Chapter ${currentPart} of ${PARTS_PER_TOPIC} · ▶`
                          : `${PARTS_PER_TOPIC} chapters`}
                    </p>
                  </div>

                  {isClickable && (
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `radial-gradient(circle, ${realm.color}20, transparent 70%)`, transform: "scale(1.5)", pointerEvents: "none" }}
                    />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Companion at bottom */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <MascotCharacter characterType={character.characterType} size={80} isTalking={false} />
          <div className="clay-card rounded-2xl px-4 py-2 text-center">
            <p className="text-xs text-amber-800 font-medium">
              {topicStatuses.every(s => s === "completed")
                ? "🏆 You've conquered this kingdom! Amazing work!"
                : topicStatuses.includes("current")
                  ? "⚔️ Tap a topic to see its chapters!"
                  : "🌟 Choose a topic to begin your quest!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
