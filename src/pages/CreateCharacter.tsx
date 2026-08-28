import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useAction } from "convex/react";
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
  Crown,
} from "lucide-react";
import MascotCharacter from "@/components/MascotCharacter";
import FloatingShapes from "@/components/FloatingShapes";
import {
  type CharacterType,
  getAllCharacterTypes,
  getCharacterType,
} from "@/lib/character-types";

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

function CharacterPreview({
  name,
  description,
  characterType,
  isTalking,
}: {
  name: string;
  description: string;
  characterType: CharacterType | null;
  isTalking: boolean;
}) {
  const charDef = getCharacterType(characterType);

  return (
    <div className="flex flex-col items-center gap-5">
      <motion.div
        animate={
          isTalking
            ? { scale: [1, 1.08, 0.95, 1.06, 1], rotate: [0, -3, 3, -2, 0] }
            : { scale: [1, 1.02, 1], y: [0, -3, 0] }
        }
        transition={
          isTalking
            ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
        className="clay-card-lg flex items-center justify-center rounded-full p-1"
        style={{ backgroundColor: `${charDef.themeColor}20` }}
      >
        <MascotCharacter
          color={charDef.themeColor}
          size={170}
          isTalking={isTalking}
          characterType={characterType}
        />
      </motion.div>
      {name && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-lg font-bold text-foreground">{name}</p>
          {description && <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">{description}</p>}
        </motion.div>
      )}
    </div>
  );
}

export default function CreateCharacter() {
  const navigate = useNavigate();
  const existingCharacter = useQuery(api.characters.getCharacter);
  const saveCharacter = useMutation(api.characters.saveCharacter);
  const analyzeVoice = useAction(api.voice.analyzeAndSaveVoice);

  const [step, setStep] = useState(0);
  const [name, setName] = useState(existingCharacter?.name ?? "");
  const [description, setDescription] = useState(existingCharacter?.description ?? "");
  const [characterType, setCharacterType] = useState<CharacterType | null>(
    (existingCharacter?.characterType as CharacterType) ?? null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  const allCharacters = useMemo(() => getAllCharacterTypes(), []);

  const handleSave = async () => {
    if (!name.trim() || !description.trim()) return;
    setIsSaving(true);
    try {
      const charDef = getCharacterType(characterType);
      await saveCharacter({
        name: name.trim(),
        description: description.trim(),
        colorTheme: charDef.themeColor,
        characterType: characterType || undefined,
      });
      analyzeVoice().catch(() => {});
      navigate("/onboarding");
    } catch (e) {
      console.error("Failed to save character:", e);
      setIsSaving(false);
    }
  };

  const toggleTalking = () => setIsTalking((t) => !t);

  const steps = [
    {
      title: "Choose your companion",
      description: "Select a companion to guide you through your learning quest.",
      content: (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allCharacters.map((char) => (
            <button
              key={char.id}
              onClick={() => setCharacterType(char.id)}
              className={`group clay-btn flex flex-col items-center gap-3 rounded-2xl p-4 transition-all ${
                characterType === char.id
                  ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-background bg-amber-500/10"
                  : ""
              }`}
            >
              <div
                className="flex items-center justify-center rounded-full p-1 transition-transform duration-250 group-hover:scale-105"
                style={{ backgroundColor: `${char.themeColor}20` }}
              >
                <MascotCharacter characterType={char.id} size={80} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{char.name}</p>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{char.description}</p>
              </div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Describe your companion",
      description: "Add a personal touch to your chosen companion.",
      content: (
        <div className="space-y-4">
          {characterType && (
            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3">
              <MascotCharacter characterType={characterType} size={40} />
              <div>
                <p className="text-sm font-medium text-foreground">{getCharacterType(characterType).name}</p>
                <p className="text-xs text-muted-foreground">{getCharacterType(characterType).description}</p>
              </div>
            </div>
          )}
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="a wise old dragon who loves teaching math"
            className="clay-input min-h-[100px] resize-none text-base"
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground/60">{description.length}/200 characters</p>
        </div>
      ),
    },
    {
      title: "Name your companion",
      description: "Pick something memorable — this is the name your kingdom will know.",
      content: (
        <div className="space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={characterType ? getCharacterType(characterType).name : "Companion Name"}
            className="clay-input text-center text-lg font-semibold"
            maxLength={30}
          />
          <p className="text-center text-xs text-muted-foreground">{name.length}/30 characters</p>
        </div>
      ),
    },
    {
      title: "Meet your companion",
      description: "Looking noble and ready for adventure. Shall we begin?",
      content: null,
    },
  ];

  const currentStep = steps[step];
  const canProceed =
    (step === 0 && characterType !== null) ||
    (step === 1 && description.trim().length > 0) ||
    (step === 2 && name.trim().length > 0) ||
    step === 3;

  return (
    <div className="min-h-screen overflow-hidden bg-grid">
      <FloatingShapes count={8} />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px] bg-amber-600/6" />
        <div className="absolute bottom-1/4 -right-40 h-[400px] w-[400px] rounded-full bg-purple-600/6 blur-[100px]" />
        <div className="absolute top-1/3 -left-32 h-[300px] w-[300px] rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-lg px-6 py-8">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : navigate("/dashboard"))}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all duration-250"
          >
            <ArrowLeft className="h-4 w-4" />
            {step > 0 ? "Back" : "Kingdom"}
          </button>
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-muted-foreground">
              Quest<span className="text-amber-400">ly</span>
            </span>
          </div>
        </div>

        <div className="mb-10 flex justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-amber-500" : i < step ? "w-2 bg-amber-400/60" : "w-2 bg-white/10"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            {step < 3 ? (
              <Card className="clay-card-lg border-0">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{currentStep.title}</CardTitle>
                  <CardDescription>{currentStep.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(step === 1 || step === 2) && description.trim() && (
                    <div className="flex justify-center">
                      <div className="clay-card flex items-center gap-3 rounded-2xl px-4 py-3">
                        <MascotCharacter characterType={characterType} size={44} />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{name || "Your companion"}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
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
                  <CardTitle className="text-xl">{currentStep.title}</CardTitle>
                  <CardDescription>{currentStep.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <CharacterPreview name={name} description={description} characterType={characterType} isTalking={isTalking} />
                  <button
                    onClick={toggleTalking}
                    className="clay-btn mx-auto flex items-center gap-2 rounded-2xl bg-amber-500/15 px-4 py-2.5 text-sm font-medium text-amber-300 hover:bg-amber-500/25"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isTalking ? "Stop Preview" : "Preview Animation"}
                  </button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-center">
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed} className="clay-primary rounded-2xl px-8 py-2.5 font-semibold disabled:opacity-30">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={isSaving} className="clay-glow rounded-2xl px-8 py-2.5 font-semibold bg-amber-500 text-gray-900 hover:bg-amber-400">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              {existingCharacter ? "Update Companion" : "Begin Your Quest"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
