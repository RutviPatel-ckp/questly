import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Crown, Lock, CheckCircle2, Play, Star, BookOpen } from "lucide-react";
import { SUBJECT_REALMS, TOPICS_BY_SUBJECT, PARTS_PER_TOPIC, getPartTitle } from "@/lib/onboarding-data";
import MascotCharacter from "@/components/MascotCharacter";
import FloatingShapes from "@/components/FloatingShapes";

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

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      <FloatingShapes count={8} />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `${realm.color}15` }}
        />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
          className="mb-8 text-center"
        >
          <div
            className="inline-flex items-center justify-center rounded-full p-4 mb-4"
            style={{ backgroundColor: `${realm.color}15` }}
          >
            <span className="text-4xl">{realm.icon}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">{realm.name}</h1>
          <p className="text-sm text-muted-foreground">{realm.description}</p>
        </motion.div>

        {/* Topic Quests */}
        <div className="space-y-3">
          {topics.map((topic, index) => {
            const isCurrentTopic = currentSubject === decodeURIComponent(subject || "") && currentTopic === topic;
            const isUnlocked = index === 0 || currentTopic !== undefined;
            const isCompleted = currentTopic !== topic && index < topics.indexOf(currentTopic || "");

            return (
              <motion.div
                key={topic}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => handleSelectTopic(topic)}
                  disabled={!isUnlocked && !isCurrentTopic}
                  className={`subject-card w-full text-left ${isCurrentTopic ? "ring-2 ring-amber-400" : ""}`}
                >
                  <Card className={`clay-card border-0 ${!isUnlocked && !isCurrentTopic ? "opacity-50" : ""}`}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div
                        className="flex items-center justify-center rounded-full w-12 h-12 shrink-0"
                        style={{
                          backgroundColor: isCurrentTopic
                            ? realm.color
                            : isCompleted
                              ? "oklch(0.55 0.14 140)"
                              : "oklch(0.90 0.03 85)",
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        ) : isCurrentTopic ? (
                          <Play className="h-5 w-5 text-white" />
                        ) : !isUnlocked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{topic}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isCompleted
                            ? `Completed · ${PARTS_PER_TOPIC} chapters done`
                            : isCurrentTopic
                              ? "Continue your quest"
                              : `${PARTS_PER_TOPIC} chapters to unlock`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {isCompleted && (
                          <div className="flex items-center gap-0.5 text-amber-600">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span className="text-xs font-medium">⭐</span>
                          </div>
                        )}
                        {isUnlocked && !isCompleted && (
                          <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${realm.color}20` }}>
                            <Play className="h-3.5 w-3.5" style={{ color: realm.color }} />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Companion */}
        <div className="mt-8 flex justify-center">
          <MascotCharacter
            characterType={character.characterType}
            size={80}
            isTalking={false}
          />
        </div>
      </div>
    </div>
  );
}
