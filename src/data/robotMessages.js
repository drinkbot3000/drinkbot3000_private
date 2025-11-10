/**
 * Robot personality messages for various interactions
 */

export const ROBOT_GREETINGS = [
  "Greetings, human! I am DrinkBot3000, at your service! 🤖",
  "Beep boop! Ready to track your beverages, dear patron! 🎩",
  "*mechanical bow* Your robotic butler reporting for duty! 🤖",
  "Salutations! Let us monitor your consumption with precision! 🍷",
  "*whirrs politely* I shall keep watch over your evening! 🎩",
];

export const ROBOT_COMMENTS = [
  "*calculates thoughtfully* Most interesting data, human! 🤖",
  "Beep boop! My circuits detect you're having quite an evening! 🎩",
  "*adjusts monocle* I say, do pace yourself, good patron! 🧐",
  "*whirrs concernedly* Perhaps some water, dear human? 💧",
  "My sensors suggest moderation would be wise! 🤖",
  "*beeps approvingly* Excellent hydration protocols detected! 💦",
  "*mechanical nod* You're doing splendidly, if I may say! 🎩",
];

/**
 * Get a random greeting message
 * @returns {string} A random greeting
 */
export const getRandomGreeting = () => {
  return ROBOT_GREETINGS[Math.floor(Math.random() * ROBOT_GREETINGS.length)];
};

/**
 * Get a random comment message
 * @returns {string} A random comment
 */
export const getRandomComment = () => {
  return ROBOT_COMMENTS[Math.floor(Math.random() * ROBOT_COMMENTS.length)];
};
