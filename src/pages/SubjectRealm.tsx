import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, Lock, CheckCircle2, Play } from "lucide-react";
import { SUBJECT_REALMS, TOPICS_BY_SUBJECT, PARTS_PER_TOPIC } from "@/lib/onboarding-data";
import MascotCharacter from "@/components/MascotCharacter";
import FloatingShapes from "@/components/FloatingShapes";

// Winding path positions (zigzag left-right pattern)
const PATH_POSITIONS = [
  { x: 50, y: 8, side: "left" as const },
  { x: 30, y: 22, side: "right" as const },
  { x: 70, y: 36, side: "left" as const },
  { x: 25, y: 50, side: "right" as const },
  { x: 75, y: 64, side: "left" as const },
];

export default function SubjectRealm() {
  const navigate = useNavigate();
  const { subject } = useParams<{ subject: string }>();
  const character = useQuery(api.characters.getCharacter);
  const saveProfile = useMutation(api.lessons.saveProfile);

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
    try {
      await saveProfile({
        subject: decoded,
        topic,
        region: character.region || "Other (General/Global)",
        grade: character.grade || "Grade 8",
      });
      navigate("/lesson");
    } catch (e) {
      console.error("Failed to select topic:", e);
    }
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

  // Determine status of each topic based on sequential completion
  const topicStatuses = topics.map((topic, idx) => {
    if (isThisSubject && currentTopic === topic) return "current" as const;
    // Previous topics in this subject are completed if we've moved past them
    if (isThisSubject && currentTopic && topics.indexOf(currentTopic) > idx) return "completed" as const;
    // First topic is always unlocked
    if (idx === 0) return "available" as const;
    // Other topics: unlocked if currentTopic exists (we've started the subject)
    if (isThisSubject && currentTopic) return idx <= topics.indexOf(currentTopic) + 1 ? "available" as const : "locked" as const;
    // If not started this subject, only first is available
    return "locked" as const;
  });

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      <FloatingShapes count={8} />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `${realm.color}15` }}
        />
      </div>

      <div className="relative mx-auto max-w-lg px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all duration-250"
          >
            <ArrowLeft className="h-4 w-4" />
            Kingdom
          </button>
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              Quest<span className="text-amber-600">ly</span>
            </span>
          </div>
        </div>

        {/* Realm Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div
            className="inline-flex items-center justify-center rounded-full p-3 mb-3"
            style={{ backgroundColor: `${realm.color}18` }}
          >
            <span className="text-3xl">{realm.icon}</span>
          </div>
          <h1 className="text-xl font-bold text-amber-900 mb-1">{realm.name}</h1>
          <p className="text-xs text-amber-700/60">{realm.description}</p>
        </motion.div>

        {/* Winding Path with Level Nodes */}
        <div className="relative" style={{ minHeight: `${topics.length * 120 + 60}px` }}>
          {/* Path line (SVG winding) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={realm.color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={realm.color} stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path
              d={`M 50 5 ${topics.map((_, i) => {
                const pos = PATH_POSITIONS[i] || { x: 50, y: 8 + i * 16 };
                return `Q ${pos.side === "left" ? pos.x - 15 : pos.x + 15} ${pos.y - 5}, ${pos.x} ${pos.y}`;
              }).join(" ")}`}
              fill="none"
              stroke="url(#pathGrad)"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeDasharray="2 1"
              opacity="0.5"
            />
          </svg>

          {/* Level Nodes */}
          {topics.map((topic, index) => {
            const status = topicStatuses[index];
            const pos = PATH_POSITIONS[index] || { x: 50, y: 8 + index * 16 };
            const nodeSize = status === "current" ? "w-16 h-16" : "w-12 h-12";
            const isClickable = status !== "locked";

            return (
              <motion.div
                key={topic}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + index * 0.1, type: "spring", stiffness: 200 }}
                className="absolute"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Node circle */}
                <button
                  onClick={() => isClickable && handleSelectTopic(topic)}
                  disabled={!isClickable}
                  className={`relative flex flex-col items-center gap-1.5 group ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  {/* Coin indicators */}
                  <div className="flex gap-0.5 mb-0.5">
                    {Array.from({ length: PARTS_PER_TOPIC }).map((_, ci) => (
                      <div
                        key={ci}
                        className={`w-2 h-2 rounded-full ${
                          status === "completed"
                            ? "bg-amber-400"
                            : status === "current" && ci < (character.currentPart || 1) - 1
                              ? "bg-amber-400"
                              : "bg-amber-200/50"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Main node */}
                  <div
                    className={`${nodeSize} rounded-full flex items-center justify-center transition-all duration-300 ${
                      status === "current"
                        ? "ring-4 ring-offset-2 ring-offset-background shadow-lg"
                        : status === "completed"
                          ? "shadow-md"
                          : "opacity-60"
                    }`}
                    style={{
                      backgroundColor: status === "locked"
                        ? "oklch(0.88 0.03 85)"
                        : status === "completed"
                          ? realm.color
                          : status === "current"
                            ? realm.color
                            : `${realm.color}40`,
                      borderColor: status === "current" ? realm.color : undefined,
                    }}
                  >
                    {status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : status === "current" ? (
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    ) : status === "locked" ? (
                      <Lock className="h-4 w-4 text-amber-400/60" />
                    ) : (
                      <span className="text-sm font-bold text-amber-800">{index + 1}</span>
                    )}
                  </div>

                  {/* Level label */}
                  <div className={`clay-card px-3 py-1.5 rounded-xl text-center max-w-[140px] ${
                    status === "locked" ? "opacity-40" : ""
                  } ${status === "current" ? "ring-2" : ""}`}
                    style={status === "current" ? { boxShadow: `0 0 0 2px ${realm.color}40` } : undefined}
                  >
                    <p className={`text-[10px] font-bold leading-tight ${
                      status === "locked" ? "text-amber-500/50" : "text-amber-900"
                    }`}>
                      {topic}
                    </p>
                    <p className="text-[8px] text-amber-600/50 mt-0.5">
                      {status === "completed"
                        ? `${PARTS_PER_TOPIC}/${PARTS_PER_TOPIC} chapters`
                        : status === "current"
                          ? `Chapter ${(character.currentPart || 1)} of ${PARTS_PER_TOPIC}`
                          : `${PARTS_PER_TOPIC} chapters`}
                    </p>
                  </div>

                  {/* Hover glow for available levels */}
                  {isClickable && (
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle, ${realm.color}20, transparent 70%)`,
                        transform: "scale(1.5)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Companion at bottom */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <MascotCharacter
            characterType={character.characterType}
            size={80}
            isTalking={false}
          />
          <div className="clay-card rounded-2xl px-4 py-2 text-center">
            <p className="text-xs text-amber-800 font-medium">
              {topicStatuses.every(s => s === "completed")
                ? "🏆 You've conquered this kingdom! Amazing work!"
                : topicStatuses.includes("current")
                  ? "⚔️ Keep going! Each chapter brings you closer to mastery!"
                  : "🌟 Choose a level to begin your quest!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
