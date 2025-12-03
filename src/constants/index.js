/**
 * Application Constants
 * Centralized configuration values
 */

export const CONSTANTS = {
  // Conservative BAC elimination rate based on Jones, A.W. (2010)
  // "Evidence-based survey of the elimination rates of ethanol from blood with applications in forensic casework"
  // Forensic Science International, 200(1-3), 1-20.
  // Using 10 mg/100mL/h (0.010% per hour) - the lower end of the physiological range
  // for fasted subjects, providing safer, more conservative estimates for sobriety time.
  METABOLISM_RATE: 0.010,

  // Slow metabolism rate (0.005% per hour) - accounting for the margin of error where
  // modern studies show metabolism can be twice as slow for some individuals
  SLOW_METABOLISM_RATE: 0.005,

  GRAMS_PER_STANDARD_DRINK: 14,
  LBS_TO_KG: 0.453592,
  MALE_BODY_WATER: 0.68,
  FEMALE_BODY_WATER: 0.55,
  STANDARD_DRINK_OZ: 0.6,
  LEGAL_LIMIT: 0.08,
  MIN_WEIGHT: 50,
  MAX_WEIGHT: 500,
  ROBOT_MESSAGE_DURATION: 5000,
  JOKE_DURATION: 7000,
  MIN_TIP_AMOUNT: 3,
  LEGAL_DRINKING_AGE: 21,
  REFUND_WINDOW_DAYS: 30,
};

// Environment-based configuration
export const CONFIG = {
  STRIPE_PAYMENT_LINK: process.env.REACT_APP_STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/aFa14m7kE8UfdjB00g5sA01',
  SUPPORT_EMAIL: process.env.REACT_APP_SUPPORT_EMAIL || 'drinkbot3000@gmail.com',
};

// Emojis as constants to avoid encoding issues
export const EMOJIS = {
  ROBOT: '\uD83E\uDD16', // 🤖
  HEART: '\uD83D\uDC9A', // 💚
  TOP_HAT: '\uD83C\uDFA9', // 🎩
  SHIELD: '\uD83D\uDEE1\uFE0F', // 🛡️
  WATER: '\uD83D\uDCA7', // 💧
  WIZARD: '\uD83E\uDDD9', // 🧙
  DROPLET: '\uD83D\uDCA6', // 💦
};

// Jokes (family-friendly only)
export const JOKES = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "What do you call a bear with no teeth? A gummy bear!",
  "Why did the scarecrow win an award? He was outstanding in his field!",
  "What do you call a fake noodle? An impasta!",
  "What's orange and sounds like a parrot? A carrot!",
  "Why did the math book look so sad? Because it had too many problems!",
  "Why don't skeletons fight each other? They don't have the guts!",
  "What do you call a fish wearing a bowtie? Sofishticated!",
  "Why did the bicycle fall over? Because it was two-tired!",
  "What do you call a sleeping bull? A bulldozer!",
  "Why can't your nose be 12 inches long? Because then it would be a foot!",
  "What do you call cheese that isn't yours? Nacho cheese!",
  "Why don't programmers like nature? It has too many bugs!",
  "What do you call a snowman with a six-pack? An abdominal snowman!",
  "What do you call a lazy kangaroo? A pouch potato!",
  "Why don't mountains get cold? They wear snow caps!",
  "What do you call a magic dog? A labracadabrador!",
  "Why did the picture go to jail? It was framed!",
  "What do you call a boomerang that won't come back? A stick!",
  "What do you call a cow during an earthquake? A milkshake!",
];

export const ROBOT_GREETINGS = [
  `Greetings! I am DrinkBot3000, your safety companion! ${EMOJIS.ROBOT}`,
  `Beep boop! Ready to help you stay safe, dear friend! ${EMOJIS.TOP_HAT}`,
  `*mechanical bow* Your safety assistant reporting for duty! ${EMOJIS.ROBOT}`,
  `Salutations! Let us monitor responsibly together! ${EMOJIS.SHIELD}`,
  `*whirrs politely* I shall help you stay safe this evening! ${EMOJIS.TOP_HAT}`,
];

export const ROBOT_COMMENTS = [
  `*calculates thoughtfully* Remember to stay hydrated! ${EMOJIS.ROBOT}`,
  `Beep boop! Please pace yourself, valued user! ${EMOJIS.TOP_HAT}`,
  `*adjusts monocle* Safety first, always! ${EMOJIS.WIZARD}`,
  `*whirrs concernedly* Time for water, perhaps? ${EMOJIS.WATER}`,
  `My sensors suggest taking it slow! ${EMOJIS.ROBOT}`,
  `*beeps approvingly* Excellent responsibility detected! ${EMOJIS.DROPLET}`,
  `*mechanical nod* You're making wise choices! ${EMOJIS.TOP_HAT}`,
];
