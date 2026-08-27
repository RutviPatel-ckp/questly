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
];

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
  "General Knowledge": [
    "World Geography",
    "Current Events Awareness",
    "Famous Inventors and Inventions",
    "Environmental Issues",
    "Cultural Traditions Around the World",
  ],
};

// ============================================================================
// MULTI-PART LESSON STRUCTURE
// ============================================================================

export const PARTS_PER_TOPIC = 4;

export const PART_TITLES: Record<string, Record<string, string[]>> = {
  Science: {
    "The Water Cycle": ["Part 1: Where Does Water Come From?", "Part 2: How Water Travels", "Part 3: Why the Water Cycle Matters", "Part 4: Water Cycle Fun Facts"],
    "States of Matter": ["Part 1: Solids, Liquids, and Gases", "Part 2: How Matter Changes State", "Part 3: Why States of Matter Matter", "Part 4: Matter Fun Facts"],
    "The Solar System": ["Part 1: Meet the Planets", "Part 2: The Sun and Inner Planets", "Part 3: Outer Planets and Moons", "Part 4: Space Fun Facts"],
    Photosynthesis: ["Part 1: How Plants Make Food", "Part 2: Sunlight, Water, and CO2", "Part 3: Why Photosynthesis Matters", "Part 4: Plant Science Fun Facts"],
    "Simple Machines": ["Part 1: What Are Simple Machines?", "Part 2: Levers, Pulleys, and Wheels", "Part 3: Machines in Everyday Life", "Part 4: Simple Machines Fun Facts"],
  },
  Math: {
    "Integers and Number Lines": ["Part 1: Positive and Negative Numbers", "Part 2: Working with Number Lines", "Part 3: Adding and Subtracting Integers", "Part 4: Integer Fun Facts"],
    "Fractions and Decimals": ["Part 1: What Are Fractions?", "Part 2: Converting Between Fractions and Decimals", "Part 3: Adding, Subtracting, and Comparing", "Part 4: Fraction Fun Facts"],
    "Algebraic Expressions": ["Part 1: Variables and Constants", "Part 2: Writing Expressions", "Part 3: Simplifying Expressions", "Part 4: Algebra Fun Facts"],
    "Geometry and Angles": ["Part 1: Shapes and Their Properties", "Part 2: Understanding Angles", "Part 3: Area and Perimeter", "Part 4: Geometry Fun Facts"],
    "Data and Probability": ["Part 1: Reading Charts and Graphs", "Part 2: Mean, Median, and Mode", "Part 3: Basics of Probability", "Part 4: Data Fun Facts"],
  },
  History: {
    "Ancient Civilizations": ["Part 1: Early Human Societies", "Part 2: Egypt, Mesopotamia, and China", "Part 3: Greece and Rome", "Part 4: Ancient World Fun Facts"],
    "Independence Movements": ["Part 1: What Drives Independence?", "Part 2: Famous Leaders and Movements", "Part 3: Independence in Africa and Asia", "Part 4: Freedom Fun Facts"],
    "Explorers and Trade Routes": ["Part 1: The Age of Exploration", "Part 2: Silk Road and Spice Trade", "Part 3: Maritime Explorers", "Part 4: Exploration Fun Facts"],
    "World War II Basics": ["Part 1: What Caused the War?", "Part 2: Key Events and Battles", "Part 3: The Home Front", "Part 4: WWII Fun Facts"],
    "Local and Regional History": ["Part 1: Your Region's Ancient Past", "Part 2: Colonial Era and Change", "Part 3: Modern History and Independence", "Part 4: Local History Fun Facts"],
  },
  English: {
    "Parts of Speech": ["Part 1: Nouns and Verbs", "Part 2: Adjectives and Adverbs", "Part 3: Pronouns, Prepositions, and Conjunctions", "Part 4: Parts of Speech Fun Facts"],
    "Reading Comprehension": ["Part 1: What Is Reading Comprehension?", "Part 2: Finding the Main Idea", "Part 3: Making Inferences", "Part 4: Reading Fun Facts"],
    "Creative Writing Basics": ["Part 1: Story Structure", "Part 2: Character and Dialogue", "Part 3: Show, Don't Tell", "Part 4: Writing Fun Facts"],
    "Figurative Language": ["Part 1: Similes and Metaphors", "Part 2: Personification and Hyperbole", "Part 3: Idioms and Allusions", "Part 4: Figurative Language Fun Facts"],
    "Essay Structure": ["Part 1: Introduction Paragraphs", "Part 2: Body Paragraphs and Evidence", "Part 3: Conclusions That Stick", "Part 4: Essay Writing Fun Facts"],
  },
  "General Knowledge": {
    "World Geography": ["Part 1: Continents and Oceans", "Part 2: Mountains, Rivers, and Deserts", "Part 3: Climate and Biomes", "Part 4: Geography Fun Facts"],
    "Current Events Awareness": ["Part 1: How to Follow the News", "Part 2: Understanding Headlines", "Part 3: Media Literacy Basics", "Part 4: News Fun Facts"],
    "Famous Inventors and Inventions": ["Part 1: Pioneers of Invention", "Part 2: Inventions That Changed the World", "Part 3: Modern Innovation", "Part 4: Invention Fun Facts"],
    "Environmental Issues": ["Part 1: Climate Change Basics", "Part 2: Pollution and Conservation", "Part 3: What Can We Do?", "Part 4: Environment Fun Facts"],
    "Cultural Traditions Around the World": ["Part 1: Festivals and Celebrations", "Part 2: Food and Customs", "Part 3: Art, Music, and Storytelling", "Part 4: Culture Fun Facts"],
  },
};

export function getPartTitle(subject: string, topic: string, part: number): string {
  const topicParts = PART_TITLES[subject]?.[topic];
  if (topicParts && topicParts[part - 1]) return topicParts[part - 1];
  return `Part ${part}: ${topic}`;
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
  Math: `Welcome to today's math adventure! Let's talk about something you use more than you think — numbers and patterns.

Every time you count your change, measure ingredients for a recipe, or check the time, you're doing math. It's like a secret language that helps you understand the world.

Here's a fun thought: the word "algebra" comes from Arabic! The Persian mathematician Al-Khwarizmi wrote about it over a thousand years ago. Math has been connecting people across cultures for centuries.

Here's something to try: pick any number, multiply it by 2, add 10, then divide by 2. Now subtract your original number. What did you get? Try it with different numbers — you'll always get 5. That's the beauty of algebraic patterns!

Now, here's my question for you: if you could use math to solve any real-world problem in your daily life, what would it be?`,

  Science: `Hey there, science explorer! Today we're going to zoom out — way out — and talk about our solar system.

Our solar system has eight planets orbiting the Sun, and each one is totally unique. Mercury is tiny and super hot. Jupiter is so massive that over 1,300 Earths could fit inside it!

Here's something cool: Saturn's rings aren't solid — they're made of billions of pieces of ice and rock, ranging from tiny grains to house-sized chunks. Imagine throwing a snowball that big!

And get this — a day on Venus is longer than a year on Venus. It takes longer to spin once on its axis than it does to orbit the Sun. Time works differently out there.

Oh, and if you could fly a plane to the Sun, it would take about 20 years. The Sun is roughly 150 million kilometers away. That's a LOT of airplane tickets.

My question for you: if you could visit any planet in our solar system, which one would you choose and why?`,

  History: `Welcome to history class — but way more fun than you're expecting! Let's travel back in time to explore ancient civilizations.

Thousands of years ago, people built incredible things without modern technology. The Great Pyramids of Giza were built around 2560 BCE using over 2 million stone blocks, each weighing about 2.5 tons. No cranes, no trucks — just human ingenuity.

The ancient Mesopotamians invented writing around 3400 BCE. They pressed wedge-shaped marks into clay tablets. Imagine writing your homework on a clay cookie! That system was called cuneiform.

In ancient China, students had to pass incredibly difficult exams to become government officials. These exams tested knowledge of poetry, history, and philosophy. Some students studied for their whole lives!

And here's a fun one: the ancient Romans had a festival called Saturnalia where, for one week, normal rules were flipped upside down. Servants got to boss masters around, and schools closed. Sounds like the best holiday ever.

My question for you: if you could time-travel to any ancient civilization for one day, which would you visit?`,

  English: `Time for some English magic! Today we're going to explore the building blocks of language — words and how they work together.

Every word you speak or write is a tool. Nouns name things, verbs show action, and adjectives add color. Together, they paint pictures in people's minds.

Here's something amazing: the English language has over 170,000 words in current use. But you only need about 3,000 to cover 95% of everyday conversation. That's like having a huge toolbox but only really needing a few key tools.

Have you ever noticed how some words just sound like what they mean? "Buzz" sounds like a bee. "Splash" sounds like water hitting something. These are called onomatopoeias, and writers use them to make stories come alive.

And here's a secret: even the best authors rewrite their work dozens of times. Hemingway once said he rewrote the ending of A Farewell to Arms 39 times. Writing isn't about getting it perfect on the first try — it's about making it better each time.

My question for you: if you could make up a brand-new English word that doesn't exist yet, what would it mean and how would you spell it?`,

  "General Knowledge": `Welcome to General Knowledge — where we connect dots across all kinds of topics! Let's take a trip around the world.

Did you know that the smallest country in the world is Vatican City? It's only about 0.44 square kilometers — smaller than most city parks. Yet it has its own postal system, newspaper, and radio station.

Here's a wild fact: honey never spoils. Archaeologists found 3,000-year-old honey in Egyptian tombs that was still perfectly edible. Bees are basically tiny food preservation scientists.

The world's most spoken language by total number of speakers is English, with over 1.5 billion speakers worldwide. But the most spoken language by native speakers is Mandarin Chinese, with about 920 million people.

And something to think about: every two minutes, we take more photos than all of humanity took in the entire 19th century. We live in an incredible time of technology and information.

My question for you: what's the most interesting fact you know, and how did you learn it?`,
};
