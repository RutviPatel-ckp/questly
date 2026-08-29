import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Crown, Lock, CheckCircle2, Play, ChevronLeft, Star } from "lucide-react";
import { SUBJECT_REALMS, TOPICS_BY_SUBJECT, PARTS_PER_TOPIC, getPartTitle } from "@/lib/onboarding-data";
import MascotCharacter from "@/components/MascotCharacter";

// Winding path positions for topics (staggered left/right)
const TOPIC_POSITIONS = [
  { x: 50, y: 10 },
  { x: 28, y: 26 },
  { x: 72, y: 42 },
  { x: 28, y: 58 },
  { x: 72, y: 74 },
];

// Chapter sub-node positions (vertical winding)
const CHAPTER_POSITIONS = [
  { x: 50, y: 10 },
  { x: 30, y: 30 },
  { x: 70, y: 50 },
  { x: 50, y: 70 },
];

export default function SubjectRealm() {
  const navigate = useNavigate();
  const { subject } = useParams<{ subject: string }>();
  const character = useQuery(api.characters.getCharacter);
  const saveProfile = useMutation(api.lessons.saveProfile);

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

  const handleSelectChapter = (_topic: string, _chapter: number) => {
    navigate("/lesson");
  };

  const handleBackToTopics = () => {
    setExpandedTopic(null);
  };

  if (!realm || character === undefined || character === null) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "linear-gradient(180deg, oklch(0.93 0.04 80), oklch(0.88 0.06 100))" }}>
        <div className="animate-pulse text-amber-700/60 font-medium">Loading realm...</div>
      </div>
    );
  }

  const currentTopic = character.topic;
  const currentSubject = character.subject;
  const isThisSubject = currentSubject === decodeURIComponent(subject || "");
  const currentPart = character.currentPart || 1;

  const topicStatuses = topics.map((topic, idx) => {
    if (isThisSubject && currentTopic === topic) return "current" as const;
    if (isThisSubject && currentTopic && topics.indexOf(currentTopic) > idx) return "completed" as const;
    if (idx === 0) return "available" as const;
    if (isThisSubject && currentTopic) return idx <= topics.indexOf(currentTopic) + 1 ? "available" as const : "locked" as const;
    return "locked" as const;
  });

  // ============ CHAPTER VIEW (expanded topic) ============
  if (expandedTopic) {
    const topicIdx = topics.indexOf(expandedTopic);
    const chapterStatuses = Array.from({ length: PARTS_PER_TOPIC }).map((_, ci) => {
      if (isThisSubject && currentTopic === expandedTopic) {
        if (ci + 1 < currentPart) return "completed" as const;
        if (ci + 1 === currentPart) return "current" as const;
        return "available" as const;
      }
      if (isThisSubject && currentTopic && topics.indexOf(currentTopic) + 1 === topicIdx) {
        if (ci === 0) return "current" as const;
        return "locked" as const;
      }
      if (topicStatuses[topicIdx] === "completed") return "completed" as const;
      if (topicStatuses[topicIdx] === "available" && ci === 0) return "current" as const;
      if (topicStatuses[topicIdx] === "available") return "locked" as const;
      return "locked" as const;
    });

    const completedChapters = chapterStatuses.filter(s => s === "completed").length;

    return (
      <div className="min-h-screen overflow-hidden" style={{ background: "linear-gradient(180deg, oklch(0.93 0.04 80), oklch(0.90 0.05 95))" }}>
        {/* Decorative trees */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-10 left-4 text-4xl opacity-30">🌳</div>
          <div className="absolute top-40 right-2 text-3xl opacity-20">🌲</div>
          <div className="absolute bottom-20 left-2 text-3xl opacity-20">🌴</div>
          <div className="absolute top-60 left-1/4 text-2xl opacity-15">🍃</div>
          <div className="absolute bottom-40 right-1/4 text-2xl opacity-15">🌿</div>
        </div>

        <div className="relative mx-auto max-w-lg px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={handleBackToTopics} className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900 transition-all">
              <ChevronLeft className="h-4 w-4" /> {realm.name}
            </button>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-900">Quest<span className="text-amber-600">ly</span></span>
            </div>
          </div>

          {/* Title Banner */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
            <div className="inline-block relative">
              <div className="rounded-2xl px-6 py-3 border-2 border-amber-600/30" style={{ background: "linear-gradient(135deg, oklch(0.95 0.06 85), oklch(0.92 0.08 80))" }}>
                <h1 className="text-lg font-bold text-amber-900">{expandedTopic}</h1>
                <p className="text-xs text-amber-700/70 mt-0.5">
                  {realm.icon} {realm.name} · {completedChapters}/{PARTS_PER_TOPIC} chapters
                </p>
              </div>
              {/* Banner ribbons */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-6 rounded-l-lg" style={{ backgroundColor: "oklch(0.85 0.08 80)" }} />
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-6 rounded-r-lg" style={{ backgroundColor: "oklch(0.85 0.08 80)" }} />
            </div>
          </motion.div>

          {/* Chapter Winding Path */}
          <div className="relative mx-auto" style={{ maxWidth: "340px", minHeight: `${PARTS_PER_TOPIC * 160 + 60}px` }}>
            {/* Winding path SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chapPathGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={realm.color} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={realm.color} stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path
                d={`M 50 8 ${CHAPTER_POSITIONS.slice(0, PARTS_PER_TOPIC).map((pos, i) => {
                  const side = i % 2 === 0 ? -1 : 1;
                  return `Q ${50 + side * 18} ${pos.y + 5}, ${pos.x} ${pos.y + 10}`;
                }).join(" ")}`}
                fill="none" stroke="url(#chapPathGrad2)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 1.5" opacity="0.6"
              />
            </svg>

            {/* Chapter Nodes */}
            {Array.from({ length: PARTS_PER_TOPIC }).map((_, ci) => {
              const status = chapterStatuses[ci];
              const pos = CHAPTER_POSITIONS[ci] || { x: 50, y: ci * 22 + 8 };
              const chapterTitle = getPartTitle(character.subject || "", expandedTopic, ci + 1);
              const isClickable = status !== "locked";
              const isCompleted = status === "completed";
              const isCurrent = status === "current";

              return (
                <motion.div
                  key={ci}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + ci * 0.12, type: "spring", stiffness: 200 }}
                  className="absolute"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, 0)" }}
                >
                  <button
                    onClick={() => isClickable && handleSelectChapter(expandedTopic, ci + 1)}
                    disabled={!isClickable}
                    className={`relative flex flex-col items-center gap-2 group ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
                  >
                    {/* Hexagonal Node */}
                    <div className="relative">
                      <div
                        className={`w-16 h-16 flex items-center justify-center transition-all duration-300 ${
                          isCurrent ? "shadow-xl scale-110" : isCompleted ? "shadow-md" : "opacity-40 grayscale-[30%]"
                        }`}
                        style={{
                          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                          backgroundColor: status === "locked" ? "oklch(0.88 0.03 85)" : realm.color,
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        ) : isCurrent ? (
                          <span className="text-lg font-extrabold text-white">{ci + 1}</span>
                        ) : status === "locked" ? (
                          <Lock className="h-4 w-4 text-amber-500/50" />
                        ) : (
                          <span className="text-base font-bold text-amber-800/60">{ci + 1}</span>
                        )}
                      </div>
                      {/* Current pulse */}
                      {isCurrent && (
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: realm.color, clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
                      )}
                    </div>

                    {/* Banner Label */}
                    <div
                      className={`relative px-4 py-2 rounded-xl text-center max-w-[180px] border ${
                        isCurrent ? "border-amber-500/40 shadow-md" : isCompleted ? "border-amber-300/30" : "border-transparent opacity-40"
                      }`}
                      style={{
                        background: isCurrent ? "linear-gradient(135deg, oklch(0.97 0.04 85), oklch(0.95 0.06 80))"
                          : isCompleted ? "oklch(0.96 0.03 85 / 0.8)"
                          : "oklch(0.93 0.02 85 / 0.5)",
                      }}
                    >
                      <p className={`text-[11px] font-bold leading-tight ${status === "locked" ? "text-amber-600/40" : "text-amber-900"}`}>
                        {chapterTitle || `Chapter ${ci + 1}`}
                      </p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {isCompleted ? (
                          <span className="text-[10px] text-emerald-600 font-semibold">✅ Done · +1 🪙</span>
                        ) : isCurrent ? (
                          <span className="text-[10px] font-semibold" style={{ color: realm.color }}>▶ Play Now</span>
                        ) : (
                          <span className="text-[10px] text-amber-500/40">🔒 Locked</span>
                        )}
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}

            {/* Finish Flag */}
            <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "88%" }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: "spring" }}>
                <div className="text-3xl">🏁</div>
              </motion.div>
            </div>
          </div>

          {/* Companion */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <MascotCharacter characterType={character.characterType} size={64} isTalking={false} />
            <div className="rounded-2xl px-4 py-2 text-center border border-amber-300/30" style={{ background: "oklch(0.97 0.03 85 / 0.9)" }}>
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

  // ============ TOPIC MAP VIEW (main realm) ============
  const completedCount = topicStatuses.filter(s => s === "completed").length;

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "linear-gradient(180deg, oklch(0.93 0.04 80), oklch(0.90 0.05 95))" }}>
      {/* Decorative foliage */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-8 left-2 text-4xl opacity-25">🌳</div>
        <div className="absolute top-32 right-1 text-3xl opacity-20">🌲</div>
        <div className="absolute top-1/3 left-1 text-2xl opacity-15">🌴</div>
        <div className="absolute bottom-32 right-2 text-3xl opacity-20">🌿</div>
        <div className="absolute bottom-16 left-3 text-2xl opacity-15">🍃</div>
        <div className="absolute top-2/3 right-3 text-2xl opacity-10">🌾</div>
        <div className="absolute top-1/2 left-1/6 text-xl opacity-10">🍂</div>
      </div>

      <div className="relative mx-auto max-w-lg px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900 transition-all">
            <ArrowLeft className="h-4 w-4" /> Kingdom
          </button>
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-900">Quest<span className="text-amber-600">ly</span></span>
          </div>
        </div>

        {/* Realm Title Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
          <div className="inline-block relative">
            <div className="rounded-2xl px-6 py-3 border-2 border-amber-600/30" style={{ background: "linear-gradient(135deg, oklch(0.95 0.06 85), oklch(0.92 0.08 80))" }}>
              <div className="text-3xl mb-1">{realm.icon}</div>
              <h1 className="text-xl font-bold text-amber-900">{realm.name}</h1>
              <p className="text-xs text-amber-700/70 mt-0.5">{realm.description}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="h-3 w-3 text-amber-500 fill-amber-400" />
                <span className="text-[10px] font-bold text-amber-700">{completedCount}/{topics.length} levels cleared</span>
              </div>
            </div>
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-6 rounded-l-lg" style={{ backgroundColor: "oklch(0.85 0.08 80)" }} />
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-6 rounded-r-lg" style={{ backgroundColor: "oklch(0.85 0.08 80)" }} />
          </div>
        </motion.div>

        {/* Winding Path with Topic Nodes */}
        <div className="relative" style={{ minHeight: `${topics.length * 150 + 80}px` }}>
          {/* Path SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="topicPathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={realm.color} stopOpacity="0.5" />
                <stop offset="100%" stopColor={realm.color} stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <path
              d={`M 50 8 ${topics.map((_, i) => {
                const pos = TOPIC_POSITIONS[i] || { x: 50, y: 10 + i * 18 };
                const side = i % 2 === 0 ? -1 : 1;
                return `Q ${50 + side * 22} ${pos.y - 6}, ${pos.x} ${pos.y}`;
              }).join(" ")}`}
              fill="none" stroke="url(#topicPathGrad)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 2" opacity="0.6"
            />
          </svg>

          {/* Topic Nodes */}
          {topics.map((topic, index) => {
            const status = topicStatuses[index];
            const pos = TOPIC_POSITIONS[index] || { x: 50, y: 10 + index * 18 };
            const isClickable = status !== "locked";
            const isCompleted = status === "completed";
            const isCurrent = status === "current";

            const topicChaptersDone = (isThisSubject && currentTopic === topic) ? Math.max(0, currentPart - 1) :
              isCompleted ? PARTS_PER_TOPIC : 0;

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
                  className={`relative flex flex-col items-center gap-2 group ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  {/* Hexagonal Node */}
                  <div className="relative">
                    <div
                      className={`w-16 h-16 flex items-center justify-center transition-all duration-300 ${
                        isCurrent ? "shadow-xl scale-110" : isCompleted ? "shadow-md" : "opacity-50 grayscale-[20%]"
                      }`}
                      style={{
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        backgroundColor: status === "locked" ? "oklch(0.88 0.03 85)" : realm.color,
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      ) : isCurrent ? (
                        <Play className="h-5 w-5 text-white ml-0.5" />
                      ) : status === "locked" ? (
                        <Lock className="h-4 w-4 text-amber-500/50" />
                      ) : (
                        <span className="text-base font-bold text-amber-800/60">{index + 1}</span>
                      )}
                    </div>
                    {isCurrent && (
                      <div className="absolute inset-0 animate-ping opacity-15" style={{ backgroundColor: realm.color, clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
                    )}
                  </div>

                  {/* Banner Label */}
                  <div
                    className={`relative px-4 py-2 rounded-xl text-center max-w-[160px] border ${
                      isCurrent ? "border-amber-500/40 shadow-md" : isCompleted ? "border-amber-300/30" : "border-transparent opacity-40"
                    }`}
                    style={{
                      background: isCurrent ? "linear-gradient(135deg, oklch(0.97 0.04 85), oklch(0.95 0.06 80))"
                        : isCompleted ? "oklch(0.96 0.03 85 / 0.8)"
                        : "oklch(0.93 0.02 85 / 0.5)",
                    }}
                  >
                    <p className={`text-[11px] font-bold leading-tight ${status === "locked" ? "text-amber-600/40" : "text-amber-900"}`}>
                      {topic}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {isCompleted ? (
                        <span className="text-[10px] font-bold text-emerald-600">{PARTS_PER_TOPIC}/{PARTS_PER_TOPIC} ✅</span>
                      ) : isCurrent ? (
                        <span className="text-[10px] font-bold" style={{ color: realm.color }}>
                          {topicChaptersDone}/{PARTS_PER_TOPIC} ▶
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-500/40">{PARTS_PER_TOPIC} chapters</span>
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}

          {/* Finish Castle */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "92%" }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }} className="flex flex-col items-center">
              <div className="text-4xl">🏰</div>
              <div className="rounded-xl px-3 py-1 mt-1 border border-amber-400/30" style={{ background: "oklch(0.96 0.04 85 / 0.9)" }}>
                <p className="text-[10px] font-bold text-amber-700">Kingdom Goal</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Companion at bottom */}
        <div className="mt-6 flex flex-col items-center gap-2 pb-8">
          <MascotCharacter characterType={character.characterType} size={72} isTalking={false} />
          <div className="rounded-2xl px-4 py-2 text-center border border-amber-300/30" style={{ background: "oklch(0.97 0.03 85 / 0.9)" }}>
            <p className="text-xs text-amber-800 font-medium">
              {topicStatuses.every(s => s === "completed")
                ? "🏆 You've conquered this kingdom! Amazing work!"
                : topicStatuses.includes("current")
                  ? "⚔️ Tap a level to see its chapters!"
                  : "🌟 Choose a level to begin your quest!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
