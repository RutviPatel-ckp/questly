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
  // ==========================================================================
  // SCIENCE
  // ==========================================================================
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
  "Photosynthesis": [
    [
      { question: "What do plants use sunlight to make?", options: ["Water", "Sugar (food)", "Oxygen only", "Soil"], correctIndex: 1 },
      { question: "What gas do plants absorb from the air?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"], correctIndex: 2 },
      { question: "Where does photosynthesis happen in a plant?", options: ["The roots", "The stem", "The leaves (chloroplasts)", "The flowers"], correctIndex: 2 },
    ],
    [
      { question: "What is one product of photosynthesis?", options: ["Carbon dioxide", "Water", "Oxygen", "Soil"], correctIndex: 2 },
      { question: "Why is photosynthesis important for animals?", options: ["It gives them shade", "It produces the oxygen they breathe", "It makes food for them directly", "It warms them up"], correctIndex: 1 },
      { question: "What pigment in plants absorbs light energy?", options: ["Melanin", "Chlorophyll", "Hemoglobin", "Keratin"], correctIndex: 1 },
    ],
    [
      { question: "What would happen if all plants stopped photosynthesizing?", options: ["Nothing", "We'd run out of oxygen and food", "The Sun would stop shining", "Water would disappear"], correctIndex: 1 },
      { question: "Which of these is needed for photosynthesis?", options: ["Moonlight", "Soil only", "Sunlight, water, and CO2", "Wind"], correctIndex: 2 },
      { question: "Trees are important because they...", options: ["Block wind", "Produce oxygen through photosynthesis", "Create rain", "Heat the atmosphere"], correctIndex: 1 },
    ],
    [
      { question: "How do plants transport water from roots to leaves?", options: ["By gravity", "Through tubes called xylem", "Through their bark", "They don't — rain reaches leaves directly"], correctIndex: 1 },
      { question: "What is transpiration?", options: ["Eating food", "Water evaporating from plant leaves", "A type of soil", "A plant root"], correctIndex: 1 },
      { question: "Do all plants photosynthesize?", options: ["Yes, all of them", "Most do, but some parasitic plants don't", "Only trees", "Only flowers"], correctIndex: 1 },
    ],
  ],
  "Simple Machines": [
    [
      { question: "How many types of simple machines are there?", options: ["3", "5", "6", "10"], correctIndex: 2 },
      { question: "Which simple machine is a seesaw an example of?", options: ["Pulley", "Lever", "Inclined plane", "Wheel and axle"], correctIndex: 1 },
      { question: "What does a simple machine do?", options: ["Makes work easier", "Creates energy", "Destroys things", "Makes things heavier"], correctIndex: 0 },
    ],
    [
      { question: "Which simple machine is a ramp?", options: ["Wedge", "Screw", "Inclined plane", "Pulley"], correctIndex: 2 },
      { question: "A door handle is an example of...", options: ["Lever", "Wheel and axle", "Pulley", "Inclined plane"], correctIndex: 1 },
      { question: "Which simple machine changes the direction of a force?", options: ["Wedge", "Screw", "Pulley", "Wheel and axle"], correctIndex: 2 },
    ],
    [
      { question: "Why are simple machines useful?", options: ["They're fun to look at", "They reduce the effort needed to do work", "They create energy", "They're only for robots"], correctIndex: 1 },
      { question: "A bicycle uses several simple machines. Which one helps you pedal?", options: ["Pulley", "Screw", "Wheel and axle", "Wedge"], correctIndex: 2 },
      { question: "An axe blade is an example of which simple machine?", options: ["Lever", "Wedge", "Screw", "Pulley"], correctIndex: 1 },
    ],
    [
      { question: "What is a compound machine?", options: ["A machine made of gold", "Two or more simple machines working together", "A broken machine", "A machine that runs on compost"], correctIndex: 1 },
      { question: "A jar lid uses which simple machine?", options: ["Pulley", "Lever", "Screw", "Inclined plane"], correctIndex: 2 },
      { question: "Which simple machine was used in ancient pyramids to move heavy stones?", options: ["Pulley", "Inclined plane (ramps)", "Wheel and axle", "Screw"], correctIndex: 1 },
    ],
  ],
  // ==========================================================================
  // MATH
  // ==========================================================================
  "Integers and Number Lines": [
    [
      { question: "What is -3 + 7?", options: ["-4", "4", "10", "-10"], correctIndex: 1 },
      { question: "On a number line, which direction do negative numbers go?", options: ["Right", "Left", "Up", "They don't appear"], correctIndex: 1 },
      { question: "What is the opposite of -5?", options: ["-5", "0", "5", "10"], correctIndex: 2 },
    ],
    [
      { question: "What is -4 × -3?", options: ["-12", "12", "-7", "7"], correctIndex: 1 },
      { question: "Which integer is the smallest: -8, -3, 0, -10?", options: ["-8", "-3", "0", "-10"], correctIndex: 3 },
      { question: "What is 6 - (-2)?", options: ["4", "8", "-4", "-8"], correctIndex: 1 },
    ],
    [
      { question: "If you owe someone $15 and earn $20, what's your net?", options: ["-$5", "$5", "$35", "-$35"], correctIndex: 1 },
      { question: "What is the absolute value of -9?", options: ["-9", "9", "0", "-1"], correctIndex: 1 },
      { question: "Which is greater: -2 or -7?", options: ["-7", "-2", "They're equal", "Neither"], correctIndex: 1 },
    ],
    [
      { question: "What is the product of all integers from -2 to 2?", options: ["0", "-4", "4", "8"], correctIndex: 0 },
      { question: "How many integers are between -3 and 3 (exclusive)?", options: ["5", "6", "7", "4"], correctIndex: 0 },
      { question: "Which expression equals zero?", options: ["5 + (-5)", "5 × 0", "Both A and B", "Neither"], correctIndex: 2 },
    ],
  ],
  "Fractions and Decimals": [
    [
      { question: "What is 1/2 + 1/4?", options: ["2/6", "3/4", "1/6", "2/4"], correctIndex: 1 },
      { question: "Which is larger: 0.5 or 0.25?", options: ["0.25", "0.5", "They're equal", "Can't tell"], correctIndex: 1 },
      { question: "What is 3/4 as a decimal?", options: ["0.25", "0.34", "0.75", "0.50"], correctIndex: 2 },
    ],
    [
      { question: "What is 0.75 × 4?", options: ["3", "30", "0.3", "300"], correctIndex: 0 },
      { question: "How do you convert 3/5 to a decimal?", options: ["Divide 3 by 5", "Multiply 3 by 5", "Add 3 and 5", "Subtract 3 from 5"], correctIndex: 0 },
      { question: "What is 2/3 + 1/3?", options: ["3/6", "1", "2/6", "3/3"], correctIndex: 1 },
    ],
    [
      { question: "Why are fractions useful in real life?", options: ["They aren't", "They help split things fairly and measure precisely", "They only work in school", "They're only for advanced math"], correctIndex: 1 },
      { question: "Which fraction is equivalent to 0.5?", options: ["1/3", "1/4", "1/2", "2/3"], correctIndex: 2 },
      { question: "What is 1.5 + 2.75?", options: ["3.25", "4.25", "3.75", "4.5"], correctIndex: 1 },
    ],
    [
      { question: "What is 7/8 as a decimal?", options: ["0.875", "0.785", "0.800", "0.750"], correctIndex: 0 },
      { question: "If a pizza is cut into 8 slices and you eat 3, what fraction is left?", options: ["3/8", "5/8", "3/5", "8/3"], correctIndex: 1 },
      { question: "Which is NOT equivalent to 1/2?", options: ["2/4", "5/10", "0.5", "1/3"], correctIndex: 3 },
    ],
  ],
  "Algebraic Expressions": [
    [
      { question: "If x = 5, what is 2x + 3?", options: ["13", "10", "8", "15"], correctIndex: 0 },
      { question: "In the expression 3y - 7, what is the variable?", options: ["3", "y", "7", "-7"], correctIndex: 1 },
      { question: "What does 'simplify' mean in algebra?", options: ["Make it longer", "Make it as simple as possible", "Delete it", "Add more terms"], correctIndex: 1 },
    ],
    [
      { question: "Simplify: 4x + 2x", options: ["6x", "8x", "6x²", "8x²"], correctIndex: 0 },
      { question: "If a = 3 and b = 4, what is a² + b²?", options: ["7", "12", "25", "49"], correctIndex: 2 },
      { question: "What is the coefficient in 5n + 2?", options: ["5", "n", "2", "5n"], correctIndex: 0 },
    ],
    [
      { question: "Why do we use variables in math?", options: ["To make math harder", "To represent unknown or changing values", "Because letters are fun", "Only scientists use them"], correctIndex: 1 },
      { question: "Simplify: 3(a + 2)", options: ["3a + 2", "3a + 6", "a + 6", "3a + 5"], correctIndex: 1 },
      { question: "If x = 4, what is x² - x?", options: ["12", "16", "20", "0"], correctIndex: 0 },
    ],
    [
      { question: "What is the value of 2x + 5 when x = -3?", options: ["-1", "1", "11", "-11"], correctIndex: 0 },
      { question: "Which is a like term with 7a?", options: ["7b", "-3a", "7ab", "a²"], correctIndex: 1 },
      { question: "Simplify: 10 - 3(x - 2)", options: ["7x - 6", "16 - 3x", "10 - 3x + 6", "7x + 4"], correctIndex: 1 },
    ],
  ],
  "Geometry and Angles": [
    [
      { question: "How many degrees are in a straight line?", options: ["90°", "180°", "270°", "360°"], correctIndex: 1 },
      { question: "What is a triangle with one 90° angle called?", options: ["Equilateral", "Isosceles", "Right triangle", "Scalene"], correctIndex: 2 },
      { question: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], correctIndex: 1 },
    ],
    [
      { question: "What is the sum of angles in any triangle?", options: ["90°", "180°", "270°", "360°"], correctIndex: 1 },
      { question: "An angle greater than 90° but less than 180° is called...", options: ["Acute", "Obtuse", "Right", "Straight"], correctIndex: 1 },
      { question: "What is the formula for the area of a rectangle?", options: ["Length + Width", "Length × Width", "2 × (Length + Width)", "Length × Width × Height"], correctIndex: 1 },
    ],
    [
      { question: "Why is geometry important in real life?", options: ["It isn't", "It helps in building, designing, and measuring", "Only for architects", "Only for artists"], correctIndex: 1 },
      { question: "What is a parallelogram?", options: ["A 5-sided shape", "A shape with opposite sides parallel", "A circle", "A shape with no sides"], correctIndex: 1 },
      { question: "If a square has a side of 5cm, what is its area?", options: ["10 cm²", "20 cm²", "25 cm²", "15 cm²"], correctIndex: 2 },
    ],
    [
      { question: "What is the perimeter of a rectangle with length 8 and width 3?", options: ["11", "22", "24", "26"], correctIndex: 1 },
      { question: "Two angles that add up to 90° are called...", options: ["Supplementary", "Complementary", "Adjacent", "Vertical"], correctIndex: 1 },
      { question: "What shape has exactly 4 equal sides and 4 right angles?", options: ["Rectangle", "Rhombus", "Square", "Trapezoid"], correctIndex: 2 },
    ],
  ],
  "Data and Probability": [
    [
      { question: "What is the mean of 2, 4, 6, 8?", options: ["4", "5", "6", "20"], correctIndex: 1 },
      { question: "If you flip a fair coin, what is the probability of heads?", options: ["0", "1/4", "1/2", "1"], correctIndex: 2 },
      { question: "Which graph is best for showing parts of a whole?", options: ["Bar graph", "Line graph", "Pie chart", "Number line"], correctIndex: 2 },
    ],
    [
      { question: "What is the median of 3, 7, 1, 9, 5?", options: ["1", "5", "7", "3"], correctIndex: 1 },
      { question: "If you roll a standard die, what is the probability of getting a 6?", options: ["1/2", "1/3", "1/6", "1/4"], correctIndex: 2 },
      { question: "The mode of a data set is the...", options: ["Middle value", "Most common value", "Average", "Smallest value"], correctIndex: 1 },
    ],
    [
      { question: "Why is data analysis important?", options: ["It isn't", "It helps us make informed decisions based on evidence", "Only scientists need it", "It's just counting"], correctIndex: 1 },
      { question: "What is the range of 12, 5, 8, 20?", options: ["8", "12", "15", "20"], correctIndex: 2 },
      { question: "If you pick a card from a standard deck, what is the probability of a heart?", options: ["1/2", "1/4", "1/13", "1/52"], correctIndex: 1 },
    ],
    [
      { question: "What is the mean of 10, 20, 30, 40, 50?", options: ["20", "25", "30", "35"], correctIndex: 2 },
      { question: "An event that is certain has a probability of...", options: ["0", "0.5", "1", "2"], correctIndex: 2 },
      { question: "Which measure of center is affected by extreme values?", options: ["Median", "Mode", "Mean", "Range"], correctIndex: 2 },
    ],
  ],
  // ==========================================================================
  // HISTORY
  // ==========================================================================
  "Ancient Civilizations": [
    [
      { question: "Which ancient civilization built the pyramids of Giza?", options: ["Romans", "Greeks", "Egyptians", "Persians"], correctIndex: 2 },
      { question: "What writing system did the ancient Sumerians invent?", options: ["Hieroglyphics", "Cuneiform", "Latin alphabet", "Chinese characters"], correctIndex: 1 },
      { question: "In which river valley did ancient Indian civilization begin?", options: ["Nile", "Tigris", "Indus", "Amazon"], correctIndex: 2 },
    ],
    [
      { question: "Who was Cleopatra?", options: ["A Roman soldier", "An Egyptian queen", "A Greek philosopher", "A Persian king"], correctIndex: 1 },
      { question: "Which ancient civilization invented democracy?", options: ["Egyptians", "Romans", "Greeks (Athenians)", "Chinese"], correctIndex: 2 },
      { question: "What material did Romans use to build their famous roads?", options: ["Wood", "Concrete and stone", "Sand only", "Brick only"], correctIndex: 1 },
    ],
    [
      { question: "Why do ancient civilizations matter to us today?", options: ["They don't", "They shaped our laws, language, and technologies", "Only for museum exhibits", "They had nothing useful"], correctIndex: 1 },
      { question: "Which civilization developed the first known legal code?", options: ["Romans", "Sumerians (Code of Hammurabi)", "Greeks", "Egyptians"], correctIndex: 1 },
      { question: "The Great Wall of China was originally built to...", options: ["Attract tourists", "Protect against invaders", "Mark borders for trade", "Show artistic skill"], correctIndex: 1 },
    ],
    [
      { question: "Approximately how old are the oldest Egyptian pyramids?", options: ["About 500 years", "About 1,000 years", "About 4,500 years", "About 10,000 years"], correctIndex: 2 },
      { question: "Which ancient civilization is known for its advanced mathematics and zero?", options: ["Romans", "Greeks", "Indians", "Persians"], correctIndex: 2 },
      { question: "What did ancient Romans call their empire's capital?", options: ["Athens", "Constantinople", "Rome", "Alexandria"], correctIndex: 2 },
    ],
  ],
  "Independence Movements": [
    [
      { question: "In what year did the American colonies declare independence from Britain?", options: ["1492", "1620", "1776", "1800"], correctIndex: 2 },
      { question: "Who was a key leader in India's independence movement?", options: ["Winston Churchill", "Mahatma Gandhi", "Napoleon", "Queen Victoria"], correctIndex: 1 },
      { question: "What was the American Declaration of Independence?", options: ["A peace treaty", "A statement announcing separation from Britain", "A new law about taxes", "A religious text"], correctIndex: 1 },
    ],
    [
      { question: "What strategy did Gandhi use in India's freedom struggle?", options: ["Military conquest", "Non-violent civil disobedience", "Foreign alliances only", "Economic sanctions"], correctIndex: 1 },
      { question: "The Boston Tea Party was a protest against...", options: ["Low tea prices", "Taxation without representation", "British food", "The monarchy"], correctIndex: 1 },
      { question: "When did India gain independence from British rule?", options: ["1900", "1947", "1960", "1980"], correctIndex: 1 },
    ],
    [
      { question: "Why are independence movements important?", options: ["They aren't", "They show people's desire for self-governance and freedom", "They only happened in America", "They only affect the wealthy"], correctIndex: 1 },
      { question: "Which Latin American leader helped liberate several countries from Spain?", options: ["Simon Bolivar", "Napoleon", "Christopher Columbus", "George Washington"], correctIndex: 0 },
      { question: "What does 'civil disobedience' mean?", options: ["Breaking all laws", "Peacefully refusing to obey unjust laws", "Starting a war", "Ignoring the government"], correctIndex: 1 },
    ],
    [
      { question: "What inspired many independence movements worldwide?", options: ["Only the American Revolution", "Ideas of liberty, equality, and self-determination", "The invention of the printing press", "Religious conflicts only"], correctIndex: 1 },
      { question: "Who wrote the famous 'I Have a Dream' speech?", options: ["Abraham Lincoln", "Martin Luther King Jr.", "Nelson Mandela", "Malala Yousafzai"], correctIndex: 1 },
      { question: "Nelson Mandela fought against what system in South Africa?", options: ["Communism", "Colonialism", "Apartheid", "Feudalism"], correctIndex: 2 },
    ],
  ],
  "Explorers and Trade Routes": [
    [
      { question: "Who is credited with discovering America in 1492?", options: ["Vasco da Gama", "Christopher Columbus", "Marco Polo", "Ferdinand Magellan"], correctIndex: 1 },
      { question: "What was the Silk Road?", options: ["A type of fabric", "An ancient network of trade routes", "A Roman road", "A Chinese ship"], correctIndex: 1 },
      { question: "Which explorer led the first circumnavigation of the globe?", options: ["Columbus", "Magellan (completed by Elcano)", "Drake", "Cook"], correctIndex: 1 },
    ],
    [
      { question: "What goods were traded along the Spice Route?", options: ["Only gold", "Spices, silk, tea, and precious stones", "Only food", "Only weapons"], correctIndex: 1 },
      { question: "Who was a famous explorer from China's Ming Dynasty?", options: ["Kublai Khan", "Zheng He", "Confucius", "Sun Tzu"], correctIndex: 1 },
      { question: "What did European explorers seek in Africa?", options: ["Only friendship", "Gold, spices, and new trade opportunities", "Polar ice", "Nothing important"], correctIndex: 1 },
    ],
    [
      { question: "Why were trade routes important for civilizations?", options: ["They weren't", "They spread goods, ideas, and cultures between regions", "They only benefited the rich", "They were only for war"], correctIndex: 1 },
      { question: "Vasco da Gama reached India by sailing around...", options: ["South America", "Australia", "Africa (Cape of Good Hope)", "Antarctica"], correctIndex: 2 },
      { question: "What was the Columbian Exchange?", options: ["A currency system", "Transfer of plants, animals, and diseases between Old and New Worlds", "A trade agreement", "A ship"], correctIndex: 1 },
    ],
    [
      { question: "Which spice was once more valuable than gold?", options: ["Salt", "Pepper (and nutmeg)", "Cinnamon only", "Sugar"], correctIndex: 1 },
      { question: "Marco Polo traveled to which court?", options: ["Egyptian", "Roman", "Chinese (Kublai Khan's)", "Persian"], correctIndex: 2 },
      { question: "What impact did exploration have on indigenous populations?", options: ["Nothing changed", "Devastating effects through disease, conflict, and displacement", "Only positive trade benefits", "No contact occurred"], correctIndex: 1 },
    ],
  ],
  "World War II Basics": [
    [
      { question: "When did World War II begin?", options: ["1935", "1939", "1941", "1945"], correctIndex: 1 },
      { question: "Which countries made up the Axis Powers?", options: ["UK, France, USA", "Germany, Italy, Japan", "Russia, China, India", "Spain, Portugal, Netherlands"], correctIndex: 1 },
      { question: "What event brought the USA into World War II?", options: ["Bombing of Pearl Harbor", "D-Day invasion", "Sinking of the Titanic", "Battle of Gettysburg"], correctIndex: 0 },
    ],
    [
      { question: "What does 'D-Day' refer to?", options: ["The start of the war", "The Allied invasion of Normandy, June 6, 1944", "The day the war ended", "A Japanese holiday"], correctIndex: 1 },
      { question: "Who was the leader of the Allied forces in Europe?", options: ["Winston Churchill", "Adolf Hitler", "General Eisenhower", "Joseph Stalin"], correctIndex: 2 },
      { question: "What was the Holocaust?", options: ["A battle strategy", "The systematic murder of 6 million Jews and millions of others by Nazi Germany", "A peace treaty", "A type of aircraft"], correctIndex: 1 },
    ],
    [
      { question: "Why is World War II important to study?", options: ["It isn't", "It teaches us about the cost of hatred and the value of peace", "It's just old history", "Only soldiers need to know"], correctIndex: 1 },
      { question: "What was the Manhattan Project?", options: ["A building project", "The secret project to develop the atomic bomb", "A peace negotiation", "A trade agreement"], correctIndex: 1 },
      { question: "When did World War II end?", options: ["1943", "1944", "1945", "1946"], correctIndex: 2 },
    ],
    [
      { question: "What organization was founded after WWII to promote international peace?", options: ["NATO only", "The United Nations", "The World Bank", "The European Union"], correctIndex: 1 },
      { question: "The Battle of Stalingrad was significant because...", options: ["It was the first battle", "It was a major turning point on the Eastern Front", "It was the last battle", "Nothing special happened there"], correctIndex: 1 },
      { question: "Which country suffered the most civilian deaths in WWII?", options: ["USA", "UK", "Soviet Union", "France"], correctIndex: 2 },
    ],
  ],
  "Local and Regional History": [
    [
      { question: "Why is it important to study local history?", options: ["It isn't", "It connects us to our community's roots and identity", "Only old people care", "It's easier than world history"], correctIndex: 1 },
      { question: "What is an archaeological dig?", options: ["A type of dance", "Excavating the ground to find artifacts from the past", "A mining technique", "A swimming pool"], correctIndex: 1 },
      { question: "Museums help preserve local history by...", options: ["Selling old items", "Storing and displaying artifacts and records", "Destroying old buildings", "Nothing"], correctIndex: 1 },
    ],
    [
      { question: "Oral history refers to...", options: ["Reading old books", "Stories and accounts passed down by word of mouth", "History told through pictures only", "Digital records"], correctIndex: 1 },
      { question: "What can old maps tell us about a region's history?", options: ["Nothing useful", "How borders, trade routes, and settlements changed over time", "Only weather patterns", "Future predictions"], correctIndex: 1 },
      { question: "Why do old buildings matter to a community?", options: ["They don't", "They are physical connections to the past and cultural identity", "They should all be demolished", "Only the newest matter"], correctIndex: 1 },
    ],
    [
      { question: "How can festivals and traditions reflect local history?", options: ["They can't", "They often commemorate historical events or cultural practices", "They're always brand new", "They have no meaning"], correctIndex: 1 },
      { question: "What role do libraries play in preserving local history?", options: ["No role", "They store newspapers, records, and local publications", "They only lend books", "They destroy old records"], correctIndex: 1 },
      { question: "Genealogy is the study of...", options: ["Plants", "Family history and ancestry", "Geography only", "Mathematics"], correctIndex: 1 },
    ],
    [
      { question: "What is a primary source in history?", options: ["A textbook", "An original document or artifact from the time period", "A modern article", "A movie"], correctIndex: 1 },
      { question: "Why might different people tell different stories about the same event?", options: ["They're all lying", "Everyone experiences events from a different perspective", "History changes", "It doesn't matter"], correctIndex: 1 },
      { question: "How does studying local history help us today?", options: ["It doesn't", "It helps us understand how our community evolved and make better decisions", "It's only for fun", "Only historians benefit"], correctIndex: 1 },
    ],
  ],
  // ==========================================================================
  // ENGLISH
  // ==========================================================================
  "Parts of Speech": [
    [
      { question: "Which part of speech describes a verb, adjective, or another adverb?", options: ["Noun", "Adjective", "Adverb", "Conjunction"], correctIndex: 2 },
      { question: "In the sentence 'The cat sat', what is 'cat'?", options: ["Verb", "Adjective", "Noun", "Adverb"], correctIndex: 2 },
      { question: "Which word is a conjunction?", options: ["Quickly", "Beautiful", "And", "House"], correctIndex: 2 },
    ],
    [
      { question: "What part of speech is a 'doing' word?", options: ["Noun", "Verb", "Adjective", "Pronoun"], correctIndex: 1 },
      { question: "Which of these is a pronoun?", options: ["Quickly", "They", "Beautiful", "Run"], correctIndex: 1 },
      { question: "Adjectives describe...", options: ["Actions", "Nouns (people, places, things)", "Other adjectives only", "Sentences"], correctIndex: 1 },
    ],
    [
      { question: "Why are parts of speech important?", options: ["They aren't", "They help us construct clear, meaningful sentences", "Only for teachers to grade", "They make writing harder"], correctIndex: 1 },
      { question: "Which sentence uses a preposition correctly?", options: ["She ran happy", "The book is on the table", "He quickly tall", "They ate running"], correctIndex: 1 },
      { question: "A verb can express...", options: ["Only actions", "Actions or states of being", "Only colors", "Only places"], correctIndex: 1 },
    ],
    [
      { question: "What is the difference between an adverb and an adjective?", options: ["No difference", "Adverbs modify verbs/adjectives; adjectives modify nouns", "Adverbs are longer words", "Adjectives are always at the end"], correctIndex: 1 },
      { question: "Which part of speech connects words, phrases, or clauses?", options: ["Preposition", "Interjection", "Conjunction", "Pronoun"], correctIndex: 2 },
      { question: "In 'Wow, that's amazing!', 'Wow' is an...", options: ["Adverb", "Noun", "Adjective", "Interjection"], correctIndex: 3 },
    ],
  ],
  "Reading Comprehension": [
    [
      { question: "What is the main idea of a passage?", options: ["The first sentence", "The central point the author is making", "The last word", "Any random fact"], correctIndex: 1 },
      { question: "When you read to find specific information, it's called...", options: ["Skimming", "Scanning", "Skipping", "Speeding"], correctIndex: 1 },
      { question: "What is an inference in reading?", options: ["Reading backwards", "A conclusion drawn from clues in the text", "Guessing randomly", "Skipping paragraphs"], correctIndex: 1 },
    ],
    [
      { question: "What does 'context clues' help you do?", options: ["Make up stories", "Figure out the meaning of unfamiliar words", "Count pages", "Find the page number"], correctIndex: 1 },
      { question: "A summary should be...", options: ["Longer than the original", "Shorter, covering only the key points", "Exactly the same length", "Just the first sentence"], correctIndex: 1 },
      { question: "What is the difference between fact and opinion?", options: ["No difference", "Facts can be proven; opinions are beliefs or feelings", "Facts are always longer", "Opinions are always correct"], correctIndex: 1 },
    ],
    [
      { question: "Why is reading comprehension important?", options: ["It isn't", "It helps you understand and learn from all types of texts", "Only for school", "It's not needed in daily life"], correctIndex: 1 },
      { question: "An author's purpose can be to..., entertain, or persuade.", options: ["Sleep", "Inform", "Ignore", "Forget"], correctIndex: 1 },
      { question: "What strategy helps you understand a text before reading?", options: ["Closing the book", "Previewing headings, pictures, and bold words", "Reading only the last page", "Ignoring the title"], correctIndex: 1 },
    ],
    [
      { question: "What does 'text evidence' mean?", options: ["The color of the book", "Specific details from the text that support an answer", "Your personal opinion", "The number of pages"], correctIndex: 1 },
      { question: "Chronological order means...", options: ["Random order", "Events arranged by time, from earliest to latest", "Alphabetical order", "By word count"], correctIndex: 1 },
      { question: "If a passage uses words like 'however' and 'on the other hand', it's showing...", options: ["Agreement", "Contrast or opposing ideas", "Time order", "A list"], correctIndex: 1 },
    ],
  ],
  "Creative Writing Basics": [
    [
      { question: "What are the three main elements of a story?", options: ["Title, author, cover", "Characters, setting, plot", "Font, color, size", "Page 1, page 2, page 3"], correctIndex: 1 },
      { question: "What is the 'climax' of a story?", options: ["The beginning", "The middle with no action", "The most exciting turning point", "The very last sentence"], correctIndex: 2 },
      { question: "A 'protagonist' in a story is...", options: ["The villain", "The main character", "The setting", "The author"], correctIndex: 1 },
    ],
    [
      { question: "What does 'show, don't tell' mean in writing?", options: ["Use only pictures", "Describe actions and feelings instead of just stating them", "Write less", "Use bigger words"], correctIndex: 1 },
      { question: "Point of view in writing refers to...", options: ["The font size", "Who is telling the story (first person, third person, etc.)", "The number of characters", "The page layout"], correctIndex: 1 },
      { question: "What makes a good opening line for a story?", options: ["The longest sentence possible", "Something that grabs the reader's attention", "A list of facts", "A definition"], correctIndex: 1 },
    ],
    [
      { question: "Why is creative writing valuable?", options: ["It isn't", "It builds communication skills, empathy, and imagination", "Only professional authors need it", "It's easier than math"], correctIndex: 1 },
      { question: "Dialogue in a story is...", options: ["The narrator's thoughts", "Characters speaking to each other", "A description of the setting", "The title of the story"], correctIndex: 1 },
      { question: "A 'conflict' in a story is...", options: ["The ending", "A problem or challenge the characters must face", "The author's name", "The page number"], correctIndex: 1 },
    ],
    [
      { question: "What is a 'first draft'?", options: ["The final version", "The first rough version of a piece of writing", "The table of contents", "The bibliography"], correctIndex: 1 },
      { question: "Revising a story means...", options: ["Reading it once", "Going back to improve content, structure, and clarity", "Throwing it away", "Only fixing spelling"], correctIndex: 1 },
      { question: "A 'setting' tells the reader...", options: ["Who the characters are", "When and where the story takes place", "What the plot twist is", "Who the villain is"], correctIndex: 1 },
    ],
  ],
  "Figurative Language": [
    [
      { question: "\"Time flies\" is an example of...", options: ["A literal statement", "A metaphor (figurative)", "A question", "An instruction"], correctIndex: 1 },
      { question: "A simile compares two things using...", options: ["'is' or 'are'", "'like' or 'as'", "'and' or 'but'", "No connecting word"], correctIndex: 1 },
      { question: "\"The wind whispered\" gives the wind a human quality. This is...", options: ["Simile", "Personification", "Alliteration", "Onomatopoeia"], correctIndex: 1 },
    ],
    [
      { question: "Which is an example of alliteration?", options: ["Raining cats and dogs", "Peter Piper picked peppers", "He's as tall as a tree", "The world is a stage"], correctIndex: 1 },
      { question: "A hyperbole is...", options: ["A small exaggeration", "An extreme exaggeration for emphasis", "A type of rhyme", "A factual statement"], correctIndex: 1 },
      { question: "\"Boom!\" and \"sizzle\" are examples of...", options: ["Metaphor", "Personification", "Onomatopoeia", "Simile"], correctIndex: 2 },
    ],
    [
      { question: "Why do writers use figurative language?", options: ["To confuse readers", "To make writing more vivid, expressive, and memorable", "Because they can't write literally", "To save space"], correctIndex: 1 },
      { question: "\"Her eyes were diamonds\" is a...", options: ["Simile", "Metaphor", "Hyperbole", "Personification"], correctIndex: 1 },
      { question: "Idioms are phrases that...", options: ["Are always literal", "Mean something different from their literal words", "Only use one word", "Are always about animals"], correctIndex: 1 },
    ],
    [
      { question: "\"The world's a stage\" means...", options: ["There's a stage nearby", "Life is like a performance with roles we play", "People like acting", "Stage means a platform"], correctIndex: 1 },
      { question: "Which type of figurative language uses 'like' or 'as'?", options: ["Metaphor", "Simile", "Hyperbole", "Personification"], correctIndex: 1 },
      { question: "What is an oxymoron?", options: ["A very long sentence", "Two contradictory words placed together", "A type of rhythm", "A rhyming pair"], correctIndex: 1 },
    ],
  ],
  "Essay Structure": [
    [
      { question: "What are the three main parts of an essay?", options: ["Beginning, middle, end", "Introduction, body, conclusion", "Title, text, bibliography", "Page 1, page 2, page 3"], correctIndex: 1 },
      { question: "What is a thesis statement?", options: ["The first word of an essay", "The main argument or claim of the essay", "The last sentence only", "A type of conclusion"], correctIndex: 1 },
      { question: "A topic sentence in a body paragraph should...", options: ["Be random", "Introduce the main idea of that paragraph", "Be the same as the thesis", "Be very long"], correctIndex: 1 },
    ],
    [
      { question: "What is a 'hook' in an essay introduction?", options: ["A fishing tool", "An opening that grabs the reader's attention", "The conclusion", "The bibliography"], correctIndex: 1 },
      { question: "What should each body paragraph include?", options: ["Only opinions", "A topic sentence, supporting evidence, and analysis", "Just a quote", "Nothing specific"], correctIndex: 1 },
      { question: "A conclusion should...", options: ["Introduce new arguments", "Summarize key points and restate the thesis", "Be the longest section", "Start with 'In conclusion' only"], correctIndex: 1 },
    ],
    [
      { question: "Why is essay structure important?", options: ["It isn't", "It helps organize ideas so readers can follow the argument", "Only for grades", "It makes essays longer"], correctIndex: 1 },
      { question: "What is a transition word?", options: ["Any random word", "A word that connects ideas between sentences or paragraphs", "The first word of an essay", "A word that ends a paragraph"], correctIndex: 1 },
      { question: "In a 5-paragraph essay, how many body paragraphs are there?", options: ["1", "2", "3", "5"], correctIndex: 2 },
    ],
    [
      { question: "What is the difference between a topic sentence and a thesis?", options: ["No difference", "Thesis states the essay's main argument; topic sentence states the paragraph's point", "Topic sentences are longer", "The thesis goes in a body paragraph"], correctIndex: 1 },
      { question: "Why do we cite sources in an essay?", options: ["To make it longer", "To give credit and avoid plagiarism", "It's optional", "Only for science papers"], correctIndex: 1 },
      { question: "A strong essay revision focuses on...", options: ["Changing the font", "Improving argument clarity, evidence, and flow", "Adding more words", "Just fixing typos"], correctIndex: 1 },
    ],
  ],
  // ==========================================================================
  // COMPUTER SCIENCE
  // ==========================================================================
  "What Is a Computer?": [
    [
      { question: "What does a computer process data using?", options: ["Water", "Electricity and binary (0s and 1s)", "Air pressure", "Light only"], correctIndex: 1 },
      { question: "Which component is the 'brain' of a computer?", options: ["Monitor", "CPU (Central Processing Unit)", "Keyboard", "Mouse"], correctIndex: 1 },
      { question: "What is RAM?", options: ["Permanent storage", "Temporary memory for active tasks", "A type of monitor", "A software program"], correctIndex: 1 },
    ],
    [
      { question: "What is the difference between hardware and software?", options: ["No difference", "Hardware is physical; software is programs and instructions", "Software is heavier", "Hardware is free"], correctIndex: 1 },
      { question: "Which device is an output device?", options: ["Keyboard", "Mouse", "Monitor", "Scanner"], correctIndex: 2 },
      { question: "What does an operating system (OS) do?", options: ["Creates documents", "Manages hardware and software resources", "Plays music only", "Browses the web"], correctIndex: 1 },
    ],
    [
      { question: "Why is computer literacy important today?", options: ["It isn't", "Computers are used in almost every job and daily activity", "Only for gamers", "Only scientists need it"], correctIndex: 1 },
      { question: "What is the Internet?", options: ["A single computer", "A global network connecting millions of computers", "A type of hardware", "A CD-ROM"], correctIndex: 1 },
      { question: "Binary code uses only which two digits?", options: ["0 and 1", "1 and 2", "A and B", "On and Off"], correctIndex: 0 },
    ],
    [
      { question: "What is a byte?", options: ["A single bit", "A group of 8 bits", "A large number", "A type of screen"], correctIndex: 1 },
      { question: "Which of these is an input device?", options: ["Printer", "Speaker", "Keyboard", "Monitor"], correctIndex: 2 },
      { question: "What is cloud computing?", options: ["Computing in the sky", "Storing and accessing data over the internet instead of on your device", "A weather app", "Using a laptop outside"], correctIndex: 1 },
    ],
  ],
  "Introduction to Coding": [
    [
      { question: "What is a programming language?", options: ["A human language like English", "A set of instructions a computer can follow", "A type of keyboard", "A video game"], correctIndex: 1 },
      { question: "What does 'debugging' mean?", options: ["Adding new features", "Finding and fixing errors in code", "Deleting a program", "Running a program"], correctIndex: 1 },
      { question: "Which is a popular beginner programming language?", options: ["Assembly", "Python", "Binary", "Hardware code"], correctIndex: 1 },
    ],
    [
      { question: "What is a variable in programming?", options: ["A fixed number", "A named container that stores a value", "A type of loop", "An error"], correctIndex: 1 },
      { question: "A loop in code is used to...", options: ["Stop the program", "Repeat an action multiple times", "Delete files", "Print one line"], correctIndex: 1 },
      { question: "What is pseudocode?", options: ["Real code that runs on computers", "A plain-language description of a program's logic", "Encrypted code", "Code written in another language"], correctIndex: 1 },
    ],
    [
      { question: "Why is coding a valuable skill?", options: ["It isn't", "It solves problems, automates tasks, and powers technology", "Only for making games", "Only for experts"], correctIndex: 1 },
      { question: "An 'if statement' in code does what?", options: ["Loops forever", "Makes a decision based on a condition", "Prints text", "Creates a variable"], correctIndex: 1 },
      { question: "What is an algorithm?", options: ["A type of computer", "A step-by-step procedure to solve a problem", "A programming language", "A piece of hardware"], correctIndex: 1 },
    ],
    [
      { question: "What is a function in programming?", options: ["A mathematical equation", "A reusable block of code that performs a specific task", "A type of variable", "An error message"], correctIndex: 1 },
      { question: "Comments in code are...", options: ["Executed by the computer", "Notes for humans that the computer ignores", "Required for all programs", "Always in red"], correctIndex: 1 },
      { question: "What does 'compile' mean?", options: ["Delete code", "Translate code into machine-readable instructions", "Run the program", "Save the file"], correctIndex: 1 },
    ],
  ],
  "How the Internet Works": [
    [
      { question: "What is the Internet essentially?", options: ["A single computer", "A global network of connected computers", "A type of software", "A social media site"], correctIndex: 1 },
      { question: "What does HTTP stand for?", options: ["HyperText Transfer Protocol", "High Tech Transfer Process", "Home Tool for Testing Pages", "Hyper Terminal Text Program"], correctIndex: 0 },
      { question: "What is an IP address?", options: ["A person's name", "A unique numeric identifier for a device on a network", "A type of password", "A website URL"], correctIndex: 1 },
    ],
    [
      { question: "What is a web browser?", options: ["A search engine", "Software that lets you access and view websites", "A type of server", "An operating system"], correctIndex: 1 },
      { question: "What does DNS do?", options: ["Encrypts messages", "Converts website names (like google.com) to IP addresses", "Creates websites", "Sends emails"], correctIndex: 1 },
      { question: "What is Wi-Fi?", options: ["A type of cable", "Wireless technology for connecting devices to a network", "A website", "A type of computer"], correctIndex: 1 },
    ],
    [
      { question: "Why is the Internet important in modern life?", options: ["It isn't", "It enables communication, education, commerce, and entertainment globally", "Only for social media","Only for watching videos"], correctIndex: 1 },
      { question: "A 'server' on the Internet is...", options: ["A person who serves food", "A computer that provides data to other computers", "A type of browser", "A search engine"], correctIndex: 1 },
      { question: "HTTPS is more secure than HTTP because it...", options: ["Loads faster", "Encrypts the data between your browser and the website", "Uses more colors", "Has no ads"], correctIndex: 1 },
    ],
    [
      { question: "What is a URL?", options: ["A type of virus", "The address of a web page", "A programming language", "An email account"], correctIndex: 1 },
      { question: "Bandwidth refers to...", options: ["The width of a screen", "The maximum rate of data transfer on a network", "Number of websites visited", "How many tabs are open"], correctIndex: 1 },
      { question: "What is a cookie on the Internet?", options: ["A snack", "A small file stored on your device by a website", "A virus", "A type of browser"], correctIndex: 1 },
    ],
  ],
  "Data and Binary": [
    [
      { question: "What is the base of the binary number system?", options: ["8", "10", "2", "16"], correctIndex: 2 },
      { question: "How many bits make a byte?", options: ["4", "6", "8", "16"], correctIndex: 2 },
      { question: "What does a '1' represent in binary?", options: ["Off/False", "On/True", "Zero", "Nothing"], correctIndex: 1 },
    ],
    [
      { question: "What is the decimal equivalent of binary 1010?", options: ["8", "10", "12", "15"], correctIndex: 1 },
      { question: "Why do computers use binary?", options: ["It's pretty", "Electronic circuits have two states (on/off)", "It's faster than decimal", "Humans prefer it"], correctIndex: 1 },
      { question: "What is a bit?", options: ["A small amount of food", "The smallest unit of data (0 or 1)", "A byte", "A type of file"], correctIndex: 1 },
    ],
    [
      { question: "Why is understanding data important in computing?", options: ["It isn't", "All digital information is stored and processed as data", "Only for scientists", "Data is not important"], correctIndex: 1 },
      { question: "What does ASCII represent?", options: ["A type of binary code for text characters", "An image format", "A programming language", "A type of memory"], correctIndex: 0 },
      { question: "How is a color like red represented in a computer?", options: ["As a word 'red'", "As numerical values (RGB: Red, Green, Blue)", "As a picture", "As a sound"], correctIndex: 1 },
    ],
    [
      { question: "What is a kilobyte (KB) approximately equal to?", options: ["1 byte", "1,000 bytes (actually 1,024)", "1 million bytes", "1 billion bytes"], correctIndex: 1 },
      { question: "A megabyte (MB) is approximately...", options: ["1,000 bytes", "1 million bytes", "1 billion bytes", "1 trillion bytes"], correctIndex: 1 },
      { question: "Image files are larger than text files because...", options: ["They use fancier code", "Images store more data about color, position, and detail", "They're compressed", "Text files are broken"], correctIndex: 1 },
    ],
  ],
  "Algorithms and Logic": [
    [
      { question: "What is an algorithm?", options: ["A type of computer virus", "A step-by-step set of instructions to solve a problem", "A search engine", "A programming language"], correctIndex: 1 },
      { question: "Which is the correct order: input → process → ...?", options: ["Input again", "Output", "Delete", "Sleep"], correctIndex: 1 },
      { question: "What does 'decomposition' mean in problem-solving?", options: ["Breaking a problem into smaller, manageable parts", "Combining all problems", "Ignoring problems", "Making problems bigger"], correctIndex: 0 },
    ],
    [
      { question: "What is a flowchart used for?", options: ["Drawing pictures", "Visually representing the steps in an algorithm", "Playing music", "Calculating sums"], correctIndex: 1 },
      { question: "What is a 'condition' in an algorithm?", options: ["A math equation", "A test that is either true or false, determining which step comes next", "A loop", "A variable"], correctIndex: 1 },
      { question: "In pseudocode, 'WHILE condition DO' creates a...", options: ["Function", "Loop", "Variable", "Condition"], correctIndex: 1 },
    ],
    [
      { question: "Why are algorithms important in computer science?", options: ["They aren't", "They provide clear instructions computers can follow to solve problems", "Only for games","Only for math"], correctIndex: 1 },
      { question: "What is efficiency in an algorithm?", options: ["How long the code is", "How quickly and with how few resources it solves a problem", "How colorful it is", "How many people use it"], correctIndex: 1 },
      { question: "Searching a sorted list is faster than an unsorted list because...", options: ["It isn't faster", "You can eliminate half the options each step (binary search)", "Sorted lists are shorter", "Computers prefer sorted data"], correctIndex: 1 },
    ],
    [
      { question: "What is pattern recognition in algorithms?", options: ["Recognizing faces", "Finding regularities in data to make predictions or decisions", "Drawing patterns", "Memorizing numbers"], correctIndex: 1 },
      { question: "Abstraction in problem-solving means...", options: ["Making things more complex", "Hiding unnecessary details to focus on what matters", "Copying someone else's work", "Ignoring the problem"], correctIndex: 1 },
      { question: "Which sorting method compares adjacent elements and swaps them if needed?", options: ["Merge sort", "Bubble sort", "Binary search", "Quick select"], correctIndex: 1 },
    ],
  ],
  // ==========================================================================
  // GENERAL KNOWLEDGE
  // ==========================================================================
  "World Geography": [
    [
      { question: "What is the largest continent by area?", options: ["Africa", "North America", "Asia", "Europe"], correctIndex: 2 },
      { question: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correctIndex: 3 },
      { question: "What is the longest river in the world?", options: ["Amazon", "Nile", "Mississippi", "Yangtze"], correctIndex: 1 },
    ],
    [
      { question: "What is the tallest mountain in the world?", options: ["K2", "Mount Everest", "Kilimanjaro", "Denali"], correctIndex: 1 },
      { question: "How many continents are there?", options: ["5", "6", "7", "8"], correctIndex: 2 },
      { question: "Which country has the most people?", options: ["USA", "India", "China", "Indonesia"], correctIndex: 1 },
    ],
    [
      { question: "Why is geography important?", options: ["It isn't", "It helps us understand the world's physical features, cultures, and how people interact with the environment", "Only for travelers","Only for maps"], correctIndex: 1 },
      { question: "What is an equator?", options: ["A type of tool", "An imaginary line dividing Earth into Northern and Southern Hemispheres", "A mountain range", "An ocean"], correctIndex: 1 },
      { question: "Which desert is the largest hot desert in the world?", options: ["Gobi", "Sahara", "Antarctic (cold)", "Kalahari"], correctIndex: 1 },
    ],
    [
      { question: "Which country has the most time zones?", options: ["Russia", "USA", "France (with territories)", "China"], correctIndex: 2 },
      { question: "What is a peninsula?", options: ["An island", "Land surrounded by water on three sides", "A mountain", "A desert"], correctIndex: 1 },
      { question: "How many countries are there in the world (approximately)?", options: ["50", "100", "195", "300"], correctIndex: 2 },
    ],
  ],
  "Current Events Awareness": [
    [
      { question: "Why is staying informed about current events important?", options: ["It isn't", "It helps us make informed decisions and understand our world", "Only for politicians","It's boring"], correctIndex: 1 },
      { question: "What is a reliable news source?", options: ["Any social media post", "A source that fact-checks, cites evidence, and has editorial standards", "Rumors from friends", "Anonymous online posts"], correctIndex: 1 },
      { question: "What does 'media literacy' mean?", options: ["Reading newspapers only", "The ability to critically evaluate information from media sources", "Watching TV all day", "Using social media"], correctIndex: 1 },
    ],
    [
      { question: "What is misinformation?", options: ["Correct information", "False or inaccurate information spread unintentionally or deliberately", "Only made-up stories","Weather reports"], correctIndex: 1 },
      { question: "How can you verify a news story?", options: ["Believe everything", "Check multiple reputable sources and look for evidence", "Only read the headline", "Share it immediately"], correctIndex: 1 },
      { question: "What is the difference between local and global news?", options: ["No difference", "Local news covers nearby events; global news covers international events", "Global news is always more important","Local news is always more fun"], correctIndex: 1 },
    ],
    [
      { question: "Why should young people follow current events?", options: ["They shouldn't", "It helps them understand issues that affect their future and community", "Only adults should","It's only for exams"], correctIndex: 1 },
      { question: "What is a primary source for current events?", options: ["A textbook", "Direct eyewitness accounts, official statements, or raw data", "A friend's opinion","A meme"], correctIndex: 1 },
      { question: "Why is it important to get news from different perspectives?", options: ["It isn't", "It gives a fuller, more balanced understanding of events", "It wastes time","Different is always wrong"], correctIndex: 1 },
    ],
    [
      { question: "What is a press conference?", options: ["A phone call", "An event where officials answer questions from journalists", "A type of letter","A radio show"], correctIndex: 1 },
      { question: "What does 'breaking news' mean?", options: ["Something is broken", "Important news happening right now", "Old news","Good news"], correctIndex: 1 },
      { question: "Social media news can be unreliable because...", options: ["It's always accurate", "Anyone can post anything without fact-checking", "It's too slow","It's only for old people"], correctIndex: 1 },
    ],
  ],
  "Famous Inventors and Inventions": [
    [
      { question: "Who is credited with inventing the light bulb (practical version)?", options: ["Albert Einstein", "Thomas Edison", "Isaac Newton", "Nikola Tesla"], correctIndex: 1 },
      { question: "Who invented the World Wide Web?", options: ["Bill Gates", "Steve Jobs", "Tim Berners-Lee", "Mark Zuckerberg"], correctIndex: 2 },
      { question: "What did Alexander Graham Bell invent?", options: ["The telegraph", "The telephone", "The radio", "The television"], correctIndex: 1 },
    ],
    [
      { question: "Who developed the theory of relativity?", options: ["Thomas Edison", "Isaac Newton", "Albert Einstein", "Nikola Tesla"], correctIndex: 2 },
      { question: "What did the Wright brothers achieve?", options: ["Invented the car", "Built and flew the first successful airplane", "Created the telephone", "Invented the computer"], correctIndex: 1 },
      { question: "Who is often called the father of modern computing?", options: ["Charles Babbage (and Ada Lovelace)", "Albert Einstein", "Galileo", "Thomas Edison"], correctIndex: 0 },
    ],
    [
      { question: "Why are inventors important to society?", options: ["They aren't", "Their inventions solve problems and change how we live", "They only make money","They're only famous"], correctIndex: 1 },
      { question: "What did Marie Curie discover?", options: ["Gravity", "Radioactivity (and won Nobel Prizes in physics and chemistry)", "Evolution", "The atom"], correctIndex: 1 },
      { question: "Gutenberg's printing press revolutionized...", options: ["Cooking", "The spread of knowledge and information", "Transportation", "Music"], correctIndex: 1 },
    ],
    [
      { question: "Who invented the first practical airplane?", options: ["Leonardo da Vinci", "The Wright brothers", "Thomas Edison", "Nikola Tesla"], correctIndex: 1 },
      { question: "Ada Lovelace is known for...", options: ["Inventing the telephone", "Writing the first computer algorithm", "Discovering America", "Building the pyramids"], correctIndex: 1 },
      { question: "Many inventions come from...", options: ["Lucky accidents only", "Combining curiosity, experimentation, and solving real problems", "Reading one book","Sleeping"], correctIndex: 1 },
    ],
  ],
  "Environmental Issues": [
    [
      { question: "What is climate change primarily caused by?", options: ["Volcanoes", "Human activities releasing greenhouse gases", "The Moon","Earthquakes"], correctIndex: 1 },
      { question: "What does 'sustainability' mean?", options: ["Using all resources at once", "Meeting present needs without compromising future generations' ability to meet theirs", "Growing more food", "Building taller buildings"], correctIndex: 1 },
      { question: "What is recycling?", options: ["Throwing things in the ocean", "Processing waste materials to make new products", "Burning trash", "Burying everything"], correctIndex: 1 },
    ],
    [
      { question: "What is the greenhouse effect?", options: ["Growing plants indoors", "Gases in the atmosphere trapping heat from the Sun", "A type of glass house","Photosynthesis"], correctIndex: 1 },
      { question: "Why are oceans important for the environment?", options: ["Only for swimming", "They absorb CO2, regulate climate, and support marine life", "They don't matter","Only for fishing"], correctIndex: 1 },
      { question: "What is deforestation?", options: ["Planting trees", "Cutting down forests on a large scale", "Forest fires only","Watering plants"], correctIndex: 1 },
    ],
    [
      { question: "Why should we care about environmental issues?", options: ["We shouldn't", "Our actions today determine the health of the planet for future generations", "Only scientists care","Animals don't matter"], correctIndex: 1 },
      { question: "What is biodiversity?", options: ["Using two languages", "The variety of plant and animal life in an ecosystem", "A type of weather","Digital data"], correctIndex: 1 },
      { question: "Which is a renewable energy source?", options: ["Coal", "Solar power", "Natural gas", "Oil"], correctIndex: 1 },
    ],
    [
      { question: "What can individuals do to help the environment?", options: ["Nothing", "Reduce, reuse, recycle; conserve water and energy", "Only governments can help","Plant one tree and stop"], correctIndex: 1 },
      { question: "What is pollution?", options: ["Clean water", "Introduction of harmful substances into the natural environment", "Planting gardens","Making things shiny"], correctIndex: 1 },
      { question: "Plastic in oceans harms marine life because...", options: ["It looks nice", "Animals mistake it for food or get tangled in it", "It makes water warmer","It's too heavy"], correctIndex: 1 },
    ],
  ],
  "Cultural Traditions Around the World": [
    [
      { question: "Why is learning about other cultures important?", options: ["It isn't", "It fosters respect, understanding, and appreciation for human diversity", "Only for tourists","It's boring"], correctIndex: 1 },
      { question: "What is a cultural tradition?", options: ["A new invention", "A practice, belief, or celebration passed down through generations", "A type of food","A sport"], correctIndex: 1 },
      { question: "Which festival involves lighting oil lamps and fireworks in India?", options: ["Christmas", "Diwali", "Halloween", "Easter"], correctIndex: 1 },
    ],
    [
      { question: "What is the Day of the Dead (Día de los Muertos)?", options: ["A scary holiday", "A Mexican celebration honoring deceased loved ones", "A Thanksgiving-style meal","A Japanese festival"], correctIndex: 1 },
      { question: "Chinese New Year is celebrated with...", options: ["Only fireworks", "Red envelopes, dragon dances, feasts, and family reunions", "Christmas trees", "Snowball fights"], correctIndex: 1 },
      { question: "The concept of 'Ubuntu' from Africa roughly means...", options: ["I'm the best", "I am because we are (community and shared humanity)", "I don't need help","I'll do it alone"], correctIndex: 1 },
    ],
    [
      { question: "Why do different cultures celebrate different festivals?", options: ["They're random", "Festivals reflect unique histories, beliefs, and values of a community", "They're all the same","To sell things"], correctIndex: 1 },
      { question: "Food is an important part of cultural identity because...", options: ["It isn't", "Recipes carry history, family traditions, and regional identity", "Everyone eats the same food","Food has no meaning"], correctIndex: 1 },
      { question: "Which holiday is celebrated by many people in Japan in spring with cherry blossoms?", options: ["Thanksgiving", "Hanami (flower viewing)", "Halloween", "Diwali"], correctIndex: 1 },
    ],
    [
      { question: "What is cultural exchange?", options: ["Trading items", "Sharing and learning from each other's customs, traditions, and ideas", "Moving to a new country","Ignoring other cultures"], correctIndex: 1 },
      { question: "How do stories and myths reflect culture?", options: ["They don't", "They pass down values, morals, and history through generations", "They're all made up","Only fiction matters"], correctIndex: 1 },
      { question: "Which of these is a universal human experience across cultures?", options: ["Eating pizza", "Celebrating milestones, telling stories, and forming communities", "Speaking English","Using smartphones"], correctIndex: 1 },
    ],
  ],
};

function getSubjectForTopic(topic: string): string | null {
  for (const [subject, topics] of Object.entries(TOPICS_BY_SUBJECT)) {
    if (topics.includes(topic)) return subject;
  }
  return null;
}

const SUBJECT_FALLBACK_QUESTIONS: Record<string, InlineTestQuestion[]> = {
  Math: [
    { question: "Which key concept from this lesson would help you solve a real-world problem?", options: ["Adding numbers", "The main technique or formula taught", "Memorizing facts", "None of the above"], correctIndex: 1 },
    { question: "What is the most important step in solving a math problem?", options: ["Guessing", "Understanding what's being asked before calculating", "Writing the longest answer", "Skipping steps"], correctIndex: 1 },
    { question: "Why is math useful in everyday life?", options: ["It isn't", "It helps us measure, budget, and solve practical problems", "Only for exams", "Only for scientists"], correctIndex: 1 },
  ],
  Science: [
    { question: "What was the main scientific concept explored in this lesson?", options: ["A historical date", "The process or theory that was explained", "A person's name", "None of these"], correctIndex: 1 },
    { question: "How do scientists test their ideas?", options: ["By guessing", "Through experiments, observation, and evidence", "By asking friends", "By reading one book"], correctIndex: 1 },
    { question: "Why is science important for understanding the world?", options: ["It isn't", "It gives us evidence-based explanations for how things work", "Only for school", "It's too hard"], correctIndex: 1 },
  ],
  History: [
    { question: "What was the most significant event or idea from this lesson?", options: ["A random fact", "The key event, person, or movement that was discussed", "Nothing important", "The page number"], correctIndex: 1 },
    { question: "Why do we study history?", options: ["To memorize dates", "To learn from the past and understand how the world changed", "For fun only", "We don't need to"], correctIndex: 1 },
    { question: "How does understanding history help us today?", options: ["It doesn't", "It helps us make better decisions by learning from past successes and mistakes", "Only for teachers", "It's all in the past"], correctIndex: 1 },
  ],
  English: [
    { question: "What writing or language skill did this lesson focus on?", options: ["Math", "The specific skill or technique that was taught", "Nothing", "A science topic"], correctIndex: 1 },
    { question: "How do strong writing skills help in daily life?", options: ["They don't", "They help us communicate clearly in school, work, and relationships", "Only for authors", "Only for exams"], correctIndex: 1 },
    { question: "What makes good writing effective?", options: ["Long sentences", "Clear ideas, strong vocabulary, and good organization", "Using big words only", "Writing a lot"], correctIndex: 1 },
  ],
  "Computer Science": [
    { question: "What was the main computing concept from this lesson?", options: ["A history fact", "The technology or concept that was explained", "Nothing", "A recipe"], correctIndex: 1 },
    { question: "Why is computer science important today?", options: ["It isn't", "It powers almost every aspect of modern life", "Only for programmers", "It's outdated"], correctIndex: 1 },
    { question: "What skill does coding primarily develop?", options: ["Art skills", "Problem-solving and logical thinking", "Only memory", "Nothing useful"], correctIndex: 1 },
  ],
  "General Knowledge": [
    { question: "What was the most interesting fact you learned in this lesson?", options: ["None", "The key fact or insight that stood out", "A made-up fact", "Nothing interesting"], correctIndex: 1 },
    { question: "Why is general knowledge valuable?", options: ["It isn't", "It helps us understand the world and connect ideas across subjects", "Only for quiz shows", "It wastes time"], correctIndex: 1 },
    { question: "How does learning about diverse topics help us?", options: ["It doesn't", "It builds empathy, curiosity, and a broader understanding", "It's boring", "It's only for adults"], correctIndex: 1 },
  ],
};

export function getInlineTestQuestions(topic: string, part: number): InlineTestQuestion[] {
  const bank = INLINE_TEST_BANK[topic];
  if (bank && bank[part - 1]) return bank[part - 1];

  const subject = getSubjectForTopic(topic);
  if (subject && SUBJECT_FALLBACK_QUESTIONS[subject]) {
    return SUBJECT_FALLBACK_QUESTIONS[subject];
  }

  return [
    { question: "What was the most important thing you learned in this lesson?", options: ["Nothing new", "A key concept or fact from the topic", "Just vocabulary", "I forgot"], correctIndex: 1 },
    { question: "How would you explain this topic to a classmate?", options: ["I couldn't", "Using the main ideas and examples from the lesson", "I'd skip it", "By reading the textbook"], correctIndex: 1 },
    { question: "What question do you still have about this topic?", options: ["None", "Something I want to explore further", "I know everything", "What topic?"], correctIndex: 1 },
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
