/**
 * Application Constants
 * Centralized constants for the DrinkBot3000 application
 */

export const CONSTANTS = {
  // BAC Calculation Constants
  METABOLISM_RATE: 0.015,
  GRAMS_PER_STANDARD_DRINK: 14,
  LBS_TO_KG: 0.453592,
  MALE_BODY_WATER: 0.68,
  FEMALE_BODY_WATER: 0.55,
  STANDARD_DRINK_OZ: 0.6,
  LEGAL_LIMIT: 0.08,

  // Validation Constants
  MIN_WEIGHT: 50,
  MAX_WEIGHT: 500,
  MIN_DRINK_COUNT: 0,
  MAX_DRINK_COUNT: 50,
  MIN_HOURS: 0,
  MAX_HOURS: 48,
  MIN_ABV: 0,
  MAX_ABV: 100,
  MIN_OUNCES: 0.1,
  MAX_OUNCES: 200,

  // UI Constants
  ROBOT_MESSAGE_DURATION: 5000,
  JOKE_DURATION: 7000,

  // Payment Constants
  MIN_TIP_AMOUNT: 3,
  STRIPE_FEE_PERCENTAGE: 0.029,
  STRIPE_FEE_FIXED: 0.30,

  // Legal Constants
  LEGAL_DRINKING_AGE: 21,
  REFUND_WINDOW_DAYS: 30,
};

export const ROBOT_GREETINGS = [
  "Greetings! I am DrinkBot3000, your safety companion! 🤖",
  "Beep boop! Ready to help you stay safe, dear friend! 🎩",
  "*mechanical bow* Your safety assistant reporting for duty! 🤖",
  "Salutations! Let us monitor responsibly together! 🛡️",
  "*whirrs politely* I shall help you stay safe this evening! 🎩",
];

export const ROBOT_COMMENTS = [
  "*calculates thoughtfully* Remember to stay hydrated! 🤖",
  "Beep boop! Please pace yourself, valued user! 🎩",
  "*adjusts monocle* Safety first, always! 🧐",
  "*whirrs concernedly* Time for water, perhaps? 💧",
  "My sensors suggest taking it slow! 🤖",
  "*beeps approvingly* Excellent responsibility detected! 💦",
  "*mechanical nod* You're making wise choices! 🎩",
];

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

export default CONSTANTS;
