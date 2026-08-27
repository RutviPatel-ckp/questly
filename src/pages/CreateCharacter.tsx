import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Terminal,
} from "lucide-react";

const COLOR_THEMES = [
  { name: "Sunset", bg: "bg-orange-400", ring: "ring-orange-300", hex: "#fb923c" },
  { name: "Ocean", bg: "bg-sky-400", ring: "ring-sky-300", hex: "#38bdf8" },
  { name: "Forest", bg: "bg-emerald-400", ring: "ring-emerald-300", hex: "#34d399" },
  { name: "Lavender", bg: "bg-purple-400", ring: "ring-purple-300", hex: "#c084fc" },
  { name: "Berry", bg: "bg-pink-400", ring: "ring-pink-300", hex: "#f472b6" },
  { name: "Honey", bg: "bg-amber-400", ring: "ring-amber-300", hex: "#fbbf24" },
  { name: "Mint", bg: "bg-teal-400", ring: "ring-teal-300", hex: "#2dd4bf" },
  { name: "Coral", bg: "bg-rose-400", ring: "ring-rose-300", hex: "#fb7185" },
];

const SUGGESTIONS = [
  "a sarcastic mango who loves basketball",
  "a wise old owl who tells dad jokes",
  "a shy robot that paints watercolors",
  "a brave toaster who surfs the internet",
  "a magical pencil that knows every subject",
];

function CharacterPreview({
  name,
  description,
  colorTheme,
  isTalking,
}: {
  name: string;
  description: string;
  colorTheme: string;
  isTalking: boolean;
}) {
  const themeColor = COLOR_THEMES.find((t) => t.name === colorTheme)?.hex || "#c084fc";

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={
          isTalking
            ? {
                scale: [1, 1.05, 0.98, 1.03, 1],
                rotate: [0, -2, 2, -1, 0],
              }
            : { scale: 1, rotate: 0 }
        }
        transition={
          isTalking
            ? { duration: 0.4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
        className="clay-card-lg flex h-32 w-32 items-center justify-center rounded-full"
        style={{ backgroundColor: `${themeColor}20` }}
      >
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full"
          style={{ backgroundColor: `${themeColor}35` }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-3xl font-bold text-white shadow-lg"
            style={{ backgroundColor: themeColor }}
          >
            {name ? name[0].toUpperCase() : "?"}
          </div>
        </div>
      </motion.div>
      {name && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-lg font-bold text-foreground">{name}</p>
          {description && (
            <p className="mt-1 max-w-[200px] text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function CreateCharacter() {
  const navigate = useNavigate();
  const existingCharacter = useQuery(api.characters.getCharacter);
  const saveCharacter = useMutation(api.characters.saveCharacter);

  const [step, setStep] = useState(0);
  const [name, setName] = useState(existingCharacter?.name ?? "");
  const [description, setDescription] = useState(
    existingCharacter?.description ?? ""
  );
  const [colorTheme, setColorTheme] = useState(
    existingCharacter?.colorTheme ?? "Lavender"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  const preview = useMemo(
    () => ({ name, description, colorTheme }),
    [name, description, colorTheme]
  );

  const handleSave = async () => {
    if (!name.trim() || !description.trim()) return;
    setIsSaving(true);
    try {
      await saveCharacter({
        name: name.trim(),
        description: description.trim(),
        colorTheme,
      });
      navigate("/lesson");
    } catch (e) {
      console.error("Failed to save character:", e);
      setIsSaving(false);
    }
  };

  const toggleTalking = () => setIsTalking((t) => !t);

  const steps = [
    {
      title: "Describe your companion",
      description: "What should your study buddy be like? A few words go a long way.",
      content: (
        <div className="space-y-4">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="a sarcastic mango who loves basketball"
            className="clay-input min-h-[100px] resize-none text-base"
            maxLength={200}
          />
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setDescription(s)}
                className="clay-card rounded-xl px-3 py-1.5 text-xs text-muted-foreground transition-all hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Name your companion",
      description: "Pick something memorable — this is the name your team will see.",
      content: (
        <div className="space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Captain Mango"
            className="clay-input text-center text-lg font-semibold"
            maxLength={30}
          />
          <p className="text-center text-xs text-muted-foreground">
            {name.length}/30 characters
          </p>
        </div>
      ),
    },
    {
      title: "Choose a color",
      description: "This sets the visual theme for your companion throughout the platform.",
      content: (
        <div className="grid grid-cols-4 gap-3">
          {COLOR_THEMES.map((theme) => (
            <button
              key={theme.name}
              onClick={() => setColorTheme(theme.name)}
              className={`group clay-btn flex flex-col items-center gap-2 rounded-2xl p-3 transition-all ${
                colorTheme === theme.name
                  ? `ring-2 ${theme.ring} ring-offset-2 ring-offset-background`
                  : ""
              }`}
            >
              <div
                className={`h-10 w-10 rounded-xl ${theme.bg} transition-transform group-hover:scale-110`}
              />
              <span className="text-xs font-medium text-muted-foreground">
                {theme.name}
              </span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Meet your companion",
      description: "Looking good. Ready to start learning?",
      content: null,
    },
  ];

  const currentStep = steps[step];
  const canProceed =
    (step === 0 && description.trim().length > 0) ||
    (step === 1 && name.trim().length > 0) ||
    step === 2 ||
    step === 3;

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/8 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-lg px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : navigate("/dashboard"))}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {step > 0 ? "Back" : "Dashboard"}
          </button>
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-muted-foreground">
              Brainly<span className="text-purple-400"> Weird</span>
            </span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="mb-8 flex justify-center gap-2">
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

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step < 3 ? (
              <Card className="clay-card-lg border-0">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">
                    {currentStep.title}
                  </CardTitle>
                  <CardDescription>
                    {currentStep.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mini preview on steps 1 and 2 */}
                  {(step === 1 || step === 2) && description.trim() && (
                    <div className="flex justify-center">
                      <div className="clay-card flex items-center gap-3 rounded-2xl px-4 py-3">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{
                            backgroundColor:
                              COLOR_THEMES.find((t) => t.name === colorTheme)
                                ?.hex || "#c084fc",
                          }}
                        >
                          {name ? name[0].toUpperCase() : "?"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {name || "Your companion"}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep.content}
                </CardContent>
              </Card>
            ) : (
              <Card className="clay-card-lg border-0">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">
                    {currentStep.title}
                  </CardTitle>
                  <CardDescription>
                    {currentStep.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <CharacterPreview
                    name={name}
                    description={description}
                    colorTheme={colorTheme}
                    isTalking={isTalking}
                  />
                  <button
                    onClick={toggleTalking}
                    className="clay-btn mx-auto flex items-center gap-2 rounded-xl bg-purple-500/15 px-4 py-2 text-sm font-medium text-purple-300 hover:bg-purple-500/25"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isTalking ? "Stop Preview" : "Preview Animation"}
                  </button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex justify-center">
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="clay-btn rounded-xl bg-purple-500 px-8 py-2.5 font-semibold text-white hover:bg-purple-400 disabled:opacity-30"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="clay-glow rounded-xl bg-purple-500 px-8 py-2.5 font-semibold text-white hover:bg-purple-400"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              {existingCharacter ? "Update Companion" : "Start Learning"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
