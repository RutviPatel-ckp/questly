import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowLeft,
  Terminal,
  Loader2,
} from "lucide-react";
import {
  GRADES,
  SUBJECTS,
  REGIONS,
  TOPICS_BY_SUBJECT,
} from "@/lib/onboarding-data";
import MascotCharacter from "@/components/MascotCharacter";
import FloatingShapes from "@/components/FloatingShapes";

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

export default function Onboarding() {
  const navigate = useNavigate();
  const character = useQuery(api.characters.getCharacter);
  const saveProfile = useMutation(api.lessons.saveProfile);

  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [region, setRegion] = useState("");
  const [topic, setTopic] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setTopic("");
  }, [subject]);

  const topics = subject ? TOPICS_BY_SUBJECT[subject] || [] : [];

  const themeColor = character
    ? COLOR_THEMES[character.colorTheme] || "#c084fc"
    : "#c084fc";

  const handleSave = async () => {
    if (!grade || !subject || !region || !topic) return;
    setIsSaving(true);
    try {
      await saveProfile({ grade, subject, region, topic });
      navigate("/lesson");
    } catch (e) {
      console.error("Failed to save profile:", e);
      setIsSaving(false);
    }
  };

  const steps = [
    {
      title: "What grade are you in?",
      description: "This helps us match the lesson difficulty to your level.",
      value: grade,
      onChange: setGrade,
      options: GRADES,
      placeholder: "Select your grade",
    },
    {
      title: "What subject do you want to learn?",
      description: "Pick the subject you'd like your companion to teach you.",
      value: subject,
      onChange: setSubject,
      options: SUBJECTS,
      placeholder: "Select a subject",
    },
    {
      title: "Where are you based?",
      description: "We'll tailor examples and content to be relevant to your region.",
      value: region,
      onChange: setRegion,
      options: REGIONS,
      placeholder: "Select your region",
    },
    {
      title: "What topic interests you?",
      description: `Choose a ${subject || "subject"} topic to start with.`,
      value: topic,
      onChange: setTopic,
      options: topics,
      placeholder: "Select a topic",
    },
  ];

  const currentStep = steps[step];
  const canProceed = !!currentStep?.value;

  if (character === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-grid">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      <FloatingShapes count={8} />
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ backgroundColor: `${themeColor}12` }}
        />
        <div className="absolute bottom-0 -right-40 h-[350px] w-[350px] rounded-full bg-purple-600/8 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-lg px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : navigate("/create-character"))}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all duration-250"
          >
            <ArrowLeft className="h-4 w-4" />
            {step > 0 ? "Back" : "Character"}
          </button>
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-muted-foreground">
              Brainly<span className="text-purple-400"> Weird</span>
            </span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="mb-10 flex justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-8 bg-purple-500"
                  : i < step
                    ? "w-2 bg-purple-400/60"
                    : "w-2 bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Mascot */}
        <motion.div
          key={`mascot-${step}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 flex justify-center"
        >
          <MascotCharacter color={themeColor} size={80} />
        </motion.div>

        {/* Step content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="clay-card-lg border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                {currentStep.title}
              </CardTitle>
              <CardDescription>
                {currentStep.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={currentStep.value}
                onValueChange={currentStep.onChange}
              >
                <SelectTrigger className="clay-input h-12 rounded-2xl text-base">
                  <SelectValue placeholder={currentStep.placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 rounded-2xl">
                  {currentStep.options.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-sm rounded-xl">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {currentStep.value && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="clay-card rounded-2xl p-3.5 text-center"
                >
                  <p className="text-xs text-muted-foreground">Selected:</p>
                  <p className="text-sm font-semibold text-foreground">
                    {currentStep.value}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="clay-primary rounded-2xl px-8 py-2.5 font-semibold disabled:opacity-30"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!canProceed || isSaving}
              className="clay-glow rounded-2xl px-8 py-2.5 font-semibold bg-purple-500 text-white hover:bg-purple-400 disabled:opacity-30"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Start Learning
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
