// ============================================================================
// QUIZ QUESTIONS
// ============================================================================

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  subject: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "What process turns liquid water into vapor that rises into the air?",
    options: ["Condensation", "Evaporation", "Precipitation", "Freezing"],
    correctIndex: 1,
    subject: "Science",
  },
  {
    id: "q2",
    question: "What is 3² + 4²?",
    options: ["12", "25", "7", "49"],
    correctIndex: 1,
    subject: "Math",
  },
  {
    id: "q3",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    correctIndex: 2,
    subject: "Science",
  },
  {
    id: "q4",
    question: "What is the main gas plants absorb during photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctIndex: 2,
    subject: "Science",
  },
  {
    id: "q5",
    question: "The Great Wall was built primarily to protect against invasions from which direction?",
    options: ["South", "East", "North", "West"],
    correctIndex: 2,
    subject: "History",
  },
  {
    id: "q6",
    question: "What is the square root of 144?",
    options: ["11", "12", "13", "14"],
    correctIndex: 1,
    subject: "Math",
  },
  {
    id: "q7",
    question: "Which ancient civilization built the pyramids at Giza?",
    options: ["Romans", "Greeks", "Egyptians", "Mesopotamians"],
    correctIndex: 2,
    subject: "History",
  },
  {
    id: "q8",
    question: "In Python, what does `len()` return for the string 'hello'?",
    options: ["4", "5", "6", "Error"],
    correctIndex: 1,
    subject: "Programming",
  },
  {
    id: "q9",
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctIndex: 3,
    subject: "General Knowledge",
  },
  {
    id: "q10",
    question: "Which of these is NOT a state of matter?",
    options: ["Solid", "Liquid", "Plasma", "Energy"],
    correctIndex: 3,
    subject: "Science",
  },
  {
    id: "q11",
    question: "What does 'adjective' mean in grammar?",
    options: [
      "A word that shows action",
      "A word that describes a noun",
      "A word that connects sentences",
      "A word that replaces a noun",
    ],
    correctIndex: 1,
    subject: "English",
  },
  {
    id: "q12",
    question: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
    subject: "General Knowledge",
  },
  {
    id: "q13",
    question: "What is the formula for the area of a circle?",
    options: ["2πr", "πr²", "πd", "2πr²"],
    correctIndex: 1,
    subject: "Math",
  },
  {
    id: "q14",
    question: "Which scientist proposed the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Galileo"],
    correctIndex: 1,
    subject: "Science",
  },
  {
    id: "q15",
    question: "What year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctIndex: 2,
    subject: "History",
  },
];

/**
 * Pick N random questions from the bank.
 */
export function pickQuestions(count: number): QuizQuestion[] {
  const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Score a set of answers against the question set.
 */
export function scoreAnswers(
  questionIds: string[],
  answers: number[]
): { correct: number; total: number; stars: number } {
  let correct = 0;
  questionIds.forEach((qid, i) => {
    const q = QUIZ_QUESTIONS.find((q) => q.id === qid);
    if (q && answers[i] === q.correctIndex) {
      correct++;
    }
  });
  const total = questionIds.length;
  // Stars: 3 for perfect, 2 for 60%+, 1 for 40%+
  const ratio = total > 0 ? correct / total : 0;
  const stars = ratio >= 1 ? 3 : ratio >= 0.6 ? 2 : ratio >= 0.4 ? 1 : 0;
  return { correct, total, stars };
}

// ============================================================================
// GAMIFICATION DATA
// ============================================================================

export interface Accessory {
  id: string;
  name: string;
  icon: string;
  cost: number; // star milestone to unlock
}

export const ACCESSORIES: Accessory[] = [
  { id: "hat-party", name: "Party Hat", icon: "🎉", cost: 50 },
  { id: "glasses-smart", name: "Smart Glasses", icon: "🤓", cost: 100 },
  { id: "crown", name: "Royal Crown", icon: "👑", cost: 200 },
  { id: "headphones", name: "DJ Headphones", icon: "🎧", cost: 150 },
  { id: "scarf", name: "Cozy Scarf", icon: "🧣", cost: 75 },
  { id: "bowtie", name: "Fancy Bowtie", icon: "🎀", cost: 120 },
  { id: "cap", name: "Baseball Cap", icon: "🧢", cost: 30 },
  { id: "flower", name: "Flower Crown", icon: "🌸", cost: 250 },
];

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-lesson",
    name: "First Lesson",
    description: "Completed your first lesson",
    icon: "📚",
  },
  {
    id: "quiz-passed",
    name: "Quiz Passed",
    description: "Passed a checkpoint quiz",
    icon: "✅",
  },
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Got 100% on a quiz",
    icon: "💯",
  },
  {
    id: "streak-3",
    name: "3-Day Streak",
    description: "Active for 3 days in a row",
    icon: "🔥",
  },
  {
    id: "streak-7",
    name: "7-Day Streak",
    description: "Active for a full week",
    icon: "⚡",
  },
  {
    id: "beat-friend",
    name: "Beat a Friend",
    description: "Won a head-to-head quiz",
    icon: "🏆",
  },
  {
    id: "star-50",
    name: "Star Collector",
    description: "Earned 50 stars",
    icon: "⭐",
  },
  {
    id: "star-100",
    name: "Star Master",
    description: "Earned 100 stars",
    icon: "🌟",
  },
];

/**
 * Check which achievements a character has earned based on their data.
 */
export function checkAchievements(data: {
  totalStars: number;
  streak: number;
  hasPassedQuiz: boolean;
  hasPerfectScore: boolean;
  hasWonFriend: boolean;
  hasCompletedLesson: boolean;
}): string[] {
  const earned: string[] = [];
  if (data.hasCompletedLesson) earned.push("first-lesson");
  if (data.hasPassedQuiz) earned.push("quiz-passed");
  if (data.hasPerfectScore) earned.push("perfect-score");
  if (data.streak >= 3) earned.push("streak-3");
  if (data.streak >= 7) earned.push("streak-7");
  if (data.hasWonFriend) earned.push("beat-friend");
  if (data.totalStars >= 50) earned.push("star-50");
  if (data.totalStars >= 100) earned.push("star-100");
  return earned;
}

/**
 * Check which accessories are unlocked based on star count.
 */
export function getUnlockedAccessories(totalStars: number): string[] {
  return ACCESSORIES.filter((a) => totalStars >= a.cost).map((a) => a.id);
}
