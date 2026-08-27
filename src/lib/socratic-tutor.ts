/**
 * Socratic Tutor Engine
 *
 * Never gives the direct answer immediately. Instead:
 * 1. Asks a guiding question to make the student think
 * 2. Gives a small hint if they're stuck
 * 3. Gives a bigger hint if still stuck
 * 4. Gives a strong hint as a last resort
 * 5. Only reveals the answer if the student is completely lost
 *
 * Tracks hints per question. Fewer hints = higher score via a difficulty
 * multiplier: score = BASE_POINTS * (1 + BONUS_PER_HINT * (MAX_HINTS - hintsUsed))
 */

export interface HintLevel {
  guidingQuestion: string;
  hint1: string;
  hint2: string;
  hint3: string;
  answer: string;
  keywords: string[];
}

export interface Question {
  id: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  hints: HintLevel;
  basePoints: number;
}

export interface SessionQuestion {
  question: Question;
  hintsUsed: number;
  hintLevel: 0 | 1 | 2 | 3 | 4; // 0=guiding, 1-3=hints, 4=answer revealed
  solved: boolean;
  pointsAwarded: number;
}

export interface TutorState {
  questions: Question[];
  currentIndex: number;
  sessionQuestions: SessionQuestion[];
  totalPoints: number;
  currentHintLevel: 0 | 1 | 2 | 3 | 4;
}

const MAX_HINT_LEVEL = 4;
const BONUS_PER_HINT = 0.5; // 50% more points per hint NOT used

export const QUESTIONS: Question[] = [
  {
    id: "water-cycle-1",
    subject: "Science",
    difficulty: "easy",
    question: "What process turns liquid water into water vapor that rises into the air?",
    hints: {
      guidingQuestion:
        "Think about what happens when you boil water on a stove. What do you see rising from the pot?",
      hint1:
        "It's the same process that happens when puddles disappear on a sunny day.",
      hint2:
        "The word starts with 'e' and is related to the word 'evaporate'.",
      hint3:
        "When the sun heats water and it escapes as gas into the atmosphere, that's called...",
      answer:
        "Evaporation! When the sun heats water in rivers, lakes, and oceans, it turns into water vapor and rises.",
      keywords: ["evaporation", "evaporate", "evaporating"],
    },
    basePoints: 100,
  },
  {
    id: "water-cycle-2",
    subject: "Science",
    difficulty: "medium",
    question: "What is it called when water vapor cools and forms tiny droplets in clouds?",
    hints: {
      guidingQuestion:
        "Have you ever noticed fog on a cold morning or water droplets on a cold glass? What's happening to the warm, moist air?",
      hint1:
        "This is the opposite of evaporation — water going from gas back to liquid.",
      hint2:
        "It's the same word used when your glasses fog up in winter. The prefix 'con-' means together.",
      hint3:
        "Water droplets forming together around dust particles in the atmosphere is called...",
      answer:
        "Condensation! Water vapor cools and forms tiny droplets, creating clouds.",
      keywords: ["condensation", "condense", "condensing"],
    },
    basePoints: 150,
  },
  {
    id: "water-cycle-3",
    subject: "Science",
    difficulty: "easy",
    question: "What is it called when water falls from clouds back to Earth as rain or snow?",
    hints: {
      guidingQuestion:
        "When clouds get heavy and can't hold all the water anymore, what happens?",
      hint1:
        "Think of the root word 'precipitate' — to fall or drop from above.",
      hint2:
        "Rain, snow, sleet, and hail all fall under one scientific category.",
      hint3:
        "The process of water falling from the atmosphere to the ground is called...",
      answer:
        "Precipitation! This includes rain, snow, sleet, and hail.",
      keywords: ["precipitation", "precipitate"],
    },
    basePoints: 100,
  },
  {
    id: "pythagoras-1",
    subject: "Math",
    difficulty: "medium",
    question:
      "In a right triangle, if one leg is 3 and the other is 4, what is the hypotenuse?",
    hints: {
      guidingQuestion:
        "Do you know a theorem that relates the three sides of a right triangle? It's named after a Greek mathematician.",
      hint1:
        "The formula is a² + b² = c², where c is the hypotenuse.",
      hint2:
        "Plug in the values: 3² + 4² = c². What's 9 + 16?",
      hint3:
        "c² = 25, so c is the square root of 25...",
      answer:
        "The hypotenuse is 5! Since 3² + 4² = 9 + 16 = 25, and √25 = 5.",
      keywords: ["5", "five"],
    },
    basePoints: 150,
  },
  {
    id: "pythagoras-2",
    subject: "Math",
    difficulty: "hard",
    question:
      "If a right triangle has a hypotenuse of 13 and one leg of 5, what is the other leg?",
    hints: {
      guidingQuestion:
        "We know c² = a² + b². If we know c and a, how could we find b?",
      hint1:
        "Rearrange the formula: b² = c² - a². What's 13² - 5²?",
      hint2:
        "13² = 169 and 5² = 25. So b² = 169 - 25 = ...",
      hint3:
        "b² = 144, and √144 = ...",
      answer:
        "The other leg is 12! Since 13² - 5² = 169 - 25 = 144, and √144 = 12.",
      keywords: ["12", "twelve"],
    },
    basePoints: 200,
  },
  {
    id: "photosynthesis-1",
    subject: "Science",
    difficulty: "medium",
    question:
      "What gas do plants absorb from the air during photosynthesis?",
    hints: {
      guidingQuestion:
        "Plants take in something from the air and use sunlight to turn it into food. What's the main gas we exhale that plants need?",
      hint1:
        "It's the gas that makes soda fizzy, and it's also what we breathe out.",
      hint2:
        "Its chemical formula is CO₂.",
      hint3:
        "Plants absorb carbon...",
      answer:
        "Carbon dioxide (CO₂)! Plants use CO₂, water, and sunlight to make glucose and oxygen.",
      keywords: ["carbon dioxide", "co2", "c02"],
    },
    basePoints: 150,
  },
  {
    id: "photosynthesis-2",
    subject: "Science",
    difficulty: "hard",
    question:
      "What is the overall chemical equation for photosynthesis? (What are the inputs and outputs?)",
    hints: {
      guidingQuestion:
        "Think about what a plant needs (inputs) and what it produces (outputs). You already know some of these from our last question.",
      hint1:
        "The inputs are: CO₂ + H₂O + light energy. The outputs are glucose (C₆H₁₂O₆) + a gas we breathe in.",
      hint2:
        "The gas plants release that we need to survive is oxygen (O₂).",
      hint3:
        "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
      answer:
        "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Six molecules of carbon dioxide plus six molecules of water, powered by light, produce one glucose molecule and six oxygen molecules.",
      keywords: ["6co2", "6h2o", "c6h12o6", "6o2", "glucose", "oxygen"],
    },
    basePoints: 250,
  },
  {
    id: "python-1",
    subject: "Programming",
    difficulty: "easy",
    question:
      "In Python, what keyword do you use to create a variable that stores the number 42?",
    hints: {
      guidingQuestion:
        "In Python, you don't need to declare a type. You just write the name, an equals sign, and the value. What might that look like?",
      hint1:
        "It's just: variable_name = 42. Python figures out the type automatically.",
      hint2:
        "A common variable name for this example might be 'x' or 'answer'.",
      hint3:
        "Try: answer = 42",
      answer:
        "answer = 42 (or any valid variable name followed by = 42). Python is dynamically typed, so no declaration needed!",
      keywords: ["=", "answer", "variable"],
    },
    basePoints: 100,
  },
  {
    id: "python-2",
    subject: "Programming",
    difficulty: "medium",
    question:
      "In Python, what does the `len()` function do? Give an example.",
    hints: {
      guidingQuestion:
        "Think about what 'len' might be short for. What's a common three-letter word it abbreviates?",
      hint1:
        "len is short for 'length'. It works on strings, lists, and other collections.",
      hint2:
        "len('hello') would return... how many characters are in 'hello'?",
      hint3:
        "len('hello') returns 5, because there are 5 characters.",
      answer:
        "len() returns the length of a string, list, or collection. For example, len('hello') returns 5, and len([1, 2, 3]) returns 3.",
      keywords: ["length", "len", "5", "characters", "count"],
    },
    basePoints: 150,
  },
  {
    id: "history-1",
    subject: "History",
    difficulty: "easy",
    question:
      "The Silk Road was a famous trade route. Which two regions of the world did it primarily connect?",
    hints: {
      guidingQuestion:
        "The name 'Silk Road' gives a clue — silk was a famous product of which ancient civilization?",
      hint1:
        "Silk was one of China's most valuable exports. So one end of the route was in East Asia.",
      hint2:
        "The route went westward through Central Asia toward the Mediterranean and Europe.",
      hint3:
        "It connected East Asia (China) with...",
      answer:
        "The Silk Road connected East Asia (primarily China) with Europe and the Mediterranean. It stretched over 4,000 miles!",
      keywords: ["east", "west", "china", "europe", "asia", "mediterranean"],
    },
    basePoints: 100,
  },
];

/**
 * Calculate the score for a question based on hints used.
 * Fewer hints = higher multiplier.
 */
export function calculateScore(
  basePoints: number,
  hintsUsed: number,
  maxHints: number = MAX_HINT_LEVEL
): number {
  const multiplier = 1 + BONUS_PER_HINT * (maxHints - hintsUsed);
  return Math.round(basePoints * multiplier);
}

/**
 * Get the hint text for a given level.
 */
export function getHintText(
  question: Question,
  level: 0 | 1 | 2 | 3 | 4
): string {
  switch (level) {
    case 0:
      return question.hints.guidingQuestion;
    case 1:
      return question.hints.hint1;
    case 2:
      return question.hints.hint2;
    case 3:
      return question.hints.hint3;
    case 4:
      return question.hints.answer;
  }
}

/**
 * Check if a student's answer is correct (keyword match).
 */
export function checkAnswer(question: Question, studentInput: string): boolean {
  const normalized = studentInput.toLowerCase().trim();
  return question.hints.keywords.some(
    (kw) => normalized.includes(kw.toLowerCase())
  );
}

/**
 * Detect if the student is trying to shortcut to the answer
 * (asking for the answer directly, saying "just tell me", etc.)
 */
export function isShortcutAttempt(input: string): boolean {
  const normalized = input.toLowerCase().trim();
  const shortcuts = [
    "just tell me",
    "give me the answer",
    "what is the answer",
    "what's the answer",
    "just answer",
    "tell me the answer",
    "i don't know",
    "idk",
    "skip",
    "next question",
    "give up",
    "i give up",
    "show me the answer",
    "reveal answer",
    "what is it",
    "just say",
  ];
  return shortcuts.some((s) => normalized.includes(s));
}

/**
 * Determine what the tutor should say next based on student input and hint level.
 */
export function getTutorResponse(
  question: Question,
  studentInput: string,
  currentHintLevel: 0 | 1 | 2 | 3 | 4
): {
  response: string;
  newHintLevel: 0 | 1 | 2 | 3 | 4;
  isCorrect: boolean;
  isRevealed: boolean;
} {
  // Check if the student's answer is correct at any hint level
  if (checkAnswer(question, studentInput)) {
    return {
      response: "🎉 That's correct! Great job thinking it through.",
      newHintLevel: currentHintLevel,
      isCorrect: true,
      isRevealed: currentHintLevel === 4,
    };
  }

  // If the answer is already fully revealed, acknowledge the attempt
  if (currentHintLevel >= 4) {
    return {
      response: `The answer was: ${question.hints.answer}. Don't worry — you'll get the next one!`,
      newHintLevel: 4,
      isCorrect: false,
      isRevealed: true,
    };
  }

  // If student is trying to shortcut, give a smaller hint than they're due
  if (isShortcutAttempt(studentInput)) {
    const shortcutHint = Math.min(currentHintLevel, 1) as 0 | 1;
    const hint = getHintText(question, shortcutHint);
    return {
      response: `Let's not skip ahead! Here's a nudge: ${hint}`,
      newHintLevel: currentHintLevel,
      isCorrect: false,
      isRevealed: false,
    };
  }

  // Student is genuinely stuck — escalate to the next hint level
  const nextLevel = Math.min(currentHintLevel + 1, 4) as 0 | 1 | 2 | 3 | 4;
  const hint = getHintText(question, nextLevel);

  if (nextLevel === 4) {
    return {
      response: `No worries! Here's the answer: ${hint}`,
      newHintLevel: 4,
      isCorrect: false,
      isRevealed: true,
    };
  }

  const encouragements = [
    "Hmm, not quite. Let me help you think about this differently.",
    "Good attempt! Let me give you a nudge in the right direction.",
    "Not this time. Here's something to consider:",
    "Close, but not quite. Let me point you toward the answer:",
  ];
  const encouragement =
    encouragements[Math.floor(Math.random() * encouragements.length)];

  return {
    response: `${encouragement}\n\n${hint}`,
    newHintLevel: nextLevel,
    isCorrect: false,
    isRevealed: false,
  };
}

/**
 * Create a new tutor session with shuffled questions.
 */
export function createSession(
  count: number = 5
): TutorState {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return {
    questions: selected,
    currentIndex: 0,
    sessionQuestions: selected.map((q) => ({
      question: q,
      hintsUsed: 0,
      hintLevel: 0,
      solved: false,
      pointsAwarded: 0,
    })),
    totalPoints: 0,
    currentHintLevel: 0,
  };
}
