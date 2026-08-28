export const GRADES = [
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

export const SUBJECTS = [
  "Math",
  "Science",
  "History",
  "English",
  "General Knowledge",
  "Computer Science",
];

// ============================================================================
// SUBJECT REALM CONFIGURATION
// ============================================================================

export interface SubjectRealm {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  gradient: string;
}

export const SUBJECT_REALMS: Record<string, SubjectRealm> = {
  Math: {
    id: "math",
    name: "Math",
    icon: "🔢",
    color: "oklch(0.60 0.15 275)",
    bgColor: "oklch(0.92 0.06 275)",
    description: "Numbers, patterns, and the language of the universe",
    gradient: "from-purple-200 to-indigo-100",
  },
  Science: {
    id: "science",
    name: "Science",
    icon: "🔬",
    color: "oklch(0.55 0.14 140)",
    bgColor: "oklch(0.92 0.06 140)",
    description: "Explore the natural world through experiments and discovery",
    gradient: "from-emerald-200 to-teal-100",
  },
  History: {
    id: "history",
    name: "History",
    icon: "📜",
    color: "oklch(0.60 0.14 60)",
    bgColor: "oklch(0.93 0.05 60)",
    description: "Journey through time and discover the stories of civilizations",
    gradient: "from-amber-200 to-orange-100",
  },
  English: {
    id: "english",
    name: "English",
    icon: "📖",
    color: "oklch(0.58 0.16 25)",
    bgColor: "oklch(0.93 0.05 25)",
    description: "Master the art of words, stories, and expression",
    gradient: "from-rose-200 to-pink-100",
  },
  "General Knowledge": {
    id: "gk",
    name: "General Knowledge",
    icon: "🌍",
    color: "oklch(0.60 0.12 190)",
    bgColor: "oklch(0.92 0.05 190)",
    description: "A grand tour of facts, cultures, and the world around you",
    gradient: "from-cyan-200 to-sky-100",
  },
  "Computer Science": {
    id: "cs",
    name: "Computer Science",
    icon: "💻",
    color: "oklch(0.55 0.15 220)",
    bgColor: "oklch(0.92 0.06 220)",
    description: "Learn coding, algorithms, and how computers think",
    gradient: "from-blue-200 to-violet-100",
  },
};

export const REGIONS = [
  "Tanzania",
  "United Arab Emirates",
  "Kenya",
  "India",
  "United States",
  "United Kingdom",
  "Nigeria",
  "Other (General/Global)",
];

export const TOPICS_BY_SUBJECT: Record<string, string[]> = {
  Math: [
    "Integers and Number Lines",
    "Fractions and Decimals",
    "Algebraic Expressions",
    "Geometry and Angles",
    "Data and Probability",
  ],
  Science: [
    "The Water Cycle",
    "States of Matter",
    "The Solar System",
    "Photosynthesis",
    "Simple Machines",
  ],
  History: [
    "Ancient Civilizations",
    "Independence Movements",
    "Explorers and Trade Routes",
    "World War II Basics",
    "Local and Regional History",
  ],
  English: [
    "Parts of Speech",
    "Reading Comprehension",
    "Creative Writing Basics",
    "Figurative Language",
    "Essay Structure",
  ],
  "Computer Science": [
    "What Is a Computer?",
    "Introduction to Coding",
    "How the Internet Works",
    "Data and Binary",
    "Algorithms and Logic",
  ],
  "General Knowledge": [
    "World Geography",
    "Current Events Awareness",
    "Famous Inventors and Inventions",
    "Environmental Issues",
    "Cultural Traditions Around the World",
  ],
};

// ============================================================================
// MULTI-PART LESSON STRUCTURE (Chapters within Kingdoms)
// ============================================================================

export const PARTS_PER_TOPIC = 4;

export const PART_TITLES: Record<string, Record<string, string[]>> = {
  Science: {
    "The Water Cycle": ["Chapter 1: Where Does Water Come From?", "Chapter 2: How Water Travels", "Chapter 3: Why the Water Cycle Matters", "Chapter 4: Water Cycle Fun Facts"],
    "States of Matter": ["Chapter 1: Solids, Liquids, and Gases", "Chapter 2: How Matter Changes State", "Chapter 3: Why States of Matter Matter", "Chapter 4: Matter Fun Facts"],
    "The Solar System": ["Chapter 1: Meet the Planets", "Chapter 2: The Sun and Inner Planets", "Chapter 3: Outer Planets and Moons", "Chapter 4: Space Fun Facts"],
    Photosynthesis: ["Chapter 1: How Plants Make Food", "Chapter 2: Sunlight, Water, and CO2", "Chapter 3: Why Photosynthesis Matters", "Chapter 4: Plant Science Fun Facts"],
    "Simple Machines": ["Chapter 1: What Are Simple Machines?", "Chapter 2: Levers, Pulleys, and Wheels", "Chapter 3: Machines in Everyday Life", "Chapter 4: Simple Machines Fun Facts"],
  },
  Math: {
    "Integers and Number Lines": ["Chapter 1: Positive and Negative Numbers", "Chapter 2: Working with Number Lines", "Chapter 3: Adding and Subtracting Integers", "Chapter 4: Integer Fun Facts"],
    "Fractions and Decimals": ["Chapter 1: What Are Fractions?", "Chapter 2: Converting Between Fractions and Decimals", "Chapter 3: Adding, Subtracting, and Comparing", "Chapter 4: Fraction Fun Facts"],
    "Algebraic Expressions": ["Chapter 1: Variables and Constants", "Chapter 2: Writing Expressions", "Chapter 3: Simplifying Expressions", "Chapter 4: Algebra Fun Facts"],
    "Geometry and Angles": ["Chapter 1: Shapes and Their Properties", "Chapter 2: Understanding Angles", "Chapter 3: Area and Perimeter", "Chapter 4: Geometry Fun Facts"],
    "Data and Probability": ["Chapter 1: Reading Charts and Graphs", "Chapter 2: Mean, Median, and Mode", "Chapter 3: Basics of Probability", "Chapter 4: Data Fun Facts"],
  },
  History: {
    "Ancient Civilizations": ["Chapter 1: Early Human Societies", "Chapter 2: Egypt, Mesopotamia, and China", "Chapter 3: Greece and Rome", "Chapter 4: Ancient World Fun Facts"],
    "Independence Movements": ["Chapter 1: What Drives Independence?", "Chapter 2: Famous Leaders and Movements", "Chapter 3: Independence in Africa and Asia", "Chapter 4: Freedom Fun Facts"],
    "Explorers and Trade Routes": ["Chapter 1: The Age of Exploration", "Chapter 2: Silk Road and Spice Trade", "Chapter 3: Maritime Explorers", "Chapter 4: Exploration Fun Facts"],
    "World War II Basics": ["Chapter 1: What Caused the War?", "Chapter 2: Key Events and Battles", "Chapter 3: The Home Front", "Chapter 4: WWII Fun Facts"],
    "Local and Regional History": ["Chapter 1: Your Region's Ancient Past", "Chapter 2: Colonial Era and Change", "Chapter 3: Modern History and Independence", "Chapter 4: Local History Fun Facts"],
  },
  English: {
    "Parts of Speech": ["Chapter 1: Nouns and Verbs", "Chapter 2: Adjectives and Adverbs", "Chapter 3: Pronouns, Prepositions, and Conjunctions", "Chapter 4: Parts of Speech Fun Facts"],
    "Reading Comprehension": ["Chapter 1: What Is Reading Comprehension?", "Chapter 2: Finding the Main Idea", "Chapter 3: Making Inferences", "Chapter 4: Reading Fun Facts"],
    "Creative Writing Basics": ["Chapter 1: Story Structure", "Chapter 2: Character and Dialogue", "Chapter 3: Show, Don't Tell", "Chapter 4: Writing Fun Facts"],
    "Figurative Language": ["Chapter 1: Similes and Metaphors", "Chapter 2: Personification and Hyperbole", "Chapter 3: Idioms and Allusions", "Chapter 4: Figurative Language Fun Facts"],
    "Essay Structure": ["Chapter 1: Introduction Paragraphs", "Chapter 2: Body Paragraphs and Evidence", "Chapter 3: Conclusions That Stick", "Chapter 4: Essay Writing Fun Facts"],
  },
  "General Knowledge": {
    "World Geography": ["Chapter 1: Continents and Oceans", "Chapter 2: Mountains, Rivers, and Deserts", "Chapter 3: Climate and Biomes", "Chapter 4: Geography Fun Facts"],
    "Current Events Awareness": ["Chapter 1: How to Follow the News", "Chapter 2: Understanding Headlines", "Chapter 3: Media Literacy Basics", "Chapter 4: News Fun Facts"],
    "Famous Inventors and Inventions": ["Chapter 1: Pioneers of Invention", "Chapter 2: Inventions That Changed the World", "Chapter 3: Modern Innovation", "Chapter 4: Invention Fun Facts"],
    "Environmental Issues": ["Chapter 1: Climate Change Basics", "Chapter 2: Pollution and Conservation", "Chapter 3: What Can We Do?", "Chapter 4: Environment Fun Facts"],
    "Cultural Traditions Around the World": ["Chapter 1: Festivals and Celebrations", "Chapter 2: Food and Customs", "Chapter 3: Art, Music, and Storytelling", "Chapter 4: Culture Fun Facts"],
  },
};

export function getPartTitle(subject: string, topic: string, part: number): string {
  const topicParts = PART_TITLES[subject]?.[topic];
  if (topicParts && topicParts[part - 1]) return topicParts[part - 1];
  return `Chapter ${part}: ${topic}`;
}

// ============================================================================
// INLINE TEST QUESTIONS
// ============================================================================

export interface InlineTestQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
}

export const INLINE_TEST_BANK: Record<string, InlineTestQuestion[][]> = {
  "The Water Cycle": [
    [
      { question: "What is the process called when water turns into vapor?", options: ["Condensation", "Evaporation", "Freezing", "Precipitation"], correctIndex: 1 },
      { question: "What falls from clouds back to Earth?", options: ["Snow only", "Precipitation", "Wind", "Sunlight"], correctIndex: 1 },
      { question: "Where does most of Earth's water cycle begin?", options: ["Underground", "Oceans and lakes", "Clouds", "Mountains"], correctIndex: 1 },
    ],
    [
      { question: "What carries water vapor upward into the atmosphere?", options: ["Wind", "Gravity", "Heat and rising air", "Moonlight"], correctIndex: 2 },
      { question: "When water vapor cools and forms droplets, it's called...", options: ["Evaporation", "Condensation", "Boiling", "Melting"], correctIndex: 1 },
      { question: "Streams and rivers carry water toward...", options: ["The sky", "Mountains", "Oceans and lakes", "Deserts"], correctIndex: 2 },
    ],
    [
      { question: "Why is the water cycle important for life on Earth?", options: ["It makes waves", "It distributes fresh water", "It creates wind", "It makes planets spin"], correctIndex: 1 },
      { question: "Plants play a role in the water cycle by...", options: ["Blocking rain", "Releasing water through transpiration", "Freezing water", "Creating clouds"], correctIndex: 1 },
      { question: "What would happen without the water cycle?", options: ["Nothing changes", "All water would stay in one place", "The Earth would spin faster", "Stars would disappear"], correctIndex: 1 },
    ],
    [
      { question: "How old is the water on Earth?", options: ["About 1,000 years", "About 1 million years", "About 4.5 billion years", "About 100 years"], correctIndex: 2 },
      { question: "Which planet has evidence of a water cycle?", options: ["Mars", "Jupiter", "Venus", "Mercury"], correctIndex: 0 },
      { question: "What percentage of Earth's water is saltwater?", options: ["About 50%", "About 70%", "About 97%", "About 10%"], correctIndex: 2 },
    ],
  ],
  "States of Matter": [
    [
      { question: "What are the three main states of matter?", options: ["Hot, cold, warm", "Solid, liquid, gas", "Big, small, tiny", "Fast, slow, stopped"], correctIndex: 1 },
      { question: "Which state of matter has a fixed shape?", options: ["Liquid", "Gas", "Solid", "Plasma"], correctIndex: 2 },
      { question: "Water in a glass is an example of which state?", options: ["Solid", "Liquid", "Gas", "Plasma"], correctIndex: 1 },
    ],
    [
      { question: "When ice melts, it changes from solid to...", options: ["Gas", "Liquid", "Plasma", "Stays solid"], correctIndex: 1 },
      { question: "What is it called when a liquid becomes a gas?", options: ["Freezing", "Melting", "Boiling/Evaporation", "Condensation"], correctIndex: 2 },
      { question: "Steam rising from boiling water is...", options: ["Solid water", "Liquid water", "Gas (water vapor)", "Plasma"], correctIndex: 2 },
    ],
    [
      { question: "Why do we need to understand states of matter?", options: ["For fun only", "It helps in cooking, science, and daily life", "It's not important", "Only scientists need it"], correctIndex: 1 },
      { question: "Which state takes the shape of its container?", options: ["Solid", "Liquid", "Both liquid and gas", "Neither"], correctIndex: 2 },
      { question: "What happens to particles when matter is heated?", options: ["They shrink", "They move faster and spread out", "They disappear", "They freeze"], correctIndex: 1 },
    ],
    [
      { question: "What is plasma?", options: ["A type of solid", "A superheated gas with charged particles", "Another name for ice", "A liquid found in oceans"], correctIndex: 1 },
      { question: "Where can you find plasma in everyday life?", options: ["In your fridge", "In lightning and the Sun", "In a glass of milk", "Under the ground"], correctIndex: 1 },
      { question: "What state of matter is the air around you?", options: ["Solid", "Liquid", "Gas", "Plasma"], correctIndex: 2 },
    ],
  ],
  "The Solar System": [
    [
      { question: "How many planets are in our solar system?", options: ["6", "7", "8", "9"], correctIndex: 2 },
      { question: "Which planet is closest to the Sun?", options: ["Earth", "Venus", "Mercury", "Mars"], correctIndex: 2 },
      { question: "What is the large star at the center of our solar system?", options: ["The Moon", "The Sun", "Mars", "Jupiter"], correctIndex: 1 },
    ],
    [
      { question: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], correctIndex: 2 },
      { question: "What is the hottest planet in our solar system?", options: ["Mercury", "Venus", "Mars", "Jupiter"], correctIndex: 1 },
      { question: "Which planet has the most visible rings?", options: ["Jupiter", "Neptune", "Saturn", "Uranus"], correctIndex: 2 },
    ],
    [
      { question: "Why does the solar system matter to us?", options: ["It doesn't", "It helps us understand our place in the universe", "It keeps us warm", "It creates gravity on Earth"], correctIndex: 1 },
      { question: "Which planet is the largest?", options: ["Saturn", "Jupiter", "Neptune", "Earth"], correctIndex: 1 },
      { question: "What keeps the planets orbiting the Sun?", options: ["Wind", "Magnetism", "Gravity", "Electricity"], correctIndex: 2 },
    ],
    [
      { question: "How long does light from the Sun take to reach Earth?", options: ["1 second", "About 8 minutes", "1 hour", "1 day"], correctIndex: 1 },
      { question: "Which planet rotates on its side?", options: ["Mars", "Jupiter", "Uranus", "Venus"], correctIndex: 2 },
      { question: "What is a 'dwarf planet'?", options: ["A small moon", "An object that orbits the Sun but hasn't cleared its orbit", "A broken planet", "A gas cloud"], correctIndex: 1 },
    ],
  ],
};

export function getInlineTestQuestions(topic: string, part: number): InlineTestQuestion[] {
  const bank = INLINE_TEST_BANK[topic];
  if (bank && bank[part - 1]) return bank[part - 1];
  return [
    { question: "What was the main idea of this lesson?", options: ["I'm not sure", "I remember some of it", "I understood most of it", "It was confusing"], correctIndex: 2 },
    { question: "Can you explain this topic to a friend?", options: ["Not at all", "Maybe a little", "Yes, with some parts", "Definitely!"], correctIndex: 2 },
    { question: "How confident do you feel about this material?", options: ["Not confident", "Somewhat confident", "Pretty confident", "Very confident"], correctIndex: 2 },
  ];
}

/**
 * Pre-written fallback lessons keyed by subject.
 * Used when the Groq API times out or fails.
 */
export const FALLBACK_LESSONS: Record<string, string> = {
  Math: `Welcome to today's math quest! Let's explore something you use more than you think — numbers and patterns.\n\nEvery time you count your change, measure ingredients for a recipe, or check the time, you're doing math. It's like a secret code that helps you understand the world.\n\nHere's a fun thought: the word "algebra" comes from Arabic! The Persian mathematician Al-Khwarizmi wrote about it over a thousand years ago. Math has been connecting people across cultures for centuries.\n\nHere's something to try: pick any number, multiply it by 2, add 10, then divide by 2. Now subtract your original number. What did you get? Try it with different numbers — you'll always get 5. That's the beauty of algebraic patterns!\n\nNow, here's my question for you: if you could use math to solve any real-world problem in your daily life, what would it be?`,

  Science: `Hey there, brave explorer! Today we're going to zoom out — way out — and explore the vast reaches of space.\n\nOur solar system has eight planets orbiting the Sun, and each one is totally unique. Mercury is tiny and super hot. Jupiter is so massive that over 1,300 Earths could fit inside it!\n\nHere's something cool: Saturn's rings aren't solid — they're made of billions of pieces of ice and rock, ranging from tiny grains to house-sized chunks. Imagine throwing a snowball that big!\n\nAnd get this — a day on Venus is longer than a year on Venus. It takes longer to spin once on its axis than it does to orbit the Sun. Time works differently out there.\n\nOh, and if you could fly a plane to the Sun, it would take about 20 years. The Sun is roughly 150 million kilometers away. That's a LOT of airplane tickets.\n\nMy question for you: if you could visit any planet in our solar system, which one would you choose and why?`,

  History: `Welcome to the realm of history — but way more exciting than you're expecting! Let's journey back in time to explore the great civilizations of old.\n\nThousands of years ago, people built incredible things without modern technology. The Great Pyramids of Giza were built around 2560 BCE using over 2 million stone blocks, each weighing about 2.5 tons. No cranes, no trucks — just human ingenuity and determination.\n\nThe ancient Mesopotamians invented writing around 3400 BCE. They pressed wedge-shaped marks into clay tablets. Imagine writing your homework on a clay cookie! That system was called cuneiform.\n\nIn ancient China, students had to pass incredibly difficult exams to become government officials. These exams tested knowledge of poetry, history, and philosophy. Some students studied for their whole lives!\n\nAnd here's a fun one: the ancient Romans had a festival called Saturnalia where, for one week, normal rules were flipped upside down. Servants got to boss masters around, and schools closed. Sounds like the best holiday ever.\n\nMy question for you: if you could time-travel to any ancient civilization for one day, which would you visit?`,

  English: `Time for some English magic! Today we're going to explore the building blocks of language — words and how they work together.\n\nEvery word you speak or write is a tool. Nouns name things, verbs show action, and adjectives add color. Together, they paint pictures in people's minds.\n\nHere's something amazing: the English language has over 170,000 words in current use. But you only need about 3,000 to cover 95% of everyday conversation. That's like having a huge toolbox but only really needing a few key tools.\n\nHave you ever noticed how some words just sound like what they mean? "Buzz" sounds like a bee. "Splash" sounds like water hitting something. These are called onomatopoeias, and writers use them to make stories come alive.\n\nAnd here's a secret: even the best authors rewrite their work dozens of times. Hemingway once said he rewrote the ending of A Farewell to Arms 39 times. Writing isn't about getting it perfect on the first try — it's about making it better each time.\n\nMy question for you: if you could make up a brand-new English word that doesn't exist yet, what would it mean and how would you spell it?`,

  "General Knowledge": `Welcome to the Hall of Knowledge — where we connect dots across all kinds of topics! Let's take a grand tour around the world.\n\nDid you know that the smallest country in the world is Vatican City? It's only about 0.44 square kilometers — smaller than most city parks. Yet it has its own postal system, newspaper, and radio station.\n\nHere's a wild fact: honey never spoils. Archaeologists found 3,000-year-old honey in Egyptian tombs that was still perfectly edible. Bees are basically tiny food preservation scientists.\n\nThe world's most spoken language by total number of speakers is English, with over 1.5 billion speakers worldwide. But the most spoken language by native speakers is Mandarin Chinese, with about 920 million people.\n\nAnd something to think about: every two minutes, we take more photos than all of humanity took in the entire 19th century. We live in an incredible time of technology and information.\n\nMy question for you: what's the most interesting fact you know, and how did you learn it?`,
};

// ============================================================================
// WISE OLD KING - Chat tutor personality
// ============================================================================

export const WISE_OLD_KING_INTRO = `Ah, greetings, young scholar! I am the Wise Old King, keeper of knowledge across all the realms. I shan't simply hand you the answers like a merchant selling wares — nay, I shall guide you to discover them yourself, as all true learners must. Shall we begin our quest? 🏰`;

export const WISE_OLD_KING_HINT_PREFIXES = [
  "Hmm, an interesting thought, but let us look at this from another angle...",
  "Ah, you're getting warm, young one, but not quite there yet. Consider this...",
  "A noble effort! But I sense there's more to uncover. Think about...",
  "Not quite, brave adventurer. Let me offer you a small clue...",
  "You're closer than you think! Here's a hint to guide your path...",
];
